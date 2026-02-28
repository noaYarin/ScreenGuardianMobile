import { registerParent, loginParent, loginWithGoogle } from "../services/auth.service.js";

export async function registerParentController(req, res, next) {
  try {
    const { email, password, name, phoneNumber, gender } = req.body;
    const data = await registerParent({ email, password, name, phoneNumber, gender });
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function loginParentController(req, res, next) {
  try {
    const { email, password } = req.body;
    const data = await loginParent({ email, password });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function googleAuthController(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ ok: false, error: { code: "MISSING_TOKEN", message: "idToken is required" } });
    }
    const data = await loginWithGoogle(idToken);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}