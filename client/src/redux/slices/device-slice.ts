import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Device } from "../../api/device";
import {
  deleteDeviceForChild,
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
  setDeviceLockThunk,
  updateDeviceLocation
} from "../thunks/deviceThunks";

import { logout } from "./auth-slice";
export type DeviceFetchStatus = "idle" | "loading" | "succeeded" | "failed";

type DevicesState = {
  byChildId: Record<string, Device[]>;
  statusByChildId: Record<string, DeviceFetchStatus>;
  errorByChildId: Record<string, string | null>;
};

const initialState: DevicesState = {
  byChildId: {},
  statusByChildId: {},
  errorByChildId: {},
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    clearDevicesForChild: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byChildId[id];
      delete state.statusByChildId[id];
      delete state.errorByChildId[id];
    },
    setDeviceLockLocal: (
      state,
      action: PayloadAction<{
        childId: string;
        deviceId: string;
        isLocked: boolean;
      }>
    ) => {
      const { childId, deviceId, isLocked } = action.payload;
      const list = state.byChildId[childId];
      if (!list) return;
      const idx = list.findIndex((d) => String(d._id) === String(deviceId));
      if (idx < 0) return;
      const device = list[idx];
      state.byChildId[childId][idx] = { ...device, isLocked };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevicesByChild.pending, (state, action) => {
        const childId = action.meta.arg;
        state.statusByChildId[childId] = "loading";
        state.errorByChildId[childId] = null;
      })
      .addCase(fetchDevicesByChild.fulfilled, (state, action) => {
        const childId = action.meta.arg;
        state.byChildId[childId] = action.payload;
        state.statusByChildId[childId] = "succeeded";
        state.errorByChildId[childId] = null;
      })
      .addCase(fetchDevicesByChild.rejected, (state, action) => {
        const childId = action.meta.arg;
        state.statusByChildId[childId] = "failed";
        state.errorByChildId[childId] =
          action.payload ?? action.error.message ?? "devices.fetch_device_failed";
      })
      .addCase(updateDeviceLocation.fulfilled, (state, action) => {
        const { childId, deviceId } = action.meta.arg;
        const updatedDevice = action.payload;
        const list = state.byChildId[childId];
        if (!list) return;
        const idx = list.findIndex((d) => String(d._id) === String(deviceId));
        if (idx !== -1) {
          state.byChildId[childId][idx] = updatedDevice;
        }
      })
      .addCase(deleteDeviceForChild.fulfilled, (state, action) => {
        const { childId, deviceId } = action.meta.arg;
        const list = state.byChildId[childId];
        if (!list) return;
        state.byChildId[childId] = list.filter(
          (d) => String(d._id) !== String(deviceId)
        );
      })
      .addCase(updateDeviceScreenTimeThunk.fulfilled, (state, action) => {
        const { childId, device } = action.payload;
        const list = state.byChildId[childId];
        if (!list) return;

        const idx = list.findIndex((d) => String(d._id) === String(device._id));
        if (idx < 0) return;

        state.byChildId[childId][idx] = device;
      })

      .addCase(setDeviceLockThunk.fulfilled, (state, action) => {
        const { childId, device } = action.payload;
        const list = state.byChildId[childId];
        if (!list) return;

        const idx = list.findIndex(
          (d) => String(d._id) === String(device._id)
        );
        if (idx < 0) return;

        state.byChildId[childId][idx] = device;
      })

      .addCase(logout, (state) => {
        state.byChildId = {};
        state.statusByChildId = {};
        state.errorByChildId = {};
      });
  },
});

export const { clearDevicesForChild, setDeviceLockLocal } =
  devicesSlice.actions;
export {
  fetchDevicesByChild,
  deleteDeviceForChild,
  updateDeviceScreenTimeThunk,
} from "../thunks/deviceThunks";
export default devicesSlice.reducer;
