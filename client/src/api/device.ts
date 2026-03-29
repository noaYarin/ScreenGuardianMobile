import { api } from "./request";

const URL = "/api/v1/devices";

export type Device = {
  _id: string;
  name: string;
  type: string;
  platform: string;
  isLocked: boolean;
  isActive: boolean;
  location: {
    lat: number;
    lng: number;
    lastUpdated: string;
  };  parentId: string;
  childId: string;
  applications?: Array<{
    packageName: string;
    appName?: string;
    isBlocked?: boolean;
  }>;
  screenTime?: {
  dailyLimitMode?: DailyLimitMode;
  isLimitEnabled?: boolean;
  dailyLimitMinutes?: number | null;
  extraMinutesToday?: number;
  weeklyLimitMinutes?: number;
  usedTodayMinutes?: number;
  usedWeekMinutes?: number;
  lastDailyResetAt?: string | null;
  lastWeeklyResetAt?: string | null;
  weeklySchedule?: unknown[];
};
  createdAt?: string;
  updatedAt?: string;
};


export type DailyLimitMode = "NONE" | "UNLIMITED" | "LIMITED";

export type DeviceDailyLimit = {
  dailyLimitMode: DailyLimitMode;
  isLimitEnabled: boolean;
  dailyLimitMinutes: number | null;
  extraMinutesToday: number;
  usedTodayMinutes: number;
};


export async function apiGetDevicesByChild(childId: string): Promise<Device[]> {
  const data = await api.get<Device[]>(
    `${URL}/child/${encodeURIComponent(childId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiGetDeviceByChild(
  childId: string,
  deviceId: string
): Promise<Device> {
  const data = await api.get<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiDeleteDeviceByChild(
  childId: string,
  deviceId: string
): Promise<void> {
  await api.delete(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function apiUpdateDeviceName(
  childId: string,
  deviceId: string,
  name: string
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/child/${encodeURIComponent(childId)}/${encodeURIComponent(deviceId)}/name`,
    { name },
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiUpdateDeviceLocation(
  deviceId: string,
  location: { lat: number; lng: number }
): Promise<Device> {
  const data = await api.patch<Device>(
    `${URL}/${encodeURIComponent(deviceId)}/location`,
    { location },
    {
      requireAuth: true,
      role: "CHILD", 
    }
  );
  return data;
}

export async function apiGetDeviceDailyLimit(
  deviceId: string
): Promise<DeviceDailyLimit> {
  const data = await api.get<DeviceDailyLimit>(
    `${URL}/${encodeURIComponent(deviceId)}/daily-limit`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}

export async function apiUpdateDeviceDailyLimit(
  deviceId: string,
  body: {
    dailyLimitMode: DailyLimitMode;
    dailyLimitMinutes: number | null;
  }
): Promise<DeviceDailyLimit> {
  const data = await api.patch<DeviceDailyLimit>(
    `${URL}/${encodeURIComponent(deviceId)}/daily-limit`,
    body,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
  return data;
}