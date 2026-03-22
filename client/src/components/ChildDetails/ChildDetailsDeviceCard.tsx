import React from "react";
import { View, Pressable, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "@/src/components/AppText/AppText";
import type { ChildDetailsDeviceRow } from "./mapDevicesToRows";
import {
  childDetailsStyles as styles,
  childDetailsIconColors,
} from "./childDetails.styles";

type DeviceDetailRowProps = {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  value: string;
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  valueLines?: number;
};

function DeviceDetailRow({
  icon,
  label,
  value,
  row,
  text,
  valueLines = 2,
}: DeviceDetailRowProps) {
  return (
    <View style={[styles.deviceDetailRow, row]}>
      <View style={styles.deviceDetailIconColumn}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={childDetailsIconColors.detailAccent}
        />
      </View>
      <View style={styles.deviceDetailTextColumn}>
        <AppText style={[styles.deviceDetailLabel, text]}>{label}</AppText>
        <AppText
          style={[styles.deviceDetailValue, text]}
          numberOfLines={valueLines}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

type Props = {
  device: ChildDetailsDeviceRow;
  row: StyleProp<ViewStyle>;
  text: StyleProp<TextStyle>;
  deleteDisabled: boolean;
  lockDisabled: boolean;
  onDelete: (deviceId: string, displayName: string) => void;
  onSetDeviceLocked: (deviceId: string, locked: boolean) => void;
};

export function ChildDetailsDeviceCard({
  device,
  row,
  text,
  deleteDisabled,
  lockDisabled,
  onDelete,
  onSetDeviceLocked,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.deviceCard}>
      <View style={[styles.deviceHeaderRow, row]}>
        <View style={styles.deviceMainInfo}>
          <AppText
            weight="extraBold"
            style={[styles.deviceName, text]}
            numberOfLines={1}
          >
            {device.name}
          </AppText>

          <View style={[styles.deviceStatusRow, row]}>
            <MaterialCommunityIcons
              name="cellphone-link"
              size={17}
              color="#475569"
            />
            <AppText style={[styles.deviceStatusText, text]}>
              {device.active
                ? t("childDetails.status_connected")
                : t("childDetails.status_disconnected")}
            </AppText>
          </View>

          <View style={styles.deviceInfoStrip}>
            <DeviceDetailRow
              icon="rename-outline"
              label={t("childDetails.device_detail_name")}
              value={device.name}
              row={row}
              text={text}
              valueLines={2}
            />
            <View style={styles.deviceDetailRowDivider} />
            <DeviceDetailRow
              icon="tablet-cellphone"
              label={t("childDetails.device_detail_type")}
              value={device.typeLabel}
              row={row}
              text={text}
              valueLines={1}
            />
            <View style={styles.deviceDetailRowDivider} />
            <DeviceDetailRow
              icon="cellphone-marker"
              label={t("childDetails.device_detail_platform")}
              value={device.platformLabel}
              row={row}
              text={text}
              valueLines={1}
            />
            <View style={styles.deviceDetailRowDivider} />
            <DeviceDetailRow
              icon="map-marker-outline"
              label={t("childDetails.device_detail_location")}
              value={device.locationText}
              row={row}
              text={text}
              valueLines={2}
            />
            <View style={styles.deviceDetailRowDivider} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                device.isLocked
                  ? t("childDetails.device_unlock_a11y", { name: device.name })
                  : t("childDetails.device_lock_a11y", { name: device.name })
              }
              disabled={lockDisabled}
              onPress={() =>
                onSetDeviceLocked(device.id, !device.isLocked)
              }
              style={({ pressed }) => [
                styles.deviceLockActionButton,
                device.isLocked
                  ? styles.deviceLockActionButtonGreen
                  : styles.deviceLockActionButtonRed,
                lockDisabled && { opacity: 0.45 },
                pressed && !lockDisabled && { opacity: 0.85 },
              ]}
            >
              <AppText
                weight="bold"
                style={
                  device.isLocked
                    ? styles.deviceLockActionTextGreen
                    : styles.deviceLockActionTextRed
                }
              >
                {device.isLocked
                  ? t("childDetails.device_unlock")
                  : t("childDetails.device_lock")}
              </AppText>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            (deleteDisabled || pressed) && {
              opacity: deleteDisabled ? 0.45 : 0.75,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t("childDetails.delete_device_a11y", {
            name: device.name,
          })}
          disabled={deleteDisabled}
          onPress={() => onDelete(device.id, device.name)}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={22}
            color={childDetailsIconColors.deleteTrash}
          />
        </Pressable>
      </View>
    </View>
  );
}
