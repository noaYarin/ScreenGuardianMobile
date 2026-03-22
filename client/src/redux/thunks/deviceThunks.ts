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
  const rawDevice = raw as Record<string, unknown>;
  const id = rawDevice._id ?? rawDevice.id;
  if (id == null) {
    throw new Error("devices.fetch_device_failed");
  }
  const screenTime = rawDevice.screenTime;
  return {
    _id: String(id),
    name: rawDevice.name != null ? String(rawDevice.name) : "",
    type: rawDevice.type != null ? String(rawDevice.type) : "",
    platform: rawDevice.platform != null ? String(rawDevice.platform) : "",
    isLocked: Boolean(rawDevice.isLocked),
    isActive: Boolean(rawDevice.isActive),
    location:
      typeof rawDevice.location === "string" ? rawDevice.location : "",
    parentId:
      rawDevice.parentId != null ? String(rawDevice.parentId) : "",
    childId: rawDevice.childId != null ? String(rawDevice.childId) : "",
    applications: Array.isArray(rawDevice.applications)
      ? (rawDevice.applications as Device["applications"])
      : []
        ,
    screenTime:
      screenTime != null && typeof screenTime === "object"
        ? (screenTime as Device["screenTime"])
        : {} 
  };
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
