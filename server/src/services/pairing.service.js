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
import { createDevice, findDeviceByBarcode } from "../dal/device.dal.js";
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

function assertChildBelongsToParent(childList, childId) {
  const belongs = childList.some((c) => String(c._id) === String(childId));
  if (!belongs) throw new AppError(PairingErrors.CHILD_NOT_FOUND);
}

async function createUniqueCode() {
  for (let attempt = 0; attempt < SHORT_CODE_MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    const existing = await findByCode(code);
    if (!existing) return code;
  }
  throw new AppError(PairingErrors.SHORT_CODE_COLLISION);
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



async function resolveChildIdForSession(session) {
  const parentId = String(session.parentId);
  if (session.childId) return { parentId, childId: String(session.childId) };

  const childList = await getChildByParentId(parentId);
  const active = childList.filter((c) => c.isActive !== false);

  if (active.length === 0) throw new AppError(PairingErrors.NO_CHILD);
  if (active.length > 1) throw new AppError(PairingErrors.CHILD_SELECTION_REQUIRED);

  return { parentId, childId: String(active[0]._id) };
}

export async function generatePairing(parentId, childIdFromBody) {
  const parentIdStr = String(parentId);

  if (childIdFromBody) {
    const childList = await getChildByParentId(parentIdStr);
    assertChildBelongsToParent(childList, childIdFromBody);
  }

  const code = await createUniqueCode();
  const barcodeToken = generateBarcodeToken();
  const expiresAt = new Date(Date.now() + PAIRING_TTL_MINUTES * MS_PER_MINUTE);

  await createPairingSession({
    code,
    barcodeToken,
    parentId: parentIdStr,
    childId: childIdFromBody ? String(childIdFromBody) : undefined,
    expiresAt,
  });

  return {
    code,
    barcodeToken,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function linkByCodeOrToken(payload) {
  const { byCode, value } = validateLinkPayload(payload);
  const session = byCode ? await findByCode(value) : await findByBarcodeToken(value);

 if (!session) {
    throw new AppError(PairingErrors.SESSION_NOT_FOUND);
  }
  
  const consumed = await consumePairingSession(session._id);
  if (!consumed) { 
    throw new AppError(PairingErrors.SESSION_ALREADY_USED);
  }

  const { parentId, childId } = await resolveChildIdForSession(session);

  const { deviceName, deviceType } = normalizeDevicePayload(payload);
  const device = await createOrGetDeviceForSession(session, parentId, childId, deviceName, deviceType);

  const tokenData = await issueChildToken(parentId, childId);

  return {
    ...tokenData,
    deviceId: String(device._id),
  };
}

function normalizeDevicePayload(payload) {
  const deviceName = String(payload.deviceName || "").trim();
  const deviceType = String(payload.deviceType || "").trim();

  if (!deviceType) throw new AppError(PairingErrors.DEVICE_TYPE_REQUIRED);
  if (!Object.values(DeviceType).includes(deviceType)) {
    throw new AppError(PairingErrors.INVALID_DEVICE_TYPE);
  }

  return {
    deviceName: deviceName || "Child device",
    deviceType,
  };
}

async function createOrGetDeviceForSession(session, parentId, childId, deviceName, deviceType) {
  const existing = await findDeviceByBarcode(session.barcodeToken);
  if (existing) return existing;

  return createDevice({
    name: deviceName,
    type: deviceType,
    isLocked: false,
    code: Number(session.code) || 0,
    location: "",
    isActive: true,
    barcode: session.barcodeToken,
    applications: [],
    parentId,
    childId,
    screenTime: {},
  });
}
