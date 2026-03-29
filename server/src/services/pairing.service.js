import crypto from "crypto";
import { AppError } from "../utils/appError.js";
import { Pairing as PairingErrors } from "../constants/errors.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { DevicePlatform } from "../constants/devicePlatform.js";
import { DeviceType } from "../constants/deviceType.js";

import {
  createPairingSession,
  findByCode,
  findByBarcodeToken,
  consumePairingSession,
} from "../dal/pairing.dal.js";

import {
  getChildByParentId,
  getChildrenByParentId,
} from "../dal/parent.dal.js";

import { issueChildToken } from "./auth.service.js";

import {
  createDevice,
  findDeviceByDeviceId,
  updateDeviceActivation,
} from "../dal/device.dal.js";

const PAIRING_TTL_MINUTES = 5;
const SHORT_CODE_MAX_ATTEMPTS = 20;
const MS_PER_MINUTE = 60 * 1000;

function generateCode() {
  return String(crypto.randomInt(1000, 10000));
}

function generateBarcodeToken() {
  return crypto.randomUUID();
}

async function createUniqueCode() {
  for (let attempt = 0; attempt < SHORT_CODE_MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    const existing = await findByCode(code);
    if (!existing) return code;
  }

  throw new AppError(PairingErrors.SHORT_CODE_COLLISION);
}

function assertChildBelongsToParent(childList, childId) {
  const child = childList.find((c) => String(c._id) === String(childId));

  if (!child) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  if (child.isActive === false) {
    throw new AppError(PairingErrors.CHILD_NOT_ACTIVE);
  }
}

function normalizeDevicePlatform(platform = "") {
  const normalized = String(platform).trim().toUpperCase();
  return Object.values(DevicePlatform).includes(normalized)
    ? normalized
    : DevicePlatform.OTHER;
}

function normalizeDeviceType(deviceType = "") {
  const normalized = String(deviceType).trim().toUpperCase();
  return Object.values(DeviceType).includes(normalized)
    ? normalized
    : DeviceType.OTHER;
}

export async function generatePairing(parentId, childIdFromBody) {
  const parentIdStr = String(parentId);

  if (!childIdFromBody) {
    throw new AppError(PairingErrors.CHILD_SELECTION_REQUIRED);
  }

  // Check if the child belongs to the parent and is active
  const childList = await getChildrenByParentId(parentIdStr);
  assertChildBelongsToParent(childList, childIdFromBody);

  const code = await createUniqueCode();
  const barcodeToken = generateBarcodeToken();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MINUTES * MS_PER_MINUTE);

  await createPairingSession({
    code,
    barcodeToken,
    parentId: parentIdStr,
    childId: String(childIdFromBody),
    expiresAt,
  });

  return {
    code,
    barcodeToken,
    expiresAt: expiresAt.toISOString(),
  };
}

function validateLinkPayload(payload) {
  const { code, barcodeToken } = payload;

  const hasCode = code != null && String(code).trim() !== "";
  const hasBarcode =
    barcodeToken != null && String(barcodeToken).trim() !== "";

  if (!hasCode && !hasBarcode) {
    throw new AppError(PairingErrors.LINK_NEED_ONE);
  }

  if (hasCode && hasBarcode) {
    throw new AppError(PairingErrors.LINK_ONLY_ONE);
  }

  return hasCode
    ? { byCode: true, value: String(code).trim() }
    : { byCode: false, value: String(barcodeToken).trim() };
}

// Link device to child using code or barcode token
export async function linkByCodeOrToken({
  code = "",
  barcodeToken = "",
  deviceName = "",
  deviceType = "OTHER",
  platform = "OTHER",
  deviceId = "",
}) {
  const normalizedDeviceId = String(deviceId).trim();

  if (!normalizedDeviceId) {
    throw new AppError(CommonErrors.INVALID_DEVICE_ID);
  }

  const normalizedDeviceName =
    String(deviceName).trim() || "Child Device";
  const normalizedDeviceType = normalizeDeviceType(deviceType);
  const normalizedPlatform = normalizeDevicePlatform(platform);

  const { byCode, value } = validateLinkPayload({ code, barcodeToken });

  const session = byCode
    ? await findByCode(value)
    : await findByBarcodeToken(value);

  if (!session) {
    throw new AppError(PairingErrors.SESSION_NOT_FOUND);
  }

  const sessionCode = session.code;
  const sessionBarcode = session.barcodeToken;

  const parentId = String(session.parentId);
  const childId = String(session.childId);

  if (!childId) {
    throw new AppError(CommonErrors.CHILD_NOT_FOUND);
  }

  if (!parentId) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }

  const child = await getChildByParentId(parentId, childId);
  const childName = child?.name != null ? String(child.name) : "";

  let currentDevice = await findDeviceByDeviceId(normalizedDeviceId);

  if (currentDevice) {
    if (currentDevice.isActive) {
      throw new AppError(PairingErrors.DEVICE_ALREADY_LINKED);
    }

    currentDevice = await updateDeviceActivation(normalizedDeviceId, {
      childId,
      parentId,
      deviceName: normalizedDeviceName,
    });
  } else {
    currentDevice = await createDevice({
      deviceId: normalizedDeviceId,
      name: normalizedDeviceName,
      type: normalizedDeviceType,
      platform: normalizedPlatform,
      isLocked: false,
      isActive: true,
      code: sessionCode || "",
      barcodeToken: sessionBarcode || "",
      location: {
        lat: 0,
        lng: 0,
        lastUpdated: new Date(),
      },
      applications: [],
      parentId,
      childId,
      screenTime: {},
    });
  }

  if (!currentDevice?._id) {
    throw new AppError(CommonErrors.INVALID_DEVICE_ID);
  }

  // Consume the pairing session only after the device was linked successfully
  const consumed = await consumePairingSession(session._id);
  if (!consumed) {
    throw new AppError(PairingErrors.SESSION_INVALID);
  }

  const mongoDeviceId = String(currentDevice._id);
  const tokenData = await issueChildToken(parentId, childId, mongoDeviceId);

  return {
    ...tokenData,
    deviceId: mongoDeviceId,
    physicalId: normalizedDeviceId,
    childName,
  };
}