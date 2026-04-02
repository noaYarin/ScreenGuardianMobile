import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetParentNotifications,
  apiMarkAllParentNotificationsRead,
  apiMarkParentNotificationRead,
  type Notification
} from "@/src/api/notification";

function normalizeNotification(raw: unknown): Notification {
  if (raw == null || typeof raw !== "object") {
    throw new Error("notifications.fetch_failed");
  }
  const n = raw as Record<string, unknown>;
  const id = n._id ?? n.id;
  if (id == null) throw new Error("notifications.fetch_failed");
  return {
    _id: String(id),
    parentId: n.parentId != null ? String(n.parentId) : "",
    childId: n.childId != null ? String(n.childId) : null,
    targetRole: (n.targetRole === "CHILD" ? "CHILD" : "PARENT") as Notification["targetRole"],
    type: n.type != null ? String(n.type) : "",
    severity: n.severity != null ? String(n.severity) : "INFO",
    title: n.title != null ? String(n.title) : "",
    description: n.description != null ? String(n.description) : "",
    isRead: Boolean(n.isRead),
    createdAt: n.createdAt != null ? String(n.createdAt) : undefined,
  };
}

export const fetchParentNotificationsThunk = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchParent", async (_, thunkAPI) => {
  try {
    const list = await apiGetParentNotifications();
    if (!Array.isArray(list)) return thunkAPI.rejectWithValue("notifications.fetch_failed");
    return list.map(normalizeNotification);
  } catch (error) {
    const message = (error as Error)?.message ?? "notifications.fetch_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const markParentNotificationReadThunk = createAsyncThunk<
  Notification,
  { notificationId: string },
  { rejectValue: string }
>("notifications/markRead", async ({ notificationId }, thunkAPI) => {
  try {
    const updated = await apiMarkParentNotificationRead(notificationId);
    return normalizeNotification(updated);
  } catch (error) {
    const message = (error as Error)?.message ?? "notifications.mark_read_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const markAllParentNotificationsReadThunk = createAsyncThunk<
  { success: boolean },
  void,
  { rejectValue: string }
>("notifications/markAllRead", async (_, thunkAPI) => {
  try {
    return await apiMarkAllParentNotificationsRead();
  } catch (error) {
    const message = (error as Error)?.message ?? "notifications.mark_all_read_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

