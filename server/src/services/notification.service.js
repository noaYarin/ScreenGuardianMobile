import {  createNotification, findNotificationsByParentId, markNotificationAsReadById, markAllNotificationsAsRead} from "../dal/notification.dal.js";
import { TargetRole } from "../constants/role.js";
import { getIO } from "../socketHandler.js";
import { NOTIFICATION_CREATED } from "../constants/socketEvents.js";

export async function notifyParent({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    const notification = await createNotification({
        parentId,
        childId,
        targetRole: TargetRole.PARENT,
        type,
        severity,
        title,
        description
    });

    try {
        const io = getIO();
        if (io && parentId) {
            io.to(`parent_${parentId}`).emit(NOTIFICATION_CREATED, notification);
        }
    } catch (err) {
        console.error("socket emit failed in notifyParent:", err.message);
    }

    return notification;
}

export async function notifyChild({
    parentId,
    childId,
    type,
    severity,
    title,
    description
}) {
    const notification = await createNotification({
        parentId,
        childId,
        targetRole: TargetRole.CHILD,
        type,
        severity,
        title,
        description
    });

    try {
        const io = getIO();
        if (io && childId) {
            io.to(`child_${childId}`).emit(NOTIFICATION_CREATED, notification);
        }
    } catch (err) {
        console.error("socket emit failed in notifyChild:", err.message);
    }

    return notification;
}

// Get all notifications for the authenticated parent
export async function getParentNotifications(parentId) {
    return findNotificationsByParentId(parentId);
}

// Mark a notification as read
export async function markNotificationAsRead(parentId, notificationId) {
  return markNotificationAsReadById(parentId, notificationId);
}

export async function readAllNotifications(parentId) {
  await markAllNotificationsAsRead(parentId);

  return { success: true };
}