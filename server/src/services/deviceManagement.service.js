import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { findDeviceById, updateDeviceById } from "../dal/device.dal.js";

function ensureDeviceBelongsToParent(device, parentId) {
  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.PARENT_NOT_FOUND);
  }
}

export async function lockDevice(parentId, deviceId) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);
  return updateDeviceById(deviceId, { isLocked: true });
}

export async function unlockDevice(parentId, deviceId) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);
  return updateDeviceById(deviceId, { isLocked: false });
}