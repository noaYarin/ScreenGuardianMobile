import { findNotificationsByParentId, markNotificationAsReadById, createNotification } from "../dal/notification.dal.js";

export async function createNotificationService({
    parentId,
    childId,
    targetRole,
    type,
    severity,
    title,
    description
}) {
    return createNotification({
        parentId,
        childId,
        targetRole,
        type,
        severity,
        title,
        description
    });
}

// Get all notifications for the authenticated parent
export async function getParentNotifications(parentId) {
    return findNotificationsByParentId(parentId);
}

// Mark a notification as read
export async function markNotificationAsRead(notificationId) {
    return markNotificationAsReadById(notificationId);
}