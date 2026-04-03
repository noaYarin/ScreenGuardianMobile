import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/src/api/notification";
import {
  fetchParentNotificationsThunk,
  markAllParentNotificationsReadThunk,
  markParentNotificationReadThunk
} from "@/src/redux/thunks/notificationThunks";

type NotificationsState = {
  items: Notification[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null
};

function upsertById(list: Notification[], notification: Notification) {
  const idx = list.findIndex((n) => String(n._id) === String(notification._id));
  if (idx >= 0) {
    list[idx] = notification;
  } else {
    list.unshift(notification);
  }
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotificationFromSocket(state, action: PayloadAction<Notification>) {
      upsertById(state.items, action.payload);
    },
    clearNotifications(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParentNotificationsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchParentNotificationsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchParentNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? action.error.message ?? "notifications.fetch_failed";
      })
      .addCase(markParentNotificationReadThunk.fulfilled, (state, action) => {
        upsertById(state.items, action.payload);
      })
      .addCase(markAllParentNotificationsReadThunk.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, isRead: true }));
      });
  }
});

export const { addNotificationFromSocket, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;

