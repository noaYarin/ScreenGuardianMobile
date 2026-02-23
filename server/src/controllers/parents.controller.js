import { addChild, getMyChildren } from "../services/parents.service.js";

export async function addChildController(req, res, next) {
  try {
    // מגיע מה-JWT middleware
    const parentId = req.user?.parentId;
    const role = req.user?.role;

    if (!parentId) {
      return res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Not authenticated" } });
    }
    if (role !== "PARENT") {
      return res.status(403).json({ ok: false, error: { code: "FORBIDDEN", message: "Parents only" } });
    }

    const data = await addChild(parentId, req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMyChildrenController(req, res, next) {
  try {
    const parentId = req.user?.parentId;
    const role = req.user?.role;

    if (!parentId) {
      return res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Not authenticated" } });
    }
    if (role !== "PARENT") {
      return res.status(403).json({ ok: false, error: { code: "FORBIDDEN", message: "Parents only" } });
    }

    const data = await getMyChildren(parentId);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}