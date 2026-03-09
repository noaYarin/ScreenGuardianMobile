import NotificationModel from "../models/notification.model.js";
import { assertValidObjectId } from "../utils/validators.js";
import { Common as CommonErrors } from "../constants/errors.js";

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
export async function markNotificationAsReadById(notificationId) {
  assertValidObjectId(notificationId, CommonErrors.INVALID_ID);

  return NotificationModel.findByIdAndUpdate(
    notificationId,
    { $set: { isRead: true } },
    { new: true }
  ).lean();
}