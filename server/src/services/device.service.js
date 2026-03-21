import { AppError } from "../utils/appError.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { notifyChild } from "./notification.service.js";
import { NotificationSeverity } from "../constants/severity.js";
import { NotificationType } from "../constants/notificationType.js";
import { sendAuditLog } from "./audit.service.js";
import { AuditActionType } from "../constants/auditActionType.js";
import {
  findDeviceById,
  updateDeviceById,
  findDevicesByChildId,
  deleteDeviceById,
  resetDailyScreenTime,
  updateApplicationBlockStatus,
  findDeviceDailyLimitById,
  updateDeviceDailyLimit
} from "../dal/device.dal.js";
import { getChildrenByParentId } from "../dal/parent.dal.js";


function assertDailyLimitMinutes(value) {
  const n = Number(value);

  if (!Number.isFinite(n) || n < 0) {
    throw new AppError(CommonErrors.VALIDATION_ERROR);
  }

  return n;
}


function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export async function validateDeviceAccess({ deviceId, parentId, childId, allowInactive = false }) {
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

  if (!allowInactive && device.isActive === false) {
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

  let device = await validateDeviceAccess({ deviceId, parentId });

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


export async function setDeviceActive(parentId, deviceId, isActive) {
  if (typeof isActive !== "boolean") {
    throw new AppError(CommonErrors.VALIDATION_IS_ACTIVE);
  }

  await validateDeviceAccess({ deviceId, parentId, allowInactive: true });

  const updatedDevice = await updateDeviceById(deviceId, { isActive });

  return updatedDevice;
}


export async function getDevicePolicy(parentId, deviceId) {
  let device = await validateDeviceAccess({
    deviceId,
    parentId,
  });

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return {
    deviceId: String(device._id),
    childId: String(device.childId),
    parentId: String(device.parentId),
    platform: device.platform,
    isLocked: device.isLocked,
    isActive: device.isActive,
    screenTime: {
      isLimitEnabled: device.screenTime?.isLimitEnabled ?? false,
      dailyLimitMinutes: device.screenTime?.dailyLimitMinutes ?? 0,
      extraMinutesToday: device.screenTime?.extraMinutesToday ?? 0,
      weeklyLimitMinutes: device.screenTime?.weeklyLimitMinutes ?? 0,
      usedTodayMinutes: device.screenTime?.usedTodayMinutes ?? 0,
      usedWeekMinutes: device.screenTime?.usedWeekMinutes ?? 0,
      lastDailyResetAt: device.screenTime?.lastDailyResetAt ?? null,
      lastWeeklyResetAt: device.screenTime?.lastWeeklyResetAt ?? null,
      weeklySchedule: device.screenTime?.weeklySchedule ?? []
    },
    updatedAt: device.updatedAt
  };
}


export async function getDeviceByChild(parentId, childId, deviceId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);

  const device = await validateDeviceAccess({ deviceId, parentId, childId });

  return device;
}

export async function deleteDeviceForParent(parentId, childId, deviceId) {
  const childList = await getChildrenByParentId(parentId);
  ensureChildBelongsToParent(childList, childId);
  await validateDeviceAccess({ deviceId, parentId, childId });
  await deleteDeviceById(deviceId);
}



export async function blockApplication(parentId, deviceId, packageName) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const app = device.applications?.find(
    (application) => application.packageName === packageName
  );

  if (!app) {
    throw new AppError(CommonErrors.APP_NOT_FOUND);
  }

  const updatedDevice = await updateApplicationBlockStatus(deviceId, packageName, true);

  const updatedApp = updatedDevice.applications?.find(
    (application) => application.packageName === packageName
  );

  return updatedApp;
}


export async function unblockApplication(parentId, deviceId, packageName) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const app = device.applications?.find(
    (application) => application.packageName === packageName
  );

  if (!app) {
    throw new AppError(CommonErrors.APP_NOT_FOUND);
  }

  const updatedDevice = await updateApplicationBlockStatus(deviceId, packageName, false);

  const updatedApp = updatedDevice.applications?.find(
    (application) => application.packageName === packageName
  );

  return updatedApp;
}






export async function getDeviceDailyLimit(parentId, deviceId) {
  await validateDeviceAccess({ deviceId, parentId });

  let device = await findDeviceDailyLimitById(deviceId);

  if (!device) {
    throw new AppError(CommonErrors.DEVICE_NOT_FOUND);
  }

  const now = new Date();

  const lastReset = device.screenTime?.lastDailyResetAt
    ? new Date(device.screenTime.lastDailyResetAt)
    : null;

  if (!lastReset || !isSameDay(lastReset, now)) {
    device = await resetDailyScreenTime(deviceId, now);
  }

  return {
    isLimitEnabled: device.screenTime?.isLimitEnabled ?? false,
    dailyLimitMinutes: device.screenTime?.dailyLimitMinutes ?? 0,
    extraMinutesToday: device.screenTime?.extraMinutesToday ?? 0,
    usedTodayMinutes: device.screenTime?.usedTodayMinutes ?? 0
  };
}




export async function updateDeviceDailyLimitService(parentId, deviceId, body) {
  const device = await validateDeviceAccess({ deviceId, parentId });

  const isLimitEnabled =
    typeof body.isLimitEnabled === "boolean"
      ? body.isLimitEnabled
      : device.screenTime?.isLimitEnabled ?? false;

  const dailyLimitMinutes =
    body.dailyLimitMinutes !== undefined
      ? assertDailyLimitMinutes(body.dailyLimitMinutes)
      : device.screenTime?.dailyLimitMinutes ?? 0;

  const updatedDevice = await updateDeviceDailyLimit(deviceId, {
    isLimitEnabled,
    dailyLimitMinutes
  });

  try {
    await notifyChild({
      parentId,
      childId: device.childId,
      type: NotificationType.SCREEN_TIME_UPDATED,
      severity: NotificationSeverity.INFO,
      title: "Daily Screen Time Updated",
      description: "The parent updated the daily screen time limit"
    });
  } catch (err) {
    console.error("notifyChild failed in updateDeviceDailyLimitService:", err.message);
  }

  try {
    await sendAuditLog({
      parentId,
      childId: device.childId,
      actionType: AuditActionType.UPDATE_SCREEN_TIME,
      description: "Daily screen time limit updated"
    });
  } catch (err) {
    console.error("sendAuditLog failed in updateDeviceDailyLimitService:", err.message);
  }

  return {
    isLimitEnabled: updatedDevice.screenTime?.isLimitEnabled ?? false,
    dailyLimitMinutes: updatedDevice.screenTime?.dailyLimitMinutes ?? 0,
    extraMinutesToday: updatedDevice.screenTime?.extraMinutesToday ?? 0,
    usedTodayMinutes: updatedDevice.screenTime?.usedTodayMinutes ?? 0
  };
}