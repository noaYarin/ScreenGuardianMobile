import React from "react";
import {
  View,
  Pressable,
  I18nManager,
  useWindowDimensions,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

function HeaderIconButton({
  name,
  onPress,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={({ pressed }) => [
        styles.headerIconButton,
        pressed && styles.headerIconButtonPressed,
      ]}
    >
      <MaterialCommunityIcons name={name} size={22} color="#000" />
    </Pressable>
  );
}

type StaticDevice = {
  id: string;
  name: string;
  statusText: string;
  remainingTimeText: string;
  locationText: string;
};

const STATIC_CHILD = {
  id: "1",
  name: "יעל",
  birthDate: "12/03/2017",
  genderLabel: "בת",
  usedToday: "2:30",
  dailyLimit: "4:00",
  devices: [
    {
      id: "device-1",
      name: "טלפון של יעל",
      statusText: "מחובר",
      remainingTimeText: "2:30 שעות",
      locationText: "בית",
    },
    {
      id: "device-2",
      name: "טאבלט",
      statusText: "מחובר",
      remainingTimeText: "1:15 שעות",
      locationText: "בית ספר",
    },
  ] as StaticDevice[],
};

export default function KidDetailsScreen() {
  const { t } = useTranslation();
  const { row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  const childNameFromParams =
    typeof params.name === "string" && params.name.trim().length > 0
      ? params.name
      : STATIC_CHILD.name;

  const onAddDevice = () => {
    // TODO: Connect this button to the backend.
    // TODO: Call the server to create a new device for the selected child.
  };

  const onViewLimits = (deviceId: string) => {
    // TODO: Navigate to the device limits screen or fetch device limits from the backend.
    console.log("View limits for device:", deviceId);
  };

  const onDeleteDevice = (deviceId: string) => {
    // TODO: Connect this delete action to the backend.
    // TODO: Delete the selected device on the server, then refresh the child devices list.
    console.log("Delete device:", deviceId);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("kidDetails.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerRight: () => (
            <HeaderIconButton
              name={backIconName}
              onPress={() => router.back()}
              accessibilityLabel={t("kidDetails.back_a11y")}
            />
          ),
          headerLeft: () => (
            <HeaderIconButton
              name="menu"
              onPress={() => {}}
              accessibilityLabel={t("kidDetails.menu_a11y")}
            />
          ),
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={[styles.content, { maxWidth: maxContentWidth }]}>
            <View style={styles.profileCard}>
              <View style={[styles.profileHeader, row]}>
                <View style={styles.avatarWrap}>
                  <MaterialCommunityIcons
                    name="account-child-circle"
                    size={52}
                    color="#2563EB"
                  />
                </View>

                <View style={styles.profileTextWrap}>
                  <AppText
                    weight="extraBold"
                    style={[styles.childName, text]}
                    numberOfLines={1}
                  >
                    {childNameFromParams}
                  </AppText>

                  <AppText style={[styles.childMeta, text]} numberOfLines={1}>
                    {t("kidDetails.birthdate_value", { value: STATIC_CHILD.birthDate })}
                  </AppText>

                  <AppText style={[styles.childMeta, text]} numberOfLines={1}>
                    {t("kidDetails.gender_value", { value: STATIC_CHILD.genderLabel })}
                  </AppText>
                </View>
              </View>

              <View style={[styles.statsRow, row]}>
                <View style={styles.statCard}>
                  <AppText weight="bold" style={styles.statTitle}>
                    {t("kidDetails.used_today")}
                  </AppText>

                  <AppText weight="extraBold" style={styles.statValue}>
                    {STATIC_CHILD.usedToday}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="bold" style={styles.statTitle}>
                    {t("kidDetails.daily_limit")}
                  </AppText>

                  <AppText weight="extraBold" style={styles.statValue}>
                    {STATIC_CHILD.dailyLimit}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={[styles.sectionHeader, row]}>
              <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                {t("kidDetails.devices_title")}
              </AppText>

              <Pressable
                style={styles.addDeviceButton}
                onPress={onAddDevice}
                accessibilityRole="button"
                accessibilityLabel={t("kidDetails.add_device_a11y")}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
                <AppText weight="extraBold" style={styles.addDeviceButtonText}>
                  {t("kidDetails.add_device")}
                </AppText>
              </Pressable>
            </View>

            <View style={styles.devicesList}>
              {STATIC_CHILD.devices.map((device) => (
                <View key={device.id} style={styles.deviceCard}>
                  <View style={[styles.deviceTopRow, row]}>
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
                          {device.statusText}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.deviceAvatar}>
                      <MaterialCommunityIcons
                        name="tablet-cellphone"
                        size={26}
                        color="#2563EB"
                      />
                    </View>
                  </View>

                  <View style={[styles.deviceInfoStrip, row]}>
                    <View style={styles.infoPillWarn}>
                      <AppText style={styles.infoPillWarnText}>
                        {t("kidDetails.active_now")}
                      </AppText>
                    </View>

                    <View style={[styles.infoMiniRow, row]}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={18}
                        color="#60A5FA"
                      />
                      <AppText style={[styles.infoMiniText, text]}>
                        {device.locationText}
                      </AppText>
                    </View>

                    <View style={[styles.infoMiniRow, row]}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={18}
                        color="#60A5FA"
                      />
                      <AppText style={[styles.infoMiniText, text]}>
                        {t("kidDetails.remaining_time_value", {
                          value: device.remainingTimeText,
                        })}
                      </AppText>
                    </View>
                  </View>

                  <View style={[styles.deviceBottomRow, row]}>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => onDeleteDevice(device.id)}
                      accessibilityRole="button"
                      accessibilityLabel={t("kidDetails.delete_device_a11y", {
                        name: device.name,
                      })}
                    >
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={24}
                        color="#0F172A"
                      />
                    </Pressable>

                    <Pressable
                      style={styles.viewLimitsButton}
                      onPress={() => onViewLimits(device.id)}
                      accessibilityRole="button"
                      accessibilityLabel={t("kidDetails.view_limits_a11y", {
                        name: device.name,
                      })}
                    >
                      <AppText weight="bold" style={styles.viewLimitsButtonText}>
                        {t("kidDetails.view_limits")}
                      </AppText>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}
