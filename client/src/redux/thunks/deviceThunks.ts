import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiDeleteDeviceByChild,
  apiGetDevicesByChild,
  type Device,
} from "../../api/device";

function normalizeDevice(raw: unknown): Device {
  if (raw == null || typeof raw !== "object") {
    throw new Error("devices.fetch_device_failed");
  }
  const o = raw as Record<string, unknown>;
  const id = o._id ?? o.id;
  if (id == null) {
    throw new Error("devices.fetch_device_failed");
  }
  return { ...o, _id: String(id) } as Device;
}

export const fetchDevicesByChild = createAsyncThunk<
  Device[],
  string,
  { rejectValue: string }
>("devices/fetchByChild", async (childId, thunkAPI) => {
  try {
    const list = await apiGetDevicesByChild(childId);
    if (!Array.isArray(list)) {
      return thunkAPI.rejectWithValue("devices.fetch_device_failed");
    }
    return list.map(normalizeDevice);
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.fetch_device_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteDeviceForChild = createAsyncThunk<
  void,
  { childId: string; deviceId: string },
  { rejectValue: string }
>("devices/deleteForChild", async ({ childId, deviceId }, thunkAPI) => {
  try {
    await apiDeleteDeviceByChild(childId, deviceId);
  } catch (error) {
    const message =
      (error as Error)?.message ?? "devices.delete_device_failed";
    return thunkAPI.rejectWithValue(message);
  }
});
