import { findNotificationsByParentId, markNotificationAsReadById } from "../dal/notification.dal.js";
import { TargetRole } from "../constants/role.js";

export async function notifyParent({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    return createNotificationService({
        parentId,
        childId,
        targetRole: TargetRole.PARENT,
        type,
        severity,
        title,
        description
    });
}

export async function notifyChild({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    return createNotificationService({
        parentId,
        childId,
        targetRole: TargetRole.CHILD,
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
export async function markNotificationAsRead(parentId, notificationId) {
  return markNotificationAsReadById(parentId, notificationId);
}