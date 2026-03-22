import { api } from "./request";

const URL = "/api/v1/devices";

export type Device = {
  _id: string;
  name: string;
  type: string;
  platform: string;
  isLocked: boolean;
  isActive: boolean;
  location?: string;
  parentId: string;
  childId: string;
  applications?: Array<{
    packageName: string;
    appName?: string;
    isBlocked?: boolean;
  }>;
  screenTime?: {
    isLimitEnabled?: boolean;
    dailyLimitMinutes?: number;
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
