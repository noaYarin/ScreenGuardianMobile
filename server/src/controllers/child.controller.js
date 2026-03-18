import {
  addChild,
  getChildren,
  setChildActive,
  updateChildInterests,
  setSelectedDevice
} from "../services/parent.service.js";

export async function addChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await addChild(parentId, req.body);
    res.status(201).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getChildrenController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const includeInactive = req.query?.includeInactive === "true";
    const data = await getChildren(parentId, { includeInactive });
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


export async function updateChildInterestsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const childId = req.user.childId;
    const { interests } = req.body;

    const data = await updateChildInterests(parentId, childId, interests);

    res.json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function setSelectedDeviceController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;
    const { deviceId } = req.body ?? {};

    const data = await setSelectedDevice(parentId, childId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}