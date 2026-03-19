import { Dimensions, Platform } from "react-native";

export type DevicePlatformValue = "ANDROID" | "IOS" | "OTHER";
export type DeviceTypeValue = "PHONE" | "TABLET" | "OTHER";

const TABLET_MIN_DIMENSION_PX = 600;

export function detectConnectionPlatform(): DevicePlatformValue {
  if (Platform.OS === "android") return "ANDROID";
  if (Platform.OS === "ios") return "IOS";
  return "OTHER";
}

export function detectConnectionDeviceType(options?: {
  width?: number;
  height?: number;
}): DeviceTypeValue {
  const win = Dimensions.get("window");
  const width = options?.width ?? win.width;
  const height = options?.height ?? win.height;

  const minDimension = Math.min(width, height);
  return minDimension >= TABLET_MIN_DIMENSION_PX ? "TABLET" : "PHONE";
}

export function buildDeviceConnectionPayload() {
  return {
    deviceName: "Child Device",
    deviceType: detectConnectionDeviceType(),
    platform: detectConnectionPlatform(),
  };
}

