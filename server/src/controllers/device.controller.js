import { getDevicesByChild, lockDevice, unlockDevice } from "../services/deviceManagement.service.js";


export async function getDevicesByChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const devices = await getDevicesByChild(parentId, childId);

    res.status(200).json(devices);
  } catch (err) {
    next(err);
  }
}

export async function lockDeviceController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const data = await lockDevice(parentId, deviceId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

export async function unlockDeviceController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const data = await unlockDevice(parentId, deviceId);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}