import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  ALL_CHILD_ID,
  type ChildOption,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type ActivityType =
  | "app_locked"
  | "extension_approved"
  | "extension_requested"
  | "screen_locked"
  | "daily_limit_updated"
  | "device_locked";

type ActivityItem = {
  id: string;
  childId: string;
  type: ActivityType;
  titleKey: string;
  descriptionKey: string;
  time: string;
};

type FilterKey = "all" | "locks" | "extensions" | "updates";

const CHILDREN: ChildOption[] = [
  {
    id: "tomer",
    name: "תומר",
    initial: "ת",
    accent: "#FF6B6B",
    subtitleKey: "activityHistory.children.tomerSubtitle",
    devices: [],
  },
  {
    id: "yael",
    name: "יעל",
    initial: "י",
    accent: "#22C55E",
    subtitleKey: "activityHistory.children.yaelSubtitle",
    devices: [],
  },
  {
    id: "noam",
    name: "נועם",
    initial: "נ",
    accent: "#3B82F6",
    subtitleKey: "activityHistory.children.noamSubtitle",
    devices: [],
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "1",
    childId: "tomer",
    type: "screen_locked",
    titleKey: "activityHistory.items.screenLocked.title",
    descriptionKey: "activityHistory.items.screenLocked.description",
    time: "21:00",
  },
  {
    id: "2",
    childId: "yael",
    type: "extension_approved",
    titleKey: "activityHistory.items.extensionApproved.title",
    descriptionKey: "activityHistory.items.extensionApproved.description",
    time: "18:30",
  },
  {
    id: "3",
    childId: "noam",
    type: "daily_limit_updated",
    titleKey: "activityHistory.items.dailyLimitUpdated.title",
    descriptionKey: "activityHistory.items.dailyLimitUpdated.description",
    time: "15:45",
  },
  {
    id: "4",
    childId: "tomer",
    type: "extension_requested",
    titleKey: "activityHistory.items.extensionRequested.title",
    descriptionKey: "activityHistory.items.extensionRequested.description",
    time: "14:20",
  },
  {
    id: "5",
    childId: "yael",
    type: "app_locked",
    titleKey: "activityHistory.items.appLocked.title",
    descriptionKey: "activityHistory.items.appLocked.description",
    time: "12:10",
  },
  {
    id: "6",
    childId: "noam",
    type: "device_locked",
    titleKey: "activityHistory.items.deviceLocked.title",
    descriptionKey: "activityHistory.items.deviceLocked.description",
    time: "09:35",
  },
];

function getActivityMeta(type: ActivityType) {
  switch (type) {
    case "app_locked":
      return {
        icon: "lock-outline" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };
    case "screen_locked":
      return {
        icon: "cellphone-lock" as const,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
      };
    case "device_locked":
      return {
        icon: "tablet-cellphone" as const,
        iconBg: "#FFF7ED",
        iconColor: "#EA580C",
      };
    case "extension_approved":
      return {
        icon: "check-circle-outline" as const,
        iconBg: "#DCFCE7",
        iconColor: "#16A34A",
      };
    case "extension_requested":
      return {
        icon: "clock-outline" as const,
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
      };
    case "daily_limit_updated":
      return {
        icon: "pencil-circle-outline" as const,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
      };
    default:
      return {
        icon: "history" as const,
        iconBg: "#E5E7EB",
        iconColor: "#4B5563",
      };
  }
}

export default function ActivityHistoryScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { row, text, isRTL } = useLocaleLayout();

  const isTablet = width >= 900;

  const [selectedChildId, setSelectedChildId] = useState<string>(ALL_CHILD_ID);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");

  const childCardWidth = width >= 700 ? 160 : 140;

  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter((item) => {
      const matchesChild =
        selectedChildId === ALL_CHILD_ID || item.childId === selectedChildId;

      const matchesFilter =
        selectedFilter === "all"
          ? true
          : selectedFilter === "locks"
          ? ["app_locked", "screen_locked", "device_locked"].includes(item.type)
          : selectedFilter === "extensions"
          ? ["extension_requested", "extension_approved"].includes(item.type)
          : ["daily_limit_updated"].includes(item.type);

      return matchesChild && matchesFilter;
    });
  }, [selectedChildId, selectedFilter]);

  const todayCount = filteredActivities.length;

  const lockCount = filteredActivities.filter((item) =>
    ["app_locked", "screen_locked", "device_locked"].includes(item.type)
  ).length;

  const extensionCount = filteredActivities.filter((item) =>
    ["extension_requested", "extension_approved"].includes(item.type)
  ).length;

  const filters: { key: FilterKey; labelKey: string }[] = [
    { key: "all", labelKey: "activityHistory.filters.all" },
    { key: "locks", labelKey: "activityHistory.filters.locks" },
    { key: "extensions", labelKey: "activityHistory.filters.extensions" },
    { key: "updates", labelKey: "activityHistory.filters.updates" },
  ];

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={[styles.heroTopRow, row]}>
              <View style={styles.heroTitleBlock}>
                <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                  {t("activityHistory.heading")}
                </AppText>

                <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                  {t("activityHistory.subtitle")}
                </AppText>
              </View>

              <View style={styles.heroIconWrap}>
                <MaterialCommunityIcons
                  name="history"
                  size={26}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={[
                styles.summaryGrid,
                isTablet ? styles.summaryGridTablet : null,
              ]}
            >
              <View style={styles.summaryCard}>
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.today")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {todayCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.locks")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {lockCount}
                </AppText>
              </View>

              <View style={styles.summaryCard}>
                <AppText weight="medium" style={[styles.summaryLabel, text]}>
                  {t("activityHistory.summary.extensions")}
                </AppText>

                <AppText weight="extraBold" style={[styles.summaryValue, text]}>
                  {extensionCount}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.selectorSection}>
            <ChildDeviceSelector
              childrenOptions={CHILDREN}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
              showDevices={false}
              includeAllChildrenOption
              childCardWidth={childCardWidth}
              childSectionTitleKey="activityHistory.childSectionTitle"
            />
          </View>

          <View style={styles.filtersSection}>
            <AppText weight="bold" style={[styles.sectionTitle, text]}>
              {t("activityHistory.filterTitle")}
            </AppText>

<View
  style={[
    styles.filtersRow,
    isRTL ? styles.filtersRowRtl : styles.filtersRowLtr,
  ]}
>
  {filters.map((filter) => {
    const active = filter.key === selectedFilter;

    return (
      <Pressable
        key={filter.key}
        onPress={() => setSelectedFilter(filter.key)}
        accessibilityRole="button"
        accessibilityLabel={t(filter.labelKey)}
        style={({ pressed }) => [
          styles.filterChip,
          active ? styles.filterChipActive : null,
          pressed ? styles.pressed : null,
        ]}
      >
        <AppText
          weight={active ? "bold" : "medium"}
          style={[
            styles.filterChipText,
            text,
            active ? styles.filterChipTextActive : null,
          ]}
        >
          {t(filter.labelKey)}
        </AppText>
      </Pressable>
    );
  })}
</View>
          </View>

          <View style={styles.listSection}>
            <View style={[styles.listHeaderRow, row]}>
              <AppText weight="bold" style={[styles.sectionTitle, text]}>
                {t("activityHistory.activityListTitle")}
              </AppText>

              <AppText weight="medium" style={[styles.resultCount, text]}>
                {t("activityHistory.resultCount", {
                  count: filteredActivities.length,
                })}
              </AppText>
            </View>

            {filteredActivities.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons
                    name="clipboard-text-clock-outline"
                    size={26}
                    color="#4F46E5"
                  />
                </View>

                <AppText weight="bold" style={[styles.emptyTitle, text]}>
                  {t("activityHistory.empty.title")}
                </AppText>

                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("activityHistory.empty.subtitle")}
                </AppText>
              </View>
            ) : (
              filteredActivities.map((item) => {
                const child = CHILDREN.find((c) => c.id === item.childId);
                const meta = getActivityMeta(item.type);

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={t("activityHistory.activityCardA11y", {
                      title: t(item.titleKey),
                      childName: child?.name ?? "",
                      time: item.time,
                    })}
                    style={({ pressed }) => [
                      styles.activityCard,
                      pressed ? styles.pressed : null,
                    ]}
                  >
                    <View style={[styles.activityTopRow, row]}>
                      <View style={styles.activityMainContent}>
                        <View
                          style={[
                            styles.activityTitleRow,
                            row,
                            styles.activityTitleRowSpacing,
                          ]}
                        >
                          <View
                            style={[
                              styles.activityIconCircle,
                              { backgroundColor: meta.iconBg },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={meta.icon}
                              size={22}
                              color={meta.iconColor}
                            />
                          </View>

                          <View style={styles.activityTextWrap}>
                            <AppText
                              weight="bold"
                              style={[styles.activityTitle, text]}
                            >
                              {t(item.titleKey)}
                            </AppText>

                            <AppText
                              weight="medium"
                              style={[styles.activityDescription, text]}
                            >
                              {t(item.descriptionKey, {
                                childName: child?.name ?? "",
                              })}
                            </AppText>
                          </View>
                        </View>
                      </View>

                      <View style={styles.timeWrap}>
                        <AppText weight="bold" style={styles.timeText}>
                          {item.time}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}