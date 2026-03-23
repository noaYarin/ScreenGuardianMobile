import type { TFunction } from "i18next";
import type { Device } from "@/src/api/device";

export type ChildDetailsDeviceRow = {
  id: string;
  name: string;
  typeLabel: string;
  platformLabel: string;
  active: boolean;
  locationText: string;
  isLocked: boolean;
};

function translateDeviceType(t: TFunction, raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "PHONE") return t("childDetails.device_type.phone");
  if (key === "TABLET") return t("childDetails.device_type.tablet");
  return t("childDetails.device_type.other");
}

function translateDevicePlatform(t: TFunction, raw: string | undefined): string {
  const key = (raw ?? "").toUpperCase();
  if (key === "ANDROID") return t("childDetails.device_platform.android");
  if (key === "IOS") return t("childDetails.device_platform.ios");
  return t("childDetails.device_platform.other");
}

export function mapDevicesToRows(
  devices: Device[],
  t: TFunction
): ChildDetailsDeviceRow[] {
  return devices.map((d) => {
    const name = d.name?.trim() ? d.name : "—";
    const loc =
      typeof d.location === "string" && d.location.trim().length > 0
        ? d.location.trim()
        : t("childDetails.location_unknown");
    return {
      id: String(d._id),
      name,
      typeLabel: translateDeviceType(t, d.type),
      platformLabel: translateDevicePlatform(t, d.platform),
      active: Boolean(d.isActive),
      locationText: loc,
      isLocked: Boolean(d.isLocked),
    };
  });
}
