import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { findDeviceById, updateDeviceById, findDevicesByChildId } from "../dal/device.dal.js";
import { getChildByParentId } from "../dal/parent.dal.js";
import { notifyChild } from "../services/notification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";

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
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }
}

export async function lockDevice(parentId, deviceId) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);
  const updatedDevice = await updateDeviceById(deviceId, { isLocked: true });

  await notifyChild({
    parentId,
    childId: device.childId,
    type: NotificationType.DEVICE_LOCKED,
    severity: NotificationSeverity.WARNING,
    title: "המכשיר ננעל",
    description: "ההורה נעל את המכשיר"
  });

  return updatedDevice;
}


export async function unlockDevice(parentId, deviceId) {
  const device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);
  const updatedDevice = await updateDeviceById(deviceId, { isLocked: false });

  await notifyChild({
    parentId,
    childId: device.childId,
    type: NotificationType.DEVICE_UNLOCKED,
    severity: NotificationSeverity.INFO,
    title: "המכשיר שוחרר",
    description: "ההורה שחרר את המכשיר"
  });

  return updatedDevice;
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

  const updatedDevice = await updateDeviceById(deviceId, patch);

  await notifyChild({
    parentId,
    childId: device.childId,
    type: NotificationType.SCREEN_TIME_UPDATED,
    severity: NotificationSeverity.INFO,
    title: "מגבלות זמן המסך עודכנו",
    description: "ההורה עדכן את הגדרות זמן המסך"
  });

  return updatedDevice;
}