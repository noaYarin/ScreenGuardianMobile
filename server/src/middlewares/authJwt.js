import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Auth as AuthErrors } from "../constants/errors.js";

export function authJwt(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    const e = AuthErrors.NO_TOKEN;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { parentId, role, iat, exp }
    next();
  } catch {
    const e = AuthErrors.INVALID_TOKEN;
    return res.status(e.status).json({ ok: false, error: { code: e.code, message: e.message } });
  }
}