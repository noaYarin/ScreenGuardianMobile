import {
  getDevicesByChild, lockDevice, unlockDevice, getDeviceScreenTime,
  updateDeviceScreenTime, setDeviceActive
} from "../services/deviceManagement.service.js";

export async function getDevicesByChildController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId } = req.params;

    const devices = await getDevicesByChild(parentId, childId);

    res.status(200).json({ ok: true, data: devices });
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

// Return current screen-time settings for a specific device
export async function getDeviceScreenTimeController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;

    const data = await getDeviceScreenTime(parentId, deviceId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// Update screen-time settings for a specific device
export async function updateDeviceScreenTimeController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { childId, deviceId } = req.params;
    const data = await updateDeviceScreenTime(parentId, deviceId, req.body);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
  
}


export async function setDeviceActiveController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { deviceId } = req.params;
    const { isActive } = req.body;

    const data = await setDeviceActive(parentId, deviceId, isActive);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}