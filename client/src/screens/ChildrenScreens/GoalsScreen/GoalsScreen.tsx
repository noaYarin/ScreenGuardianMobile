import React from "react";
import { View, I18nManager, Pressable } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

const ICON = {
  target: "target",
  check: "check-circle-outline",
  circle: "checkbox-blank-circle-outline",
} as const;

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
      style={({ pressed }) => [{ padding: 8, opacity: pressed ? 0.65 : 1 }]}
    >
      <MaterialCommunityIcons name={name} size={22} color="#000" />
    </Pressable>
  );
}

export default function GoalsScreen() {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");
  const progress = 50;

  return (
    <>
      <Stack.Screen
        options={{
          title: t("goals.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ Back מגיע מה־RootLayout

         
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.header}>
            <MaterialCommunityIcons name={ICON.target} size={26} color="#8B5E3C" />
            <AppText weight="extraBold" style={styles.headerTitle}>
              {t("goals.weekly_title")}
            </AppText>
            <AppText style={styles.headerSubtitle}>{t("goals.subtitle")}</AppText>
          </View>

          <View style={styles.progressCard}>
            <View style={[styles.progressTopRow, isRTL && styles.rowReverse]}>
              <AppText weight="bold" style={styles.progressLabel}>
                {t("goals.total_progress")}
              </AppText>
              <AppText weight="bold" style={styles.progressPercent}>
                {progress}%
              </AppText>
            </View>

            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={[styles.goalRow, isRTL && styles.rowReverse]}>
              <View style={styles.goalTextWrap}>
                <AppText weight="bold" style={styles.goalText}>
                  {t("goals.goal_less_than_2h")}
                </AppText>
                <AppText style={styles.goalDays}>{t("goals.days_5_7")}</AppText>
              </View>

              <MaterialCommunityIcons
                name={ICON.check}
                size={28}
                color="#8B5E3C"
                accessibilityLabel={t("goals.completed_a11y")}
              />
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={[styles.goalRow, isRTL && styles.rowReverse]}>
              <View style={styles.goalTextWrap}>
                <AppText weight="bold" style={styles.goalText}>
                  {t("goals.goal_no_screen_before_sleep")}
                </AppText>
                <AppText style={styles.goalDays}>{t("goals.days_6_7")}</AppText>
              </View>

              <MaterialCommunityIcons
                name={ICON.check}
                size={28}
                color="#8B5E3C"
                accessibilityLabel={t("goals.completed_a11y")}
              />
            </View>
          </View>

          <View style={[styles.goalCard, styles.disabledCard]}>
            <View style={[styles.goalRow, isRTL && styles.rowReverse]}>
              <View style={styles.goalTextWrap}>
                <AppText weight="bold" style={styles.goalText}>
                  {t("goals.goal_learning_apps")}
                </AppText>
                <AppText style={styles.goalDays}>{t("goals.days_2_5")}</AppText>
              </View>

              <MaterialCommunityIcons
                name={ICON.circle}
                size={28}
                color="#BFC4C9"
                accessibilityLabel={t("goals.not_completed_a11y")}
              />
            </View>
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}