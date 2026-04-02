import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, ALERT_COLORS } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import type { Notification } from "@/src/api/notification";
import {
  fetchParentNotificationsThunk,
  markParentNotificationReadThunk,
} from "@/src/redux/thunks/notificationThunks";

type AlertFilter = "all" | "unread" | "critical";

type AlertSeverity = "critical" | "warning" | "info" | "success";

function toAlertSeverity(severity: string): AlertSeverity {
  const s = String(severity || "").toUpperCase();
  if (s === "CRITICAL" || s === "ERROR") return "critical";
  if (s === "WARNING") return "warning";
  if (s === "SUCCESS") return "success";
  return "info";
}

function pickIcon(
  type: string,
  severity: string
): React.ComponentProps<typeof MaterialCommunityIcons>["name"] {
  const t = String(type || "").toUpperCase();
  switch (t) {
    case "CHILD_LOGGED_IN":
      return "account-check-outline";
    case "CHILD_ADDED":
      return "account-plus-outline";
    case "CHILD_PROFILE_UPDATED":
      return "account-edit-outline";
    case "CHILD_DISCONNECTED":
      return "account-off-outline";
    case "CHILD_LOCATION_UPDATED":
      return "map-marker-check-outline";
    case "EXTENSION_REQUEST_CREATED":
      return "clock-plus-outline";
    case "EXTENSION_REQUEST_APPROVED":
      return "check-decagram-outline";
    case "EXTENSION_REQUEST_REJECTED":
      return "close-octagon-outline";
    case "DEVICE_LOCKED":
      return "lock-outline";
    case "DEVICE_UNLOCKED":
      return "lock-open-outline";
    case "SCREEN_TIME_UPDATED":
      return "clock-edit-outline";
    case "SCREEN_TIME_ENDING":
      return "clock-alert-outline";
    case "SCREEN_TIME_ENDED":
      return "clock-remove-outline";
    default:
      return toAlertSeverity(severity) === "critical"
        ? "shield-alert-outline"
        : "bell-outline";
  }
}

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

const FILTERS: AlertFilter[] = ["all", "unread", "critical"];

export default function SystemAlertsScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.notifications?.items ?? []
  );

  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>("all");

  useEffect(() => {
    dispatch(fetchParentNotificationsThunk());
  }, [dispatch]);

  const filteredAlerts = useMemo(() => {
    switch (selectedFilter) {
      case "unread":
        return notifications.filter((n: Notification) => !n.isRead);
      case "critical":
        return notifications.filter(
          (n: Notification) => toAlertSeverity(n.severity) === "critical"
        );
      case "all":
      default:
        return notifications;
    }
  }, [selectedFilter, notifications]);

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
  const criticalCount = notifications.filter(
    (n: Notification) => toAlertSeverity(n.severity) === "critical"
  ).length;
  const totalCount = notifications.length;

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
                filteredAlerts.map((alert: Notification) => {
                  const severity: AlertSeverity = toAlertSeverity(alert.severity);
                  const palette = ALERT_COLORS[severity];
                  const isUnread = !alert.isRead;
                  const title = alert.title ?? "";
                  const createdAtText = formatCreatedAt(alert.createdAt);

                  return (
                    <Pressable
                      key={alert._id}
                      accessibilityRole="button"
                      accessibilityLabel={t("systemAlerts.alertCardA11y", { title, time: createdAtText })}
                      onPress={() => {
                        const id = alert._id;
                        if (id && !alert.isRead) {
                          dispatch(
                            markParentNotificationReadThunk({
                              notificationId: String(id),
                            })
                          );
                        }
                      }}
                      style={({ pressed }) => [
                        styles.alertCard,
                        pressed && styles.pressed,
                        !isUnread && styles.alertCardRead,
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
                            name={pickIcon(alert.type, alert.severity)}
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
                              {title}
                            </AppText>

                            {isUnread ? (
                              <View style={styles.unreadDot} />
                            ) : null}
                          </View>

                          <AppText
                            weight="medium"
                            style={[styles.alertDescription, text]}
                          >
                            {alert.description ?? ""}
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
                                {createdAtText || t("systemAlerts.time.justNow")}
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
                                  `systemAlerts.severityLabels.${severity}`
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