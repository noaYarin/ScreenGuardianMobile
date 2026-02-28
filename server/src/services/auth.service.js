import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { createParent, findParentByEmail, findParentByGoogleId } from "../dal/parent.dal.js";

const BCRYPT_ROUNDS = 10;
const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

function issueAuthResponse(parent) {
  const parentId = parent._id.toString();
  const token = signToken({ parentId, role: "PARENT" });
  return { token, parentId };
}

export function issueChildToken(parentId, childId) {
  const parentIdStr = parentId != null ? String(parentId) : null;
  const childIdStr = childId != null ? String(childId) : null;
  const token = signToken({ parentId: parentIdStr, childId: childIdStr, role: "CHILD" });
  return { token, parentId: parentIdStr, childId: childIdStr };
}

async function verifyGoogleIdToken(idToken) {
  if (!googleClient || !env.GOOGLE_CLIENT_ID) {
    throw new AppError({ status: 503, code: "GOOGLE_AUTH_DISABLED", message: "Google sign-in is not configured" });
  }
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: env.GOOGLE_CLIENT_ID });
    return ticket.getPayload();
  } catch {
    throw new AppError({ status: 401, code: "INVALID_GOOGLE_TOKEN", message: "Invalid or expired Google token" });
  }
}

async function resolveParentFromGooglePayload(payload) {
  const googleId = payload.sub;
  const email = payload.email;
  const name = payload.name ?? email?.split("@")[0] ?? "User";

  if (!email) {
    throw new AppError({ status: 400, code: "NO_EMAIL", message: "Google account has no email" });
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

export async function registerParent({ email, password, name, phoneNumber, gender }) {
  const existing = await findParentByEmail(email);
  if (existing) {
    throw new AppError({ status: 409, code: "EMAIL_EXISTS", message: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const created = await createParent({
    email,
    password: hash,
    name,
    phoneNumber,
    gender,
    children: [],
  });

  return issueAuthResponse(created);
}

export async function loginParent({ email, password }) {
  const parent = await findParentByEmail(email);
  if (!parent) {
    throw new AppError({ status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }
  if (!parent.password) {
    throw new AppError({ status: 400, code: "USE_GOOGLE", message: "This account uses Google sign-in" });
  }

  const valid = await bcrypt.compare(password, parent.password);
  if (!valid) {
    throw new AppError({ status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  return issueAuthResponse(parent);
}

export async function loginWithGoogle(idToken) {
  const payload = await verifyGoogleIdToken(idToken);
  const parent = await resolveParentFromGooglePayload(payload);
  return issueAuthResponse(parent);
}
