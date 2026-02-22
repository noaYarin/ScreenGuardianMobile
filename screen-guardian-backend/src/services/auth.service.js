import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/appError.js";
import { createParent, findParentByEmail } from "../dal/parent.dal.js";

function signToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export async function registerParent({ email, password, name, phoneNumber, gender }) {
  const existing = await findParentByEmail(email);
  if (existing) {
    throw new AppError({ status: 409, code: "EMAIL_EXISTS", message: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, 10);

  const created = await createParent({
    email,
    password: hash,
    name,
    phoneNumber,
    gender,
    children: [],
  });

  // ObjectId בתוך ה-JWT (בסדר גמור). ללקוח נחזיר string.
  const parentId = created._id.toString();
  const token = signToken({ parentId, role: "PARENT" });

  return { token, parentId };
}

export async function loginParent({ email, password }) {
  const parent = await findParentByEmail(email);
  if (!parent) {
    throw new AppError({ status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  const ok = await bcrypt.compare(password, parent.password);
  if (!ok) {
    throw new AppError({ status: 401, code: "INVALID_CREDENTIALS", message: "Invalid email or password" });
  }

  const parentId = parent._id.toString();
  const token = signToken({ parentId, role: "PARENT" });

  return { token, parentId };
}