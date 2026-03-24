import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  type ChildOption,
  type DeviceType,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { useDispatch, useSelector } from "react-redux";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceScreenTimeThunk,
} from "@/src/redux/thunks/deviceThunks";

type ScreenLimitCard = {
  id: string;
  titleKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  currentHours: number;
  maxHours: number;
  summaryKey: string;
  summaryValue: string;
};

const STEP_HOURS = 5 / 60;
const MIN_HOURS = 5 / 60;

function formatHoursToClock(totalHours: number) {
  const wholeHours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - wholeHours) * 60);

  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  const normalizedMinutes = minutes === 60 ? 0 : minutes;

  return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}`;
}

const AVATAR_COLORS = ["#EC6FB7", "#5B8DEF", "#16C7A1", "#F59E0B", "#8B5CF6"];

export default function DailyTimeLimitsScreen() {
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const dispatch = useDispatch<AppDispatch>();

  const { childrenList, isLoading, error } = useSelector(
    (state: RootState) => state.children
  );

  const children = Array.isArray(childrenList) ? childrenList : [];

  const devicesByChild = useSelector(
    (state: RootState) => state.devices.byChildId ?? {}
  );

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && children.length > 0) {
      setSelectedChildId(String(children[0]._id));
    }
  }, [children, selectedChildId]);

  useEffect(() => {
    if (selectedChildId) {
      dispatch(fetchDevicesByChild(selectedChildId));
    }
  }, [dispatch, selectedChildId]);

  const childrenOptions: ChildOption[] = useMemo(() => {
    return children.map((child, index) => {
      const childDevices = devicesByChild[child._id] ?? [];

      return {
        id: String(child._id),
        name: child.name ?? "",
        initial: child.name?.[0] ?? "?",
        accent: AVATAR_COLORS[index % AVATAR_COLORS.length],
        subtitleKey: "childDeviceSelector.defaultChildSubtitle",

        devices: childDevices.map((device) => {
          const typeLower = String(device.type).toLowerCase();

          const mappedType: DeviceType =
            typeLower === "tablet" ? "tablet" : "phone";

          return {
            id: String(device._id),
            name: device.name ?? "",
            type: mappedType,
            icon: mappedType === "tablet" ? "tablet" : "cellphone",
          };
        }),
      };
    });
  }, [children, devicesByChild]);

  
  const selectedChildOption = useMemo(() => {
    if (!childrenOptions.length) return null;
    return (
      childrenOptions.find((child) => String(child.id) === String(selectedChildId)) ??
      childrenOptions[0]
    );
  }, [childrenOptions, selectedChildId]);

  const selectedChild = useMemo(() => {
    if (!children.length) return null;
    return (
      children.find((c) => String(c._id) === String(selectedChildId)) ?? children[0]
    );
  }, [children, selectedChildId]);

  const devices = selectedChild ? devicesByChild[selectedChild._id] ?? [] : [];

  useEffect(() => {
    if (!selectedChild?._id) return;

    const currentDevices = devicesByChild[selectedChild._id] ?? [];
    const firstDeviceId = currentDevices[0]?._id;

    const exists = currentDevices.some(
      (d) => String(d._id) === String(selectedDeviceId)
    );

    if (!exists) {
      setSelectedDeviceId(firstDeviceId ? String(firstDeviceId) : "");
      setEditingCardId(null);
    }
  }, [selectedChild, selectedDeviceId, devicesByChild]);

  const selectedDevice = useMemo(() => {
    if (!devices.length) return null;
    return (
      devices.find((d) => String(d._id) === String(selectedDeviceId)) ?? devices[0]
    );
  }, [devices, selectedDeviceId]);

  const selectedLimits: ScreenLimitCard[] = useMemo(() => {
    if (!selectedDevice) return [];

    const dailyLimitMinutes = selectedDevice.screenTime?.dailyLimitMinutes ?? 0;
    const weeklyLimitMinutes = selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;
    const usedTodayMinutes = selectedDevice.screenTime?.usedTodayMinutes ?? 0;
    const usedWeekMinutes = selectedDevice.screenTime?.usedWeekMinutes ?? 0;

    return [
      {
        id: "daily",
        titleKey: "dailyTimeLimits.daily.title",
        icon: "clock-outline",
        currentHours: usedTodayMinutes / 60,
        maxHours: dailyLimitMinutes / 60,
        summaryKey: "dailyTimeLimits.daily.summary",
        summaryValue: formatHoursToClock(dailyLimitMinutes / 60),
      },
      {
        id: "weekly",
        titleKey: "dailyTimeLimits.weekly.title",
        icon: "calendar-blank-outline",
        currentHours: usedWeekMinutes / 60,
        maxHours: weeklyLimitMinutes / 60,
        summaryKey: "dailyTimeLimits.weekly.summary",
        summaryValue: formatHoursToClock(weeklyLimitMinutes / 60),
      },
    ];
  }, [selectedDevice]);

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDevice || !selectedChildId) return;

    if (limitId === "daily") {
      const currentMinutes = selectedDevice.screenTime?.dailyLimitMinutes ?? 0;
      const nextMinutes = Math.max(5, currentMinutes + deltaHours * 60);

      dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          dailyLimitMinutes: Math.round(nextMinutes),
          isLimitEnabled: true,
        })
      );
      return;
    }

    if (limitId === "weekly") {
      const currentMinutes = selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;
      const nextMinutes = Math.max(5, currentMinutes + deltaHours * 60);

      dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          weeklyLimitMinutes: Math.round(nextMinutes),
          isLimitEnabled: true,
        })
      );
    }
  };

  const handleEditPress = (limitId: string) => {
    if (limitId === "weekly") {
      router.push("/Parent/weeklyScheduleLimits" as Href);
      return;
    }

    setEditingCardId(limitId);
  };

  if (isLoading && children.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </ScreenLayout>
      </>
    );
  }

  if (error && children.length === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <AppText>{t(error)}</AppText>
          </View>
        </ScreenLayout>
      </>
    );
  }

  if (!selectedChild || !selectedChildOption) {
    return (
      <>
        <Stack.Screen
          options={{
            title: t("dailyTimeLimits.title"),
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
        <ScreenLayout>
          <View style={styles.container}>
            <AppText>{t("homeParent.no_children")}</AppText>
          </View>
        </ScreenLayout>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: t("dailyTimeLimits.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.heroCard}>
              <View style={[styles.heroHeader, row]}>
                <View
                  style={[
                    styles.heroAvatar,
                    { backgroundColor: selectedChildOption.accent },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.heroAvatarText}>
                    {selectedChildOption.initial}
                  </AppText>
                </View>

                <View style={styles.heroTextBlock}>
                  <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                    {t("dailyTimeLimits.heroTitle")}
                  </AppText>

                  <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                    {t("dailyTimeLimits.heroSubtitle")}
                  </AppText>
                </View>
              </View>
            </View>

            <ChildDeviceSelector
              childrenOptions={childrenOptions}
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={(childId) => {
                setSelectedChildId(String(childId));
                setEditingCardId(null);
              }}
              onSelectDevice={(deviceId) => {
                setSelectedDeviceId(String(deviceId));
                setEditingCardId(null);
              }}
              childCardWidth={145}
            />

            {!selectedDevice ? (
              <View style={styles.cardsList}>
                <AppText style={text}>
                  No devices connected to this child yet
                </AppText>
              </View>
            ) : (
              <View style={styles.cardsList}>
                {selectedLimits.map((limitCard) => {
                  const progress =
                    limitCard.maxHours > 0
                      ? Math.min(limitCard.currentHours / limitCard.maxHours, 1)
                      : 0;

                  const isEditing = editingCardId === limitCard.id;
                  const canDecrease = limitCard.maxHours > MIN_HOURS;
                  const isWeeklyCard = limitCard.id === "weekly";

                  return (
                    <View key={limitCard.id} style={styles.limitCard}>
                      <View style={[styles.limitTopRow, row]}>
                        <View style={styles.limitTitleWrap}>
                          <AppText weight="bold" style={[styles.limitTitle, text]}>
                            {t(limitCard.titleKey)}
                          </AppText>

                          <AppText weight="medium" style={[styles.limitMeta, text]}>
                            {t("dailyTimeLimits.deviceContext", {
                              childName: selectedChild.name,
                              deviceName: selectedDevice.name ?? "",
                            })}
                          </AppText>
                        </View>

                        <View style={styles.limitIconBox}>
                          <MaterialCommunityIcons
                            name={limitCard.icon}
                            size={24}
                            color="#3D6BF2"
                          />
                        </View>
                      </View>

                      <View style={[styles.timePillsRow, row]}>
                        <View style={styles.timePill}>
                          <AppText weight="medium" style={[styles.timePillLabel, text]}>
                            {t("dailyTimeLimits.range.startLabel")}
                          </AppText>

                          <AppText
                            weight="bold"
                            style={[
                              styles.timePillValue,
                              text,
                              isRTL && styles.timePillValueRtl,
                            ]}
                          >
                            {formatHoursToClock(limitCard.currentHours)}
                          </AppText>
                        </View>

                        <View style={styles.timePill}>
                          <AppText weight="medium" style={[styles.timePillLabel, text]}>
                            {t("dailyTimeLimits.range.endLabel")}
                          </AppText>

                          <AppText
                            weight="bold"
                            style={[
                              styles.timePillValue,
                              text,
                              isRTL && styles.timePillValueRtl,
                            ]}
                          >
                            {formatHoursToClock(limitCard.maxHours)}
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.progressMetaRow,
                          row,
                          isRTL && styles.progressMetaRowRtl,
                        ]}
                      >
                        <AppText weight="medium" style={[styles.progressMetaText, text]}>
                          {t("dailyTimeLimits.usedLabel")}
                        </AppText>

                        <AppText weight="bold" style={[styles.progressMetaValue, text]}>
                          {`${Math.round(progress * 100)}%`}
                        </AppText>
                      </View>

                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            isRTL ? styles.progressFillRtl : styles.progressFillLtr,
                            { width: `${progress * 100}%` },
                          ]}
                        />
                      </View>

                      <AppText weight="medium" style={[styles.summaryText, text]}>
                        {t(limitCard.summaryKey, {
                          value: limitCard.summaryValue,
                        })}
                      </AppText>

                      <View style={styles.actionsRow}>
                        <View
                          style={[
                            styles.statusChip,
                            progress >= 0.8
                              ? styles.statusChipWarning
                              : styles.statusChipNormal,
                          ]}
                        >
                          <AppText
                            weight="bold"
                            style={[
                              styles.statusChipText,
                              progress >= 0.8
                                ? styles.statusChipTextWarning
                                : styles.statusChipTextNormal,
                            ]}
                          >
                            {progress >= 0.8
                              ? t("dailyTimeLimits.status.almostReached")
                              : t("dailyTimeLimits.status.ok")}
                          </AppText>
                        </View>

                        {!isEditing ? (
                          <View style={styles.editButtonWrap}>
                            <Pressable
                              onPress={() => handleEditPress(limitCard.id)}
                              accessibilityRole="button"
                              accessibilityLabel={
                                isWeeklyCard
                                  ? t("dailyTimeLimits.a11y.editWeeklySchedule")
                                  : t("dailyTimeLimits.a11y.editDailyLimit")
                              }
                              style={({ pressed }) => [
                                styles.editButton,
                                row,
                                pressed && styles.editButtonPressed,
                              ]}
                            >
                              <AppText weight="bold" style={styles.editButtonText}>
                                {isWeeklyCard
                                  ? t("dailyTimeLimits.editWeekly")
                                  : t("dailyTimeLimits.edit")}
                              </AppText>

                              <MaterialCommunityIcons
                                name={isWeeklyCard ? "chevron-left" : "pencil-outline"}
                                size={18}
                                color="#FFFFFF"
                              />
                            </Pressable>
                          </View>
                        ) : (
                          <View style={styles.editorWrap}>
                            <View style={[styles.editorHeaderRow, row]}>
                              <AppText weight="bold" style={[styles.editorTitle, text]}>
                                {t("dailyTimeLimits.edit")}
                              </AppText>

                              <Pressable
                                onPress={() => setEditingCardId(null)}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.doneEditing")}
                                style={({ pressed }) => [
                                  styles.doneButton,
                                  pressed && styles.doneButtonPressed,
                                ]}
                              >
                                <AppText weight="bold" style={styles.doneButtonText}>
                                  {t("dailyTimeLimits.done")}
                                </AppText>
                              </Pressable>
                            </View>

                            <View
                              style={[
                                styles.editorControlsRow,
                                isRTL && styles.editorControlsRowRtl,
                              ]}
                            >
                              <Pressable
                                onPress={() =>
                                  updateLimitByStep(limitCard.id, -STEP_HOURS)
                                }
                                disabled={!canDecrease}
                                accessibilityRole="button"
                                accessibilityLabel={t(
                                  "dailyTimeLimits.a11y.decreaseByFiveMinutes"
                                )}
                                style={({ pressed }) => [
                                  styles.stepButton,
                                  styles.stepButtonSecondary,
                                  pressed && styles.stepButtonPressed,
                                  !canDecrease && styles.stepButtonDisabled,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="minus"
                                  size={18}
                                  color={canDecrease ? "#1F2A44" : "#A8B3C7"}
                                />
                                <AppText
                                  weight="bold"
                                  style={[
                                    styles.stepButtonTextSecondary,
                                    !canDecrease && styles.stepButtonTextDisabled,
                                  ]}
                                >
                                  5-
                                </AppText>
                              </Pressable>

                              <View style={styles.currentValueBox}>
                                <AppText weight="medium" style={[styles.currentValueLabel, text]}>
                                  {t("dailyTimeLimits.currentLimit")}
                                </AppText>

                                <AppText weight="extraBold" style={styles.currentValueText}>
                                  {formatHoursToClock(limitCard.maxHours)}
                                </AppText>
                              </View>

                              <Pressable
                                onPress={() =>
                                  updateLimitByStep(limitCard.id, STEP_HOURS)
                                }
                                accessibilityRole="button"
                                accessibilityLabel={t(
                                  "dailyTimeLimits.a11y.increaseByFiveMinutes"
                                )}
                                style={({ pressed }) => [
                                  styles.stepButton,
                                  styles.stepButtonPrimary,
                                  pressed && styles.stepButtonPressed,
                                ]}
                              >
                                <MaterialCommunityIcons
                                  name="plus"
                                  size={18}
                                  color="#FFFFFF"
                                />
                                <AppText weight="bold" style={styles.stepButtonTextPrimary}>
                                  5+
                                </AppText>
                              </Pressable>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}