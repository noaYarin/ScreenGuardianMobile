import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { findDeviceById, updateDeviceById, findDevicesByChildId } from "../dal/device.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";
import { notifyChild } from "../services/notification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";

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
    title: "Device Locked",
    description: "The parent locked the device"
  });

  await sendAuditLog({
    parentId,
    childId: device.childId,
    actionType: AuditActionType.LOCK_DEVICE,
    description: "Device locked"
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
    title: "Device Unlocked",
    description: "The parent unlocked the device"
  });

  await sendAuditLog({
    parentId,
    childId: device.childId,
    actionType: AuditActionType.UNLOCK_DEVICE,
    description: "Device Unlocked"
  });


  return updatedDevice;
}


export async function getDevicesByChild(parentId, childId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  return findDevicesByChildId(childId);
}


// Return current screen-time settings for a specific device
export async function getDeviceScreenTime(parentId, deviceId) {

  let device = await findDeviceById(deviceId);
  ensureDeviceBelongsToParent(device, parentId);

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return device.screenTime;
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
    title: "Screen Time Limits Updated",
    description: "The parent updated the screen time settings"
  });


  await sendAuditLog({
    parentId,
    childId: device.childId,
    actionType: AuditActionType.UPDATE_SCREEN_TIME,
    description: "Screen time limits updated"
  });

  return updatedDevice;
}



function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}



