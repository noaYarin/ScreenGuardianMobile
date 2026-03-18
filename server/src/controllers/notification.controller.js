import {
  getParentNotifications,
  markNotificationAsRead,
  readAllNotifications 
}
 from "../services/notification.service.js";

// Return notifications for the logged-in parent
export async function getParentNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;

    const data = await getParentNotifications(parentId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}

// Mark notification as read
export async function markNotificationAsReadController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const { notificationId } = req.params;

    const data = await markNotificationAsRead(parentId, notificationId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}


export async function readAllNotificationsController(req, res, next) {
  try {
    const parentId = req.user.parentId;
    const data = await readAllNotifications(parentId);

    res.status(200).json({ ok: true, data });
  } catch (err) {
    next(err);
  }
}