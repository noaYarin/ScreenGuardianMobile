import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  type ChildOption,
  type DeviceType,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

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

const STATIC_CHILDREN: ChildOption[] = [
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#EC6FB7",
    subtitleKey: "dailyTimeLimits.childRole",
    devices: [
      {
        id: "tamar-phone",
        type: "phone" as DeviceType,
        name: "iPhone 13",
        icon: "cellphone",
      },
      {
        id: "tamar-tablet",
        type: "tablet" as DeviceType,
        name: "iPad Air",
        icon: "tablet",
      },
    ],
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#5B8DEF",
    subtitleKey: "dailyTimeLimits.childRole",
    devices: [
      {
        id: "yonatan-phone",
        type: "phone" as DeviceType,
        name: "Galaxy S23",
        icon: "cellphone",
      },
    ],
  },
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#16C7A1",
    subtitleKey: "dailyTimeLimits.childRole",
    devices: [
      {
        id: "noa-phone",
        type: "phone" as DeviceType,
        name: "iPhone 14",
        icon: "cellphone",
      },
      {
        id: "noa-tablet",
        type: "tablet" as DeviceType,
        name: "iPad Mini",
        icon: "tablet",
      },
    ],
  },
];

const STATIC_LIMITS_BY_DEVICE: Record<string, ScreenLimitCard[]> = {
  "tamar-phone": [
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
  "tamar-tablet": [
    {
      id: "daily",
      titleKey: "dailyTimeLimits.daily.title",
      icon: "clock-outline",
      currentHours: 0.3,
      maxHours: 1.5,
      summaryKey: "dailyTimeLimits.daily.summary",
      summaryValue: "1:30",
    },
    {
      id: "weekly",
      titleKey: "dailyTimeLimits.weekly.title",
      icon: "calendar-blank-outline",
      currentHours: 2,
      maxHours: 9,
      summaryKey: "dailyTimeLimits.weekly.summary",
      summaryValue: "9:00",
    },
  ],
  "yonatan-phone": [
    {
      id: "daily",
      titleKey: "dailyTimeLimits.daily.title",
      icon: "clock-outline",
      currentHours: 1.1,
      maxHours: 2.5,
      summaryKey: "dailyTimeLimits.daily.summary",
      summaryValue: "2:30",
    },
    {
      id: "weekly",
      titleKey: "dailyTimeLimits.weekly.title",
      icon: "calendar-blank-outline",
      currentHours: 7.4,
      maxHours: 16,
      summaryKey: "dailyTimeLimits.weekly.summary",
      summaryValue: "16:00",
    },
  ],
  "noa-phone": [
    {
      id: "daily",
      titleKey: "dailyTimeLimits.daily.title",
      icon: "clock-outline",
      currentHours: 1.6,
      maxHours: 3,
      summaryKey: "dailyTimeLimits.daily.summary",
      summaryValue: "3:00",
    },
    {
      id: "weekly",
      titleKey: "dailyTimeLimits.weekly.title",
      icon: "calendar-blank-outline",
      currentHours: 9.5,
      maxHours: 20,
      summaryKey: "dailyTimeLimits.weekly.summary",
      summaryValue: "20:00",
    },
  ],
  "noa-tablet": [
    {
      id: "daily",
      titleKey: "dailyTimeLimits.daily.title",
      icon: "clock-outline",
      currentHours: 0.9,
      maxHours: 2,
      summaryKey: "dailyTimeLimits.daily.summary",
      summaryValue: "2:00",
    },
    {
      id: "weekly",
      titleKey: "dailyTimeLimits.weekly.title",
      icon: "calendar-blank-outline",
      currentHours: 4.1,
      maxHours: 10,
      summaryKey: "dailyTimeLimits.weekly.summary",
      summaryValue: "10:00",
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

export default function DailyTimeLimitsScreen() {
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const [selectedChildId, setSelectedChildId] = useState<string>("noa");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("noa-phone");

  const [limitsByDevice, setLimitsByDevice] =
    useState<Record<string, ScreenLimitCard[]>>(STATIC_LIMITS_BY_DEVICE);

  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const selectedChild = useMemo(
    () => STATIC_CHILDREN.find((child) => child.id === selectedChildId) ?? STATIC_CHILDREN[0],
    [selectedChildId]
  );

  useEffect(() => {
    const firstDeviceId = selectedChild.devices[0]?.id;
    const selectedDeviceStillExists = selectedChild.devices.some(
      (device) => device.id === selectedDeviceId
    );

    if (!selectedDeviceStillExists && firstDeviceId) {
      setSelectedDeviceId(firstDeviceId);
      setEditingCardId(null);
    }
  }, [selectedChild, selectedDeviceId]);

  const selectedDevice = useMemo(
    () =>
      selectedChild.devices.find((device) => device.id === selectedDeviceId) ??
      selectedChild.devices[0],
    [selectedChild, selectedDeviceId]
  );

  const selectedLimits = limitsByDevice[selectedDevice?.id ?? ""] ?? [];

  const updateLimitByStep = (limitId: string, deltaHours: number) => {
    if (!selectedDevice?.id) return;

    setLimitsByDevice((prev) => {
      const deviceLimits = prev[selectedDevice.id] ?? [];

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
        [selectedDevice.id]: updatedDeviceLimits,
      };
    });

    // Later, here you can send the new value to the backend.
  };

  const handleEditPress = (limitId: string) => {
    if (limitId === "weekly") {
      router.push("/Parent/weeklyScheduleLimits" as Href);

      // Later, you can pass params here if needed, for example:
      // router.push({
      //   pathname: "/Parent/weeklySchedule",
      //   params: {
      //     childId: selectedChildId,
      //     deviceId: selectedDeviceId,
      //   },
      // } as Href);

      return;
    }

    setEditingCardId(limitId);
  };

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
                    { backgroundColor: selectedChild.accent },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.heroAvatarText}>
                    {selectedChild.initial}
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
              childrenOptions={STATIC_CHILDREN}
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={(childId) => {
                setSelectedChildId(childId);
                setEditingCardId(null);
              }}
              onSelectDevice={(deviceId) => {
                setSelectedDeviceId(deviceId);
                setEditingCardId(null);
              }}
              childCardWidth={145}
            />

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
                            deviceName: selectedDevice?.name ?? "",
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
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}