import {findNotificationsByParentId, markNotificationAsReadById} from "../dal/notification.dal.js";

// Get all notifications for the authenticated parent
export async function getParentNotifications(parentId) {
  return findNotificationsByParentId(parentId);
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId) {
  return markNotificationAsReadById(notificationId);
}