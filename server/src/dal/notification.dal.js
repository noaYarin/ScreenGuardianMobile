import NotificationModel from "../models/notification.model.js";
import { assertValidObjectId } from "../utils/validators.js";
import { Common as CommonErrors } from "../constants/errors.js";
import { TargetRole } from "../constants/role.js";

// Create a new notification
export async function createNotification(doc) {
  return NotificationModel.create(doc);
}

// Return all notifications that belong to a specific parent
export async function findNotificationsByParentId(parentId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

  return NotificationModel
    .find({ parentId })
    .sort({ createdAt: -1 })
    .lean();
}

// Return a notification by its id
export async function findNotificationById(notificationId) {
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findById(notificationId).lean();
}

// Mark a notification as read
import NotificationModel from "../models/notification.model.js";
import { assertValidObjectId } from "../utils/validators.js";
import { Common as CommonErrors } from "../constants/errors.js";

// Create a new notification
export async function createNotification(doc) {
  return NotificationModel.create(doc);
}

// Return all notifications that belong to a specific parent
export async function findNotificationsByParentId(parentId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);

  return NotificationModel
    .find({ parentId, targetRole: TargetRole.PARENT })
    .sort({ createdAt: -1 })
    .lean();
}

// Return a notification by its id
export async function findNotificationById(notificationId) {
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findById(notificationId).lean();
}

// Mark a notification as read
export async function markNotificationAsReadById(parentId, notificationId) {
  assertValidObjectId(parentId, CommonErrors.INVALID_PARENT_ID);
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findOneAndUpdate(
    { _id: notificationId, parentId, targetRole: TargetRole.PARENT },
    { $set: { isRead: true } },
    { new: true }
  ).lean();
}