import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { Auth as AuthErrors } from "../constants/errors.js";
import { createParent, findParentByEmail, findParentByGoogleId } from "../dal/parent.dal.js";
import { Role } from "../constants/role.js";

const BCRYPT_ROUNDS = 10;
const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function issueAuthResponse(parent) {
  const parentId = parent._id.toString();
  const token = signToken({ parentId, role: Role.PARENT});
  return { token, parentId };
}

export async function issueChildToken(parentId, childId) {
  const parentIdStr = parentId != null ? String(parentId) : null;
  const childIdStr = childId != null ? String(childId) : null;
  // JWT with parentId and childId 
  const token = signToken({ parentId: parentIdStr, childId: childIdStr, role: Role.CHILD });
  return { token, parentId: parentIdStr, childId: childIdStr };
}

async function verifyGoogleIdToken(idToken) {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new AppError(AuthErrors.GOOGLE_AUTH_DISABLED);
  }
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    return ticket.getPayload();
  } catch {
    throw new AppError(AuthErrors.INVALID_GOOGLE_TOKEN);
  }
}

async function resolveParentFromGooglePayload(payload) {
  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name ?? email?.split("@")[0] ?? "User";

  if (!email) {
    throw new AppError(AuthErrors.NO_EMAIL);
  }

  let parent = await findParentByGoogleId(googleId);
  if (parent) return parent;

  parent = await findParentByEmail(email);
  if (parent) {
    parent.googleId = googleId;
    await parent.save();
    return parent;
  }

  return createParent({ email, googleId, name, children: [] });
}

export async function registerParent({ email, password, name, phoneNumber }) {
  const existing = await findParentByEmail(email);
  if (existing) {
    throw new AppError(AuthErrors.EMAIL_EXISTS);
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const created = await createParent({
    email,
    password: hash,
    name,
    phoneNumber,
    children: [],
  });

  return issueAuthResponse(created);
}

export async function loginParent({ email, password }) {
  const parent = await findParentByEmail(email);
  if (!parent) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS);
  }
  if (!parent.password) {
    throw new AppError(AuthErrors.USE_GOOGLE);
  }

  const valid = await bcrypt.compare(password, parent.password);
  if (!valid) {
    throw new AppError(AuthErrors.INVALID_CREDENTIALS);
  }

  return issueAuthResponse(parent);
}

export async function loginWithGoogle(idToken) {
  const payload = await verifyGoogleIdToken(idToken);
  const parent = await resolveParentFromGooglePayload(payload);
  return issueAuthResponse(parent);
}
