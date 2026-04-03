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
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
};

const initialState: NotificationsState = {
  items: [],
  status: "idle",
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  }
};

function upsertById(state: NotificationsState, notification: Notification) {
  if (!state.items || !Array.isArray(state.items)) {
    state.items = [];
  }
  
  const idx = state.items.findIndex((n) => n && String(n._id) === String(notification._id));
  if (idx >= 0) {
    state.items[idx] = notification;
  } else {
    state.items.unshift(notification);
  }
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotificationFromSocket(state, action: PayloadAction<Notification>) {
      upsertById(state, action.payload);
      if (state.pagination) {
        state.pagination.total += 1;
      }
    },
    clearNotifications(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.pagination = initialState.pagination;
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

        if (!action.payload) return;

        const { data, pagination } = action.payload;
        const safeData = Array.isArray(data) ? data : [];
        const safePagination = pagination
          ? {
              total: Math.max(0, Number(pagination.total) || 0),
              page: Math.max(1, Number(pagination.page) || 1),
              pages: Math.max(1, Number(pagination.pages) || 1),
              limit: Math.max(1, Number(pagination.limit) || initialState.pagination.limit),
            }
          : { ...initialState.pagination };

        if (!state.items || !Array.isArray(state.items)) {
          state.items = [];
        }

        if (safePagination.page === 1) {
          state.items = safeData;
        } else {
          const existingIds = new Set(state.items.map((i) => i && String(i._id)));
          const newItems = safeData.filter((item) => item && !existingIds.has(String(item._id)));
          state.items = [...state.items, ...newItems];
        }

        state.pagination = safePagination;
      })
      .addCase(fetchParentNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) ?? action.error.message ?? "notifications.fetch_failed";
      })
      .addCase(markParentNotificationReadThunk.fulfilled, (state, action) => {
        if (action.payload) {
          upsertById(state, action.payload);
        }
      })
      .addCase(markAllParentNotificationsReadThunk.fulfilled, (state) => {
        if (Array.isArray(state.items)) {
          state.items = state.items.map((n) => n ? { ...n, isRead: true } : n);
        }
      });
  }
});

export const { addNotificationFromSocket, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;