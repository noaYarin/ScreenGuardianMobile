import React, { useMemo } from "react";
import { View, Pressable, useWindowDimensions, Platform } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";


import i18n, { changeLanguage } from "../../../locales/i18n";

const ICON = {
  target: "target",
  check: "check-circle-outline",
  circle: "checkbox-blank-circle-outline",
  spark: "star-four-points",
} as const;

type GoalItem = {
  key: string;
  titleKey: string;
  daysKey: string;
  done: boolean;
};

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
      <MaterialCommunityIcons name={name} size={22} color="#0F172A" />
    </Pressable>
  );
}

export default function GoalsScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const currentLanguage = (i18n?.resolvedLanguage ?? i18n?.language ?? "en") as string;
  const isRTL = currentLanguage.startsWith("he");


  const onChangeLanguage = async (lang: "he" | "en") => {
    try {
      await changeLanguage(lang);
    } catch {
      // silent
    }
  };

  const rowDir = useMemo(
    () => ({ flexDirection: isRTL ? "row-reverse" as const : "row" as const }),
    [isRTL]
  );
  const textAlign = useMemo(
    () => ({ textAlign: isRTL ? "right" as const : "left" as const }),
    [isRTL]
  );

  const progress = 50;

  const goals: GoalItem[] = [
    {
      key: "g1",
      titleKey: "goals.goal_less_than_2h",
      daysKey: "goals.days_5_7",
      done: true,
    },
    {
      key: "g2",
      titleKey: "goals.goal_no_screen_before_sleep",
      daysKey: "goals.days_6_7",
      done: true,
    },
    {
      key: "g3",
      titleKey: "goals.goal_learning_apps",
      daysKey: "goals.days_2_5",
      done: false,
    },
  ];

  const maxContentWidth = Math.min(820, Math.max(340, width - 32));
  const cardRadius = 22;

  return (
    <>
      <Stack.Screen
        options={{
          title: t("goals.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          //headerRight: () => (
       //     <HeaderIconButton
        //      name={ICON.spark}
        //      onPress={() => {

           //   }}
          //    accessibilityLabel={t("common.language") ?? "Language"}
        //    />
       //   ),
        }}
      />

      <ScreenLayout>
        <View style={styles.page}>
          <View style={[styles.inner, { maxWidth: maxContentWidth }]}>
            {/* Header Card */}
            <View style={[styles.headerCard, { borderRadius: cardRadius }]}>
              <View style={[styles.headerTop, rowDir]}>
                <View style={styles.headerIconWrap}>
                  <MaterialCommunityIcons name={ICON.target} size={22} color="#2F6DEB" />
                </View>

                <View style={styles.headerTextWrap}>
                  <AppText weight="extraBold" style={[styles.headerTitle, textAlign]}>
                    {t("goals.weekly_title")}
                  </AppText>
                  <AppText style={[styles.headerSubtitle, textAlign]}>
                    {t("goals.subtitle")}
                  </AppText>
                </View>
              </View>
            </View>

            {/* Progress Card */}
            <View style={[styles.progressCard, { borderRadius: cardRadius }]}>
              <View style={[styles.progressTopRow, rowDir]}>
                <AppText weight="bold" style={[styles.progressLabel, textAlign]}>
                  {t("goals.total_progress")}
                </AppText>

                <View style={[styles.progressBadge, rowDir]}>
                  <MaterialCommunityIcons name="star-circle" size={18} color="#2F6DEB" />
                  <AppText weight="extraBold" style={styles.progressPercent}>
                    {progress}%
                  </AppText>
                </View>
              </View>

              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    isRTL ? { right: 0, left: undefined } : { left: 0, right: undefined },
                    { width: `${progress}%` },
                  ]}
                />
              </View>

              <AppText style={[styles.progressHint, textAlign]}>
                {t("goals.subtitle")}
              </AppText>
            </View>

            {/* Goals List */}
            <View style={styles.list}>
              {goals.map((g) => {
                const isDone = g.done;
                return (
                  <View
                    key={g.key}
                    style={[
                      styles.goalCard,
                      { borderRadius: cardRadius },
                      !isDone && styles.goalCardDisabled,
                    ]}
                  >
                    <View style={[styles.goalRow, rowDir]}>
                      <View style={styles.goalTextWrap}>
                        <AppText
                          weight="extraBold"
                          style={[styles.goalTitle, textAlign, !isDone && styles.textMuted]}
                          numberOfLines={2}
                        >
                          {t(g.titleKey)}
                        </AppText>
                        <View style={[styles.daysRow, rowDir]}>
                          <View style={[styles.daysPill, !isDone && styles.daysPillDisabled]}>
                            <AppText style={styles.daysText}>{t(g.daysKey)}</AppText>
                          </View>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.statusIconWrap,
                          isDone ? styles.statusDone : styles.statusTodo,
                        ]}
                        accessibilityLabel={
                          isDone ? t("goals.completed_a11y") : t("goals.not_completed_a11y")
                        }
                      >
                        <MaterialCommunityIcons
                          name={isDone ? ICON.check : ICON.circle}
                          size={22}
                          color={isDone ? "#0F8A5F" : "#94A3B8"}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Bottom spacing (כדי שלא יהיה צפוף) */}
            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}