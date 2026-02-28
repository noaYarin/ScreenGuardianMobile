import mongoose from "mongoose";
import { addChild, getMyChildren, setChildActive } from "../services/parents.service.js";

export async function addChildController(req, res, next) {
  try {
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

    const includeInactive = req.query?.includeInactive === "true";

    const data = await getMyChildren(parentId, { includeInactive });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function setChildActiveController(req, res, next) {
  try {
    const parentId = req.user?.parentId;
    const role = req.user?.role;

    if (!parentId) return res.status(401).json({ ok: false, error: { code: "NO_AUTH", message: "Not authenticated" } });
    if (role !== "PARENT") return res.status(403).json({ ok: false, error: { code: "FORBIDDEN", message: "Parents only" } });

    const { childId } = req.params;
    const { isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ ok: false, error: { code: "VALIDATION", message: "childId must be a valid ObjectId" } });
    }
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ ok: false, error: { code: "VALIDATION", message: "isActive must be boolean" } });
    }

    const data = await setChildActive(parentId, childId, isActive);
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}