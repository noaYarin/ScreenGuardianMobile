import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Device } from "../../api/device";
import { deleteDeviceForChild, fetchDevicesByChild } from "../thunks/deviceThunks";

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
      .addCase(deleteDeviceForChild.fulfilled, (state, action) => {
        const { childId, deviceId } = action.meta.arg;
        const list = state.byChildId[childId];
        if (!list) return;
        state.byChildId[childId] = list.filter(
          (d) => String(d._id) !== String(deviceId)
        );
      });
  },
});

export const { clearDevicesForChild } = devicesSlice.actions;
export { fetchDevicesByChild, deleteDeviceForChild } from "../thunks/deviceThunks";
export default devicesSlice.reducer;
