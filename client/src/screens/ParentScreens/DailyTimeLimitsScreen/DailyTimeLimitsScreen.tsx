import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import { fetchDevicesByChild } from "@/src/redux/slices/device-slice";

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

// זמני בלבד עד שתחברי את ההגבלות מהשרת / Redux
const STATIC_LIMITS_BY_DEVICE: Record<string, ScreenLimitCard[]> = {
  "demo-device-1": [
    {
      id: "daily",
      titleKey: "dailyTimeLimits.daily.title",
      icon: "clock-outline",
      currentHours: 0.8,
      maxHours: 2,
      summaryKey: "dailyTimeLimits.daily.summary",
      summaryValue: "2:00",
    },
    {
      id: "weekly",
      titleKey: "dailyTimeLimits.weekly.title",
      icon: "calendar-blank-outline",
      currentHours: 5.2,
      maxHours: 14,
      summaryKey: "dailyTimeLimits.weekly.summary",
      summaryValue: "14:00",
    },
  ],
};

function formatHoursToClock(totalHours: number) {
  const wholeHours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - wholeHours) * 60);

  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  const normalizedMinutes = minutes === 60 ? 0 : minutes;

  return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}`;
}

function getAccentFromIndex(index: number) {
  const accents = ["#EC6FB7", "#5B8DEF", "#16C7A1", "#F59E0B", "#8B5CF6"];
  return accents[index % accents.length];
}

export default function DailyTimeLimitsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const {
    childrenList,
    isLoading: childrenLoading,
    error: childrenError,
  } = useSelector((state: RootState) => state.children);

  const { byChildId, statusByChildId, errorByChildId } = useSelector(
    (state: RootState) => state.devices
  );

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const [limitsByDevice, setLimitsByDevice] =
    useState<Record<string, ScreenLimitCard[]>>(STATIC_LIMITS_BY_DEVICE);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && childrenList.length > 0) {
      setSelectedChildId(String(childrenList[0]._id));
    }
  }, [childrenList, selectedChildId]);

  useEffect(() => {
    if (!selectedChildId) return;
    dispatch(fetchDevicesByChild(selectedChildId));
  }, [dispatch, selectedChildId]);

  const selectedChild = useMemo(() => {
    return (
      childrenList.find((child) => String(child._id) === selectedChildId) ?? null
    );
  }, [childrenList, selectedChildId]);

  const selectedChildIndex = useMemo(() => {
    return childrenList.findIndex(
      (child) => String(child._id) === selectedChildId
    );
  }, [childrenList, selectedChildId]);

  const currentChildDevices = useMemo(() => {
    return byChildId[selectedChildId] ?? [];
  }, [byChildId, selectedChildId]);

  const devicesStatus = selectedChildId
    ? statusByChildId[selectedChildId] ?? "idle"
    : "idle";

  const devicesError = selectedChildId
    ? errorByChildId[selectedChildId] ?? null
    : null;

  useEffect(() => {
    if (!currentChildDevices.length) {
      if (selectedDeviceId) {
        setSelectedDeviceId("");
        setEditingCardId(null);
      }
      return;
    }

    const selectedStillExists = currentChildDevices.some(
      (device: any) => String(device._id) === selectedDeviceId
    );

    if (!selectedStillExists) {
      const firstDeviceId = String(currentChildDevices[0]._id);
      setSelectedDeviceId(firstDeviceId);
      setEditingCardId(null);
    }
  }, [currentChildDevices, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    return (
      currentChildDevices.find(
        (device: any) => String(device._id) === selectedDeviceId
      ) ?? null
    );
  }, [currentChildDevices, selectedDeviceId]);

  const selectedDeviceName = selectedDevice
    ? String(
        (selectedDevice as any).deviceName ??
          (selectedDevice as any).model ??
          (selectedDevice as any).name ??
          ""
      )
    : "";

  const selectedLimits = limitsByDevice[selectedDeviceId] ?? [];

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDeviceId) return;

    setLimitsByDevice((prev) => {
      const deviceLimits = prev[selectedDeviceId] ?? [];

      const updatedDeviceLimits = deviceLimits.map((limit) => {
        if (limit.id !== limitId) return limit;

        const nextMaxHours = Math.max(MIN_HOURS, limit.maxHours + deltaHours);

        return {
          ...limit,
          maxHours: Number(nextMaxHours.toFixed(4)),
          summaryValue: formatHoursToClock(nextMaxHours),
        };
      });

      return {
        ...prev,
        [selectedDeviceId]: updatedDeviceLimits,
      };
    });

    // כאן בהמשך תשלחי לשרת את הערך החדש
  };

  const handleEditPress = (limitId: string) => {
    if (limitId === "weekly") {
      router.push("/Parent/weeklyScheduleLimits" as Href);
      return;
    }

    setEditingCardId(limitId);
  };

  const heroInitial = String(selectedChild?.name ?? "").trim()[0] ?? "";
  const heroAccent = getAccentFromIndex(
    selectedChildIndex >= 0 ? selectedChildIndex : 0
  );

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
                    { backgroundColor: heroAccent },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.heroAvatarText}>
                    {heroInitial}
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
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              showDevices
              onSelectChild={(childId) => {
                setSelectedChildId(childId);
                setSelectedDeviceId("");
                setEditingCardId(null);
              }}
              onSelectDevice={(deviceId) => {
                setSelectedDeviceId(deviceId);
                setEditingCardId(null);
              }}
            />

            {childrenLoading && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            )}

            {!!childrenError && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(childrenError, childrenError)}
                </AppText>
              </View>
            )}

            {!childrenLoading && !childrenError && selectedChildId && devicesStatus === "loading" && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            )}

            {!childrenLoading && !childrenError && !!devicesError && (
              <View style={styles.emptyState}>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t(devicesError, devicesError)}
                </AppText>
              </View>
            )}

            {!childrenLoading &&
              !childrenError &&
              selectedChildId &&
              devicesStatus !== "loading" &&
              !devicesError &&
              currentChildDevices.length === 0 && (
                <View style={styles.emptyState}>
                  <AppText weight="bold" style={[styles.emptyTitle, text]}>
                    {t("dailyTimeLimits.empty.noDevicesTitle", "No devices found")}
                  </AppText>

                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t(
                      "dailyTimeLimits.empty.noDevicesSubtitle",
                      "There are no connected devices for this child yet."
                    )}
                  </AppText>
                </View>
              )}

            {!childrenLoading &&
              !childrenError &&
              selectedDeviceId &&
              currentChildDevices.length > 0 &&
              selectedLimits.length === 0 && (
                <View style={styles.emptyState}>
                  <AppText weight="bold" style={[styles.emptyTitle, text]}>
                    {t("dailyTimeLimits.empty.noLimitsTitle", "No limits yet")}
                  </AppText>

                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t(
                      "dailyTimeLimits.empty.noLimitsSubtitle",
                      "No screen-time limits were found for this device yet."
                    )}
                  </AppText>
                </View>
              )}

            {selectedLimits.length > 0 && (
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
                              childName: selectedChild?.name ?? "",
                              deviceName: selectedDeviceName,
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
                                onPress={() => updateLimitByStep(limitCard.id, -STEP_HOURS)}
                                disabled={!canDecrease}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.decreaseByFiveMinutes")}
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
                                onPress={() => updateLimitByStep(limitCard.id, STEP_HOURS)}
                                accessibilityRole="button"
                                accessibilityLabel={t("dailyTimeLimits.a11y.increaseByFiveMinutes")}
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