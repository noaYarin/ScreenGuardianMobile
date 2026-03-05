import mongoose from "mongoose";
import { addChild, getMyChild, setChildActive } from "../services/parent.service.js";

export async function addChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await addChild(parentId, req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getMyChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const includeInactive = req.query?.includeInactive === "true";
    const data = await getMyChild(parentId, { includeInactive });
    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function setChildActiveController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { isActive } = req.body;

    const data = await setChildActive(parentId, childId, isActive);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}