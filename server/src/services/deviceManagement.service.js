import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { findDeviceById, updateDeviceById, findDevicesByChildId, resetDailyScreenTime } from "../dal/device.dal.js"; import { getChildrenByParentId } from "../dal/parent.dal.js";
import { notifyChild } from "../services/notification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";


async function validateDeviceAccess({ deviceId, parentId, childId }) {
  const device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (childId && String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  return device;
}

function ensureChildBelongsToParent(childList, childId) {
  const belongs = childList.some((child) => String(child._id) === String(childId));

  if (!belongs) {
    throw new AppError(CommonErrors.NOT_FOUND);
  }
}
async function validateDeviceAccess({ deviceId, parentId, childId }) {
  const device = await findDeviceById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  if (String(device.parentId) !== String(parentId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (childId && String(device.childId) !== String(childId)) {
    throw new AppError(CommonErrors.DEVICE_NOT_OWNED);
  }

  if (device.isActive === false) {
    throw new AppError(CommonErrors.DEVICE_NOT_ACTIVE);
  }

  return device;
}



export async function lockDevice(parentId, deviceId) {

  const device = await validateDeviceAccess({ deviceId, parentId });

  const updatedDevice = await updateDeviceById(deviceId, { isLocked: true });

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.DEVICE_LOCKED,
      severity: NotificationSeverity.WARNING,
      title: "Device Locked",
      description: "The parent locked the device"
    });
  } catch (err) {
    console.error("notifyChild failed in lockDevice:", err.message);
  }


  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.LOCK_DEVICE,
      description: "Device locked"
    });
  } catch (err) {
    console.error("sendAuditLog failed in lockDevice:", err.message);
  }


  return updatedDevice;
}


export async function unlockDevice(parentId, deviceId) {

  const device = await validateDeviceAccess({ deviceId, parentId });
  const updatedDevice = await updateDeviceById(deviceId, { isLocked: false });

  try {

    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.DEVICE_UNLOCKED,
      severity: NotificationSeverity.INFO,
      title: "Device Unlocked",
      description: "The parent unlocked the device"
    });
  } catch (err) {
    console.error("notifyChild failed in unlockDevice:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UNLOCK_DEVICE,
      description: "Device Unlocked"
    });
  } catch (err) {
    console.error("sendAuditLog failed in unlockDevice:", err.message);
  }

  return updatedDevice;
}


export async function getDevicesByChild(parentId, childId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  return findDevicesByChildId(childId);
}


// Return current screen-time settings for a specific device
export async function getDeviceScreenTime(parentId, deviceId) {

  const device = await validateDeviceAccess({ deviceId, parentId });

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
  
  const device = await validateDeviceAccess({ deviceId, parentId });

  const currentScreenTime = device.screenTime || {};

  const patch = {
    screenTime: {
      ...currentScreenTime, // keep existing values
      ...body               // override only fields sent by the client
    }
  };

  const updatedDevice = await updateDeviceById(deviceId, patch);

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.SCREEN_TIME_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Screen Time Limits Updated",
      description: "The parent updated the screen time settings"
    });
  } catch (err) {
    console.error("notifyChild failed in updateDeviceScreenTime:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UPDATE_SCREEN_TIME,
      description: "Screen time limits updated"
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateDeviceScreenTime:", err.message);
  }

  return updatedDevice;
}



function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}



