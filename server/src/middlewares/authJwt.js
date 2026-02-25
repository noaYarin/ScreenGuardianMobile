import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function authJwt(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: { code: "NO_TOKEN", message: "Missing token" } });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { parentId, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ ok: false, error: { code: "INVALID_TOKEN", message: "Invalid token" } });
  }
}