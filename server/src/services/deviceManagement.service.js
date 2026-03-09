import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { findDeviceById, updateDeviceById, findDevicesByChildId } from "../dal/device.dal.js";
import { getChildByParentId } from "../dal/parent.dal.js";

function ensureChildBelongsToParent(childList, childId) {
  const belongs = childList.some((child) => String(child._id) === String(childId));

  if (!belongs) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
}


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


export async function getDevicesByChild(parentId, childId) {
  const childList = await getChildByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  return findDevicesByChildId(childId);
}


// Return current screen-time settings for a specific device
export async function getDeviceScreenTime(parentId, deviceId) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);

  return device.screenTime || {};
}

// Update screen-time settings for a specific device
export async function updateDeviceScreenTime(parentId, deviceId, body) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);

  const currentScreenTime = device.screenTime || {};

  const patch = {
    screenTime: {
      ...currentScreenTime, // keep existing values
      ...body               // override only fields sent by the client
    }
  };

  return updateDeviceById(deviceId, patch);
}

