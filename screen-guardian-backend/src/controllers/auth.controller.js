import { registerParent, loginParent } from "../services/auth.service.js";

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