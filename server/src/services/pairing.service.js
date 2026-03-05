import crypto from "crypto";
import { AppError } from "../utils/appError.js";
import { Pairing as PairingErrors } from "../constants/errors.js";
import {
  createPairingSession,
  findByCode,
  findByBarcodeToken,
  consumePairingSession,
} from "../dal/pairing.dal.js";
import { getChildByParentId } from "../dal/parent.dal.js";
import { issueChildToken } from "./auth.service.js";
import { createDevice, findDeviceByBarcodeOrCode } from "../dal/device.dal.js";
import { DeviceType } from "../constants/deviceType.js";

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
  if (!child) throw new AppError(PairingErrors.CHILD_NOT_FOUND);

  if (child.isActive === false) {
    throw new AppError(PairingErrors.CHILD_NOT_ACTIVE);
  }
}

export async function generatePairing(parentId, childIdFromBody) {
  const parentIdStr = String(parentId);

  if (!childIdFromBody) {
    throw new AppError(PairingErrors.CHILD_SELECTION_REQUIRED);
  }

  // Check if the child belongs to the parent and is active
  const childList = await getChildByParentId(parentIdStr);
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
  const hasBarcode = barcodeToken != null && String(barcodeToken).trim() !== "";

  if (!hasCode && !hasBarcode) throw new AppError(PairingErrors.LINK_NEED_ONE);
  if (hasCode && hasBarcode) throw new AppError(PairingErrors.LINK_ONLY_ONE);

  return hasCode
    ? { byCode: true, value: String(code).trim() }
    : { byCode: false, value: String(barcodeToken).trim() };
}

// Link device to child using code or barcode token
export async function linkByCodeOrToken({ code="", barcodeToken="", deviceName="", deviceType="OTHER" }) {
  const { byCode, value } = validateLinkPayload({ code, barcodeToken });
  const session = byCode ? await findByCode(value) : await findByBarcodeToken(value);

 if (!session) {
    throw new AppError(PairingErrors.SESSION_NOT_FOUND);
  }

  const parentId = String(session.parentId);
  const childId = String(session.childId);
  if (!childId) throw new AppError(PairingErrors.CHILD_NOT_FOUND);
  if (!parentId) throw new AppError(PairingErrors.PARENT_NOT_FOUND);

  // Check if session is already used or expired
  const consumed = await consumePairingSession(session._id);
  if (!consumed) { 
    throw new AppError(PairingErrors.SESSION_ALREADY_USED);
  } 

  const devicePayload  = validateDevicePayload( deviceName, deviceType ); 
  const currentDevice = await createOrGetDeviceForSession(session, devicePayload);

  // Child token is used to authenticate the child on the device
  const tokenData = await issueChildToken(parentId, childId);

  return {
    ...tokenData,
    deviceId: String(currentDevice._id),
  };
}

function validateDevicePayload(deviceName, deviceType) {
  if (!Object.values(DeviceType).includes(deviceType)) {
    throw new AppError(PairingErrors.INVALID_DEVICE_TYPE);
  }

  return {
    deviceName,
    deviceType,
  };
}

async function createOrGetDeviceForSession(session, devicePayload) {
  const existing = await findDeviceByBarcodeOrCode(session);
  if (existing) return existing;

  return createDevice({
    name: devicePayload.deviceName,
    type: devicePayload.deviceType,
    isLocked: false,
    code: session.code || "",
    location: "",
    isActive: true,
    barcodeToken: session.barcodeToken || "",
    applications: [],
    parentId: String(session.parentId),
    childId: String(session.childId),
    screenTime: {},
  });
}
