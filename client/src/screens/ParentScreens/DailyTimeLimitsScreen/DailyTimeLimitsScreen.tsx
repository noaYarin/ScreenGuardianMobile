import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
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
const HERO_ACCENT_COLOR = "#7C3AED";

function formatHoursToClock(totalHours: number) {
  const wholeHours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - wholeHours) * 60);

  const normalizedHours = minutes === 60 ? wholeHours + 1 : wholeHours;
  const normalizedMinutes = minutes === 60 ? 0 : minutes;

  return `${normalizedHours}:${String(normalizedMinutes).padStart(2, "0")}`;
}

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

  const [tempLimits, setTempLimits] = useState<Record<string, number>>({});

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

  const selectedChild = useMemo(() => {
    if (!children.length) return null;

    return (
      children.find((c) => String(c._id) === String(selectedChildId)) ??
      children[0]
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
      setTempLimits({});
    }
  }, [selectedChild, selectedDeviceId, devicesByChild]);

  const selectedDevice = useMemo(() => {
    if (!devices.length) return null;

    return (
      devices.find((d) => String(d._id) === String(selectedDeviceId)) ??
      devices[0]
    );
  }, [devices, selectedDeviceId]);

  const selectedChildName = useMemo(() => {
    if (!selectedChild) return "";
    return typeof selectedChild.name === "string" ? selectedChild.name : "";
  }, [selectedChild]);

  const selectedChildInitial = useMemo(() => {
    return selectedChildName.trim()[0] ?? "?";
  }, [selectedChildName]);

  const selectedLimits: ScreenLimitCard[] = useMemo(() => {
    if (!selectedDevice) return [];

    const dailyLimitMinutes = selectedDevice.screenTime?.dailyLimitMinutes ?? 0;
    const weeklyLimitMinutes =
      selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;
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

  const handleEditPress = (limitId: string) => {
    if (!selectedDevice) return;

    if (limitId === "weekly") {
      router.push("/Parent/weeklyScheduleLimits" as Href);
      return;
    }

    const currentMinutes =
      limitId === "daily"
        ? selectedDevice.screenTime?.dailyLimitMinutes ?? 0
        : selectedDevice.screenTime?.weeklyLimitMinutes ?? 0;

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: currentMinutes,
    }));

    setEditingCardId(limitId);
  };

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDevice || !selectedChildId) return;

    const baseMinutes =
      tempLimits[limitId] ??
      (limitId === "daily"
        ? selectedDevice.screenTime?.dailyLimitMinutes ?? 0
        : selectedDevice.screenTime?.weeklyLimitMinutes ?? 0);

    const nextMinutes = Math.max(MIN_HOURS * 60, baseMinutes + deltaHours * 60);

    setTempLimits((prev) => ({
      ...prev,
      [limitId]: Math.round(nextMinutes),
    }));
  };

  const handleDonePress = async (limitId: string) => {
    if (!selectedDevice || !selectedChildId) return;

    const nextMinutes = tempLimits[limitId];
    if (nextMinutes == null) {
      setEditingCardId(null);
      return;
    }

    try {
      await dispatch(
        updateDeviceScreenTimeThunk({
          childId: selectedChildId,
          deviceId: selectedDevice._id,
          isLimitEnabled: true,
          ...(limitId === "daily"
            ? { dailyLimitMinutes: nextMinutes }
            : { weeklyLimitMinutes: nextMinutes }),
        })
      ).unwrap();

      Alert.alert(
        t("common.success"),
        t("dailyTimeLimits.update_success")
      );

      setEditingCardId(null);
      setTempLimits((prev) => {
        const updated = { ...prev };
        delete updated[limitId];
        return updated;
      });
    } catch {
      Alert.alert(
        t("common.error"),
        t("dailyTimeLimits.update_error")
      );
    }
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

  if (!selectedChild) {
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
                    { backgroundColor: HERO_ACCENT_COLOR },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.heroAvatarText}>
                    {selectedChildInitial}
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
              onSelectChild={(childId) => {
                setSelectedChildId(String(childId));
                setEditingCardId(null);
                setTempLimits({});
              }}
              onSelectDevice={(deviceId) => {
                setSelectedDeviceId(String(deviceId));
                setEditingCardId(null);
                setTempLimits({});
              }}
              showDevices={true}
            />

            {!selectedDevice ? (
              <View style={styles.cardsList}>
                <AppText style={text}>
                  {t("devices.fetch_devices_failed")}
                </AppText>
              </View>
            ) : (
              <View style={styles.cardsList}>
                {selectedLimits.map((limitCard) => {
                  const isEditing = editingCardId === limitCard.id;
                  const effectiveMaxHours = isEditing
                    ? (tempLimits[limitCard.id] ?? limitCard.maxHours * 60) / 60
                    : limitCard.maxHours;

                  const progress =
                    effectiveMaxHours > 0
                      ? Math.min(limitCard.currentHours / effectiveMaxHours, 1)
                      : 0;

                  const canDecrease = effectiveMaxHours > MIN_HOURS;
                  const isWeeklyCard = limitCard.id === "weekly";

                  return (
                    <View key={limitCard.id} style={styles.limitCard}>
                      <View style={[styles.limitTopRow, row]}>
                        <View style={styles.limitTitleWrap}>
                          <AppText
                            weight="bold"
                            style={[styles.limitTitle, text]}
                          >
                            {t(limitCard.titleKey)}
                          </AppText>

                          <AppText
                            weight="medium"
                            style={[styles.limitMeta, text]}
                          >
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
                          <AppText
                            weight="medium"
                            style={[styles.timePillLabel, text]}
                          >
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
                          <AppText
                            weight="medium"
                            style={[styles.timePillLabel, text]}
                          >
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
                            {formatHoursToClock(effectiveMaxHours)}
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
                        <AppText
                          weight="medium"
                          style={[styles.progressMetaText, text]}
                        >
                          {t("dailyTimeLimits.usedLabel")}
                        </AppText>

                        <AppText
                          weight="bold"
                          style={[styles.progressMetaValue, text]}
                        >
                          {`${Math.round(progress * 100)}%`}
                        </AppText>
                      </View>

                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            isRTL
                              ? styles.progressFillRtl
                              : styles.progressFillLtr,
                            { width: `${progress * 100}%` },
                          ]}
                        />
                      </View>

                      <AppText weight="medium" style={[styles.summaryText, text]}>
                        {t(limitCard.summaryKey, {
                          value: formatHoursToClock(effectiveMaxHours),
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
                              ? t("dailyTimeLimits.almostReached")
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
                              <AppText
                                weight="bold"
                                style={styles.editButtonText}
                              >
                                {isWeeklyCard
                                  ? t("dailyTimeLimits.editWeekly")
                                  : t("dailyTimeLimits.edit")}
                              </AppText>

                              <MaterialCommunityIcons
                                name={
                                  isWeeklyCard
                                    ? "chevron-left"
                                    : "pencil-outline"
                                }
                                size={18}
                                color="#FFFFFF"
                              />
                            </Pressable>
                          </View>
                        ) : (
                          <View style={styles.editorWrap}>
                            <View style={[styles.editorHeaderRow, row]}>
                              <AppText
                                weight="bold"
                                style={[styles.editorTitle, text]}
                              >
                                {t("dailyTimeLimits.edit")}
                              </AppText>

                              <Pressable
                                onPress={() => handleDonePress(limitCard.id)}
                                accessibilityRole="button"
                                accessibilityLabel={t(
                                  "dailyTimeLimits.a11y.doneEditing"
                                )}
                                style={({ pressed }) => [
                                  styles.doneButton,
                                  pressed && styles.doneButtonPressed,
                                ]}
                              >
                                <AppText
                                  weight="bold"
                                  style={styles.doneButtonText}
                                >
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
                                    !canDecrease &&
                                      styles.stepButtonTextDisabled,
                                  ]}
                                >
                                  5-
                                </AppText>
                              </Pressable>

                              <View style={styles.currentValueBox}>
                                <AppText
                                  weight="medium"
                                  style={[styles.currentValueLabel, text]}
                                >
                                  {t("dailyTimeLimits.currentLimit")}
                                </AppText>

                                <AppText
                                  weight="extraBold"
                                  style={styles.currentValueText}
                                >
                                  {formatHoursToClock(effectiveMaxHours)}
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
                                <AppText
                                  weight="bold"
                                  style={styles.stepButtonTextPrimary}
                                >
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