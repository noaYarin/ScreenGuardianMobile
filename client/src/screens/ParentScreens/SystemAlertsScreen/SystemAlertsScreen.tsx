import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, ALERT_COLORS } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type AlertSeverity = "critical" | "warning" | "info" | "success";
type AlertFilter = "all" | "unread" | "critical";

type AlertItem = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  timeKey: string;
  severity: AlertSeverity;
  isUnread: boolean;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

const STATIC_ALERTS: AlertItem[] = [
  {
    id: "1",
    titleKey: "systemAlerts.alerts.securityAttempt.title",
    descriptionKey: "systemAlerts.alerts.securityAttempt.description",
    timeKey: "systemAlerts.time.minutesAgo10",
    severity: "critical",
    isUnread: true,
    icon: "shield-alert-outline",
  },
  {
    id: "2",
    titleKey: "systemAlerts.alerts.dailyLimit.title",
    descriptionKey: "systemAlerts.alerts.dailyLimit.description",
    timeKey: "systemAlerts.time.minutesAgo25",
    severity: "warning",
    isUnread: true,
    icon: "clock-alert-outline",
  },
  {
    id: "3",
    titleKey: "systemAlerts.alerts.unusualActivity.title",
    descriptionKey: "systemAlerts.alerts.unusualActivity.description",
    timeKey: "systemAlerts.time.hourAgo1",
    severity: "warning",
    isUnread: false,
    icon: "chart-line-variant",
  },
  {
    id: "4",
    titleKey: "systemAlerts.alerts.newApp.title",
    descriptionKey: "systemAlerts.alerts.newApp.description",
    timeKey: "systemAlerts.time.hoursAgo3",
    severity: "info",
    isUnread: false,
    icon: "cellphone-arrow-down",
  },
  {
    id: "5",
    titleKey: "systemAlerts.alerts.requestApproved.title",
    descriptionKey: "systemAlerts.alerts.requestApproved.description",
    timeKey: "systemAlerts.time.hoursAgo5",
    severity: "success",
    isUnread: false,
    icon: "check-decagram-outline",
  },
];

const FILTERS: AlertFilter[] = ["all", "unread", "critical"];

export default function SystemAlertsScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();

  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>("all");

  const filteredAlerts = useMemo(() => {
    switch (selectedFilter) {
      case "unread":
        return STATIC_ALERTS.filter((alert) => alert.isUnread);
      case "critical":
        return STATIC_ALERTS.filter((alert) => alert.severity === "critical");
      case "all":
      default:
        return STATIC_ALERTS;
    }
  }, [selectedFilter]);

  const unreadCount = STATIC_ALERTS.filter((alert) => alert.isUnread).length;
  const criticalCount = STATIC_ALERTS.filter(
    (alert) => alert.severity === "critical"
  ).length;
  const totalCount = STATIC_ALERTS.length;

  return (
    <>
      <Stack.Screen
        options={{
          title: t("systemAlerts.title"),
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
              <View style={styles.heroTopRow}>
                <View style={styles.heroTextWrap}>
                  <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                    {t("systemAlerts.heading")}
                  </AppText>

                  <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                    {t("systemAlerts.subtitle")}
                  </AppText>
                </View>

                <View style={styles.heroIconWrap}>
                  <MaterialCommunityIcons
                    name="bell-badge-outline"
                    size={26}
                    color="#3D5AFE"
                  />
                </View>
              </View>

              <View style={[styles.statsRow, row]}>
                <View style={styles.statCard}>
                  <AppText weight="extraBold" style={styles.statValue}>
                    {totalCount}
                  </AppText>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("systemAlerts.stats.total")}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="extraBold" style={styles.statValue}>
                    {unreadCount}
                  </AppText>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("systemAlerts.stats.unread")}
                  </AppText>
                </View>

                <View style={styles.statCard}>
                  <AppText weight="extraBold" style={styles.statValue}>
                    {criticalCount}
                  </AppText>
                  <AppText weight="medium" style={[styles.statLabel, text]}>
                    {t("systemAlerts.stats.critical")}
                  </AppText>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <AppText weight="bold" style={[styles.sectionTitle, text]}>
                {t("systemAlerts.filters.title")}
              </AppText>
            </View>

            <View style={[styles.filtersRow, row]}>
              {FILTERS.map((filterKey) => {
                const isSelected = selectedFilter === filterKey;

                return (
                  <Pressable
                    key={filterKey}
                    onPress={() => setSelectedFilter(filterKey)}
                    accessibilityRole="button"
                    accessibilityLabel={t(
                      `systemAlerts.filters.a11y.${filterKey}`
                    )}
                    style={({ pressed }) => [
                      styles.filterChip,
                      isSelected && styles.filterChipSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <AppText
                      weight={isSelected ? "bold" : "medium"}
                      style={[
                        styles.filterChipText,
                        text,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {t(`systemAlerts.filters.items.${filterKey}`)}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.sectionHeader}>
              <AppText weight="bold" style={[styles.sectionTitle, text]}>
                {t("systemAlerts.listTitle")}
              </AppText>
            </View>

            <View style={styles.listWrap}>
              {filteredAlerts.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={28}
                    color="#9CA3AF"
                  />
                  <AppText weight="bold" style={[styles.emptyTitle, text]}>
                    {t("systemAlerts.empty.title")}
                  </AppText>
                  <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                    {t("systemAlerts.empty.subtitle")}
                  </AppText>
                </View>
              ) : (
                filteredAlerts.map((alert) => {
                  const palette = ALERT_COLORS[alert.severity];

                  return (
                    <Pressable
                      key={alert.id}
                      accessibilityRole="button"
                      accessibilityLabel={t("systemAlerts.alertCardA11y", {
                        title: t(alert.titleKey),
                        time: t(alert.timeKey),
                      })}
                      onPress={() => {
                        // Server integration / navigation to alert details can be added here.
                      }}
                      style={({ pressed }) => [
                        styles.alertCard,
                        pressed && styles.pressed,
                        !alert.isUnread && styles.alertCardRead,
                      ]}
                    >
                      <View
                        style={[
                          styles.alertAccent,
                          { backgroundColor: palette.accent },
                        ]}
                      />

                      <View style={[styles.alertContentRow, row]}>
                        <View
                          style={[
                            styles.alertIconWrap,
                            { backgroundColor: palette.soft },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={alert.icon}
                            size={22}
                            color={palette.accent}
                          />
                        </View>

                        <View style={styles.alertTextWrap}>
                          <View style={[styles.alertHeaderRow, row]}>
                            <AppText
                              weight="bold"
                              style={[styles.alertTitle, text]}
                              numberOfLines={1}
                            >
                              {t(alert.titleKey)}
                            </AppText>

                            {alert.isUnread ? (
                              <View style={styles.unreadDot} />
                            ) : null}
                          </View>

                          <AppText
                            weight="medium"
                            style={[styles.alertDescription, text]}
                          >
                            {t(alert.descriptionKey)}
                          </AppText>

                          <View style={[styles.alertFooterRow, row]}>
                            <View style={styles.timeBadge}>
                              <MaterialCommunityIcons
                                name="clock-time-four-outline"
                                size={14}
                                color="#6B7280"
                              />
                              <AppText
                                weight="medium"
                                style={[styles.timeText, text]}
                              >
                                {t(alert.timeKey)}
                              </AppText>
                            </View>

                            <View
                              style={[
                                styles.severityBadge,
                                { backgroundColor: palette.soft },
                              ]}
                            >
                              <AppText
                                weight="bold"
                                style={[
                                  styles.severityText,
                                  text,
                                  { color: palette.accent },
                                ]}
                              >
                                {t(
                                  `systemAlerts.severityLabels.${alert.severity}`
                                )}
                              </AppText>
                            </View>
                          </View>
                        </View>

                        <MaterialCommunityIcons
                          name={isRTL ? "chevron-left" : "chevron-right"}
                          size={22}
                          color="#C0C6D4"
                        />
                      </View>
                    </Pressable>
                  );
                })
              )}
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}