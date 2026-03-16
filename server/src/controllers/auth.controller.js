import { registerParent, loginParent, loginWithGoogle } from "../services/auth.service.js";
import { Auth as AuthErrors } from "../constants/errors.js";

export async function registerParentController(req, res, next) {
  try {
    const { email, password, name, phoneNumber } = req.body;
    const data = await registerParent({ email, password, name, phoneNumber });
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
    const { email, otpCode, password } = req.body;

    if (!email || !otpCode || !password) {
      const error = AuthErrors.MISSING_TOKEN_OR_NEW_PASSWORD;
      return res.status(error.status).json({
        ok: false,
        error: { code: error.code, message: error.message },
      });
    }

    const data = await resetPassword({ email, otpCode, password });

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}