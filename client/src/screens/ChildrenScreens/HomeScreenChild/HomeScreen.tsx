import React from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { router, Stack, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import i18n, { changeLanguage } from "../../../locales/i18n";

const ICON = {
  accessibility: "human-wheelchair",
  language: "translate",
  settings: "cog",
  points: "star-circle",
  level: "shield-star",
  coins: "cash",
  time: "clock-outline",
  apps: "apps",
  extend: "clock-plus-outline",
  shop: "shopping-outline",
  tasks: "clipboard-check-outline",
  achievements: "trophy",
  goals: "target",
  heart: "heart-outline",
  bulb: "lightbulb-on-outline",
  help: "help-circle-outline",
  panic: "alert-circle-outline",
} as const;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  // ✅ נקודות שבירה פשוטות
  const isPhone = width < 430;
  const isTablet = width >= 430 && width < 900;

  // ✅ גדלים רספונסיביים
  const avatarSize = isPhone ? 120 : isTablet ? 140 : 150;
  const helloSize = isPhone ? 26 : isTablet ? 32 : 36;
  const timerSize = isPhone ? 44 : isTablet ? 52 : 56;

  const userName = "נועה";
  const pointsValue = "1,250";
  const levelValue = 4;
  const coinsValue = 38;

  const isRTL =
    (typeof i18n.dir === "function" ? i18n.dir(i18n.language) : "rtl") === "rtl" ||
    i18n.language === "he";

  const onToggleLanguage = () => {
    const next = i18n.language === "he" ? "en" : "he";
    changeLanguage(next);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("home.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ אין חץ חזור בכלל במסך הזה
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />

      <ScreenLayout>
        <View style={styles.home}>
          <View style={styles.topRow}>
            <RoundIconButton
              name={ICON.accessibility}
              size={26}
              onPress={() => {}}
              accessibilityLabel={t("home.accessibility")}
            />

            <RoundIconButton
              name={ICON.language}
              size={26}
              onPress={onToggleLanguage}
              accessibilityLabel={t("common.change_language", "Change language")}
            />

            <RoundIconButton
              name={ICON.settings}
              size={26}
              onPress={() => {}}
              accessibilityLabel={t("home.settings")}
            />
          </View>

          <LinearGradient
            colors={["#ff7ac8", "#c084fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
          >
            <AppText
              weight="extraBold"
              style={[
                styles.avatarLetter,
                {
                  fontSize: avatarSize * 0.42,
                  lineHeight: avatarSize * 0.42,
                },
              ]}
            >
              נ
            </AppText>
          </LinearGradient>

          <AppText weight="bold" style={[styles.hello, { fontSize: helloSize }]}>
            {t("home.hello_user", { name: userName })}
          </AppText>

          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipBlue]}>
              <MaterialCommunityIcons name={ICON.points} size={22} color="#000" />
              <AppText weight="extraBold" style={styles.chipText}>
                {t("home.points", { value: pointsValue })}
              </AppText>
            </View>

            <View style={[styles.chip, styles.chipGold]}>
              <AppText weight="extraBold" style={styles.chipText}>
                {t("home.level", { level: levelValue })}
              </AppText>
              <MaterialCommunityIcons name={ICON.level} size={22} color="#000" />
            </View>
          </View>

          <View style={[styles.chip, styles.chipMint]}>
            <AppText weight="extraBold" style={styles.chipText}>
              {t("home.coins", { value: coinsValue })}
            </AppText>
            <MaterialCommunityIcons name={ICON.coins} size={20} color="#000" />
          </View>

          <LinearGradient
            colors={["#fde2f3", "#dbeafe"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.timer}
          >
            <View style={styles.timerTitle}>
              <MaterialCommunityIcons name={ICON.time} size={24} color="#000" />
              <AppText weight="bold" style={styles.timerTitleText}>
                {t("home.time_left_title")}
              </AppText>
            </View>

            <AppText weight="extraBold" style={[styles.timerValue, { fontSize: timerSize }]}>
              00:12:45
            </AppText>

            <AppText weight="bold" style={styles.timerSub}>
              {t("home.time_left_warning")}
            </AppText>
          </LinearGradient>

          {/* ✅ 3x3 קבוע */}
          <View style={styles.grid}>
            <Tile iconName={ICON.apps} label={t("home.tile_apps")} onPress={() => {}} />
            <Tile
              iconName={ICON.extend}
              label={t("home.tile_extend")}
              onPress={() => router.push("/Child/extendTime" as Href)}
            />
            <Tile
              iconName={ICON.shop}
              label={t("home.tile_shop")}
              onPress={() => router.push("/Child/store" as Href)}
            />
            <Tile
              iconName={ICON.tasks}
              label={t("home.tile_tasks")}
              onPress={() => router.push("/Child/tasks" as Href)}
            />
            <Tile
              iconName={ICON.achievements}
              label={t("home.tile_achievements")}
              onPress={() => {}}
            />
            <Tile
              iconName={ICON.goals}
              label={t("home.tile_goals")}
              onPress={() => router.push("/Child/goals" as Href)}
            />
            <Tile iconName={ICON.heart} label={t("home.tile_encouragement")} onPress={() => {}} />
            <Tile iconName={ICON.bulb} label={t("home.tile_ideas")} onPress={() => {}} />
            <Tile iconName={ICON.help} label={t("home.tile_help")} onPress={() => {}} />
          </View>

          <Pressable
            style={({ pressed }) => [styles.panicBtn, pressed && styles.panicPressed]}
            onPress={() => router.push("/Child/distress" as Href)}
            accessibilityRole="button"
            accessibilityLabel={t("home.panic_a11y")}
          >
            <MaterialCommunityIcons name={ICON.panic} size={22} color="#000" />
            <AppText weight="extraBold" style={styles.panicText}>
              {t("home.panic")}
            </AppText>
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}

type RoundIconButtonProps = {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

function RoundIconButton({ name, size = 22, onPress, accessibilityLabel }: RoundIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.circleBtn, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons name={name} size={size} color="#000" />
    </Pressable>
  );
}

type TileProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress?: () => void;
};

function Tile({ iconName, label, onPress }: TileProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.tileIcon}>
        <MaterialCommunityIcons name={iconName} size={26} color="#000" />
      </View>
      <AppText weight="bold" style={styles.tileText} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}