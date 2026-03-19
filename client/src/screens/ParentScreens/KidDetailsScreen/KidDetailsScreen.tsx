import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { Href, Stack, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { RootState } from "@/src/redux/store/types";

type StaticDevice = {
  id: string;
  name: string;
  statusText: string;
  remainingTimeText: string;
  locationText: string;
};

const STATIC_CHILD = {
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

  const { children, isLoading, error } = useSelector((state: RootState) => state.children);

  const [isDevicesExpanded, setIsDevicesExpanded] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string>(() => {
    return typeof params.id === "string" && params.id.trim().length > 0 ? params.id : "";
  });

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  useEffect(() => {
    if (children.length === 0) return;

    if (!selectedChildId) {
      setSelectedChildId(children[0]._id);
      return;
    }

    if (!children.some((c) => c._id === selectedChildId)) {
      setSelectedChildId(children[0]._id);
    }
  }, [children, selectedChildId]);

  const selectedChild = useMemo(() => {
    return children.find((c) => c._id === selectedChildId) ?? null;
  }, [children, selectedChildId]);

  const childName = selectedChild?.name ?? "";
  const childBirthDate = selectedChild?.birthDate 
  ? new Date(selectedChild.birthDate).toLocaleDateString("he-IL") 
  : "";

  const childGenderLabel =
    selectedChild?.gender === "boy"
      ? t("addChild.gender_boy")
      : selectedChild?.gender === "girl"
      ? t("addChild.gender_girl")
      : selectedChild?.gender === "other"
      ? t("addChild.gender_other")
      : "";

  const devicesForSelectedChild = useMemo(() => {
    const devices = (selectedChild as any)?.devices;
    return Array.isArray(devices) ? devices : [];
  }, [selectedChild]);

  const handleConnectDevice = () => {
    if (selectedChildId) {
      router.push(
        {
          pathname: "/Parent/linkDevice",
          params: {
            id: selectedChildId,
            name: childName,
          },
        } as never
      );
    }
  };

  const handleOpenChildProfile = () => {
    router.push(
      {
        pathname: "/Parent/childProfile" as Href,
        params: {
          id: selectedChildId,
          name: childName,
        },
      } as never
    );
  };

  const toggleDevicesSection = () => {
    setIsDevicesExpanded((prev) => !prev);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("childDetails.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={[styles.content, { maxWidth: maxContentWidth }]}>
            <View style={styles.profileCard}>
              <View style={[styles.profileHeader, row]}>
                <View style={styles.avatarColumn}>
                  <View style={styles.avatarWrap}>
                  <MaterialCommunityIcons
                          name="human-child"
                          size={22}
                          color="#0F172A"
                        />
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.childProfileButton,
                      pressed && styles.childProfileButtonPressed,
                    ]}
                    onPress={handleOpenChildProfile}
                    accessibilityRole="button"
                    accessibilityLabel={t("childDetails.child_profile_a11y", {
                      name: childName,
                    })}
                  >
                    <AppText
                      weight="bold"
                      style={styles.childProfileButtonText}
                      numberOfLines={1}
                    >
                      {t("childDetails.child_profile")}
                    </AppText>
                  </Pressable>
                </View>

                <View style={styles.profileTextWrap}>
                  <AppText
                    weight="extraBold"
                    style={[styles.childName, text]}
                    numberOfLines={1}
                  >
                    {childName}
                  </AppText>

                  <AppText style={[styles.childMeta, text]} numberOfLines={1}>
                    {t("childDetails.birthdate_value", {
                      value: childBirthDate ?? "",
                    })}
                  </AppText>

                  <AppText style={[styles.childMeta, text]} numberOfLines={1}>
                    {t("childDetails.gender_value", {
                      value: childGenderLabel,
                    })}
                  </AppText>
                </View>
              </View>

              <View style={[styles.statsRow, row]}>
                <View style={styles.statCard}>
                  <AppText weight="bold" style={[styles.statTitle, text]}>
                    {t("childDetails.used_today")}
                  </AppText>

                  <AppText weight="extraBold" style={[styles.statValue, text]}>
                    {"--:--"}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="bold" style={[styles.statTitle, text]}>
                    {t("childDetails.daily_limit")}
                  </AppText>

                  <AppText weight="extraBold" style={[styles.statValue, text]}>
                    {"--:--"}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={[styles.sectionHeader, row]}>
              <Pressable
                onPress={toggleDevicesSection}
                accessibilityRole="button"
                accessibilityLabel={t("childDetails.toggle_devices_a11y")}
                style={({ pressed }) => [
                  styles.devicesToggleButton,
                  pressed && styles.devicesToggleButtonPressed,
                ]}
              >
                <View style={[styles.devicesToggleInner, row]}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("childDetails.devices_title")}
                  </AppText>

                  <MaterialCommunityIcons
                    name={isDevicesExpanded ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#0F172A"
                  />
                </View>
              </Pressable>

              <Pressable
                style={styles.addDeviceButton}
                onPress={handleConnectDevice}
                accessibilityRole="button"
                accessibilityLabel={t("childDetails.add_device_a11y")}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFFFFF" />
                <AppText weight="extraBold" style={styles.addDeviceButtonText}>
                  {t("childDetails.add_device")}
                </AppText>
              </Pressable>
            </View>

            {isDevicesExpanded && (
              <View style={styles.devicesList}>
                {devicesForSelectedChild.map((device) => (
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
                          {t("childDetails.active_now")}
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
                          {t("childDetails.remaining_time_value", {
                            value: device.remainingTimeText,
                          })}
                        </AppText>
                      </View>
                    </View>

                    <View style={[styles.deviceBottomRow, row]}>
                      <Pressable
                        style={styles.deleteButton}
                        accessibilityRole="button"
                        accessibilityLabel={t("childDetails.delete_device_a11y", {
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
                        accessibilityRole="button"
                        accessibilityLabel={t("childDetails.view_limits_a11y", {
                          name: device.name,
                        })}
                      >
                        <AppText weight="bold" style={styles.viewLimitsButtonText}>
                            {t("childDetails.view_limits")}
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}