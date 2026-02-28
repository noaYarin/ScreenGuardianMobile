import crypto from "crypto";
import { AppError } from "../utils/appError.js";
import {
  createPairingSession,
  findByCode,
  findByBarcodeToken,
  consumePairingSession,
} from "../dal/pairing.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";
import { issueChildToken } from "./auth.service.js";

const PAIRING_TTL_MINUTES = 5;
const SHORT_CODE_MAX_ATTEMPTS = 20;
const MS_PER_MINUTE = 60 * 1000;

const ERRORS = {
  CHILD_NOT_FOUND: { status: 400, code: "CHILD_NOT_FOUND", message: "Child does not belong to this parent" },
  SHORT_CODE_COLLISION: { status: 503, code: "SHORT_CODE_COLLISION", message: "Could not generate unique code, try again" },
  LINK_NEED_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide either code or barcodeToken" },
  LINK_ONLY_ONE: { status: 400, code: "VALIDATION_ERROR", message: "Provide only one of code or barcodeToken" },
  SESSION_NOT_FOUND: { status: 404, code: "SESSION_NOT_FOUND", message: "Pairing session not found" },
  SESSION_ALREADY_USED: { status: 410, code: "SESSION_ALREADY_USED", message: "This pairing code has already been used" },
  SESSION_EXPIRED: { status: 410, code: "SESSION_EXPIRED", message: "Pairing code has expired" },
  NO_CHILDREN: { status: 400, code: "NO_CHILDREN", message: "Parent has no active children" },
  CHILD_SELECTION_REQUIRED: { status: 400, code: "CHILD_SELECTION_REQUIRED", message: "Parent has multiple children; childId must be specified when generating the pairing code" },
};

function generateCode() {
  return String(crypto.randomInt(1000, 10000));
}

function generateBarcodeToken() {
  return crypto.randomUUID();
}

function assertChildBelongsToParent(children, childId) {
  const belongs = children.some((c) => String(c._id) === String(childId));
  if (!belongs) throw new AppError(ERRORS.CHILD_NOT_FOUND);
}

async function createUniqueCode() {
  for (let attempt = 0; attempt < SHORT_CODE_MAX_ATTEMPTS; attempt++) {
    const code = generateCode();
    const existing = await findByCode(code);
    if (!existing) return code;
  }
  throw new AppError(ERRORS.SHORT_CODE_COLLISION);
}

function validateLinkPayload(payload) {
  const { code, barcodeToken } = payload;
  const hasCode = code != null && String(code).trim() !== "";
  const hasBarcode = barcodeToken != null && String(barcodeToken).trim() !== "";

  if (!hasCode && !hasBarcode) throw new AppError(ERRORS.LINK_NEED_ONE);
  if (hasCode && hasBarcode) throw new AppError(ERRORS.LINK_ONLY_ONE);

  return hasCode
    ? { byCode: true, value: String(code).trim() }
    : { byCode: false, value: String(barcodeToken).trim() };
}

function validateSession(session) {
  if (!session) throw new AppError(ERRORS.SESSION_NOT_FOUND);
  if (session.usedAt) throw new AppError(ERRORS.SESSION_ALREADY_USED);
  if (new Date(session.expiresAt) <= new Date()) throw new AppError(ERRORS.SESSION_EXPIRED);
}

async function resolveChildIdForSession(session) {
  const parentId = String(session.parentId);
  if (session.childId) return { parentId, childId: String(session.childId) };

  const children = await getChildrenByParentId(parentId);
  const active = children.filter((c) => c.isActive !== false);

  if (active.length === 0) throw new AppError(ERRORS.NO_CHILDREN);
  if (active.length > 1) throw new AppError(ERRORS.CHILD_SELECTION_REQUIRED);

  return { parentId, childId: String(active[0]._id) };
}

export async function generatePairing(parentId, childIdFromBody) {
  const parentIdStr = String(parentId);

  if (childIdFromBody) {
    const children = await getChildrenByParentId(parentIdStr);
    assertChildBelongsToParent(children, childIdFromBody);
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

  validateSession(session);
  await consumePairingSession(session._id);

  const { parentId, childId } = await resolveChildIdForSession(session);
  return issueChildToken(parentId, childId);
}
