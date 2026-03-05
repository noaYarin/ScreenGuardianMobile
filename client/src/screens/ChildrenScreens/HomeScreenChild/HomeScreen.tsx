// client/src/screens/ChildrenScreens/HomeScreen/HomeScreen.tsx
import React from "react";
import {
  View,
  Pressable,
  useWindowDimensions,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { router, Stack, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles, TILE_COLORS } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import type { SupportedLanguage } from "../../../locales/i18n";

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
  reports: "information-box",
  bulb: "lightbulb-on-outline",
  help: "help-circle-outline",
  panic: "alert-circle-outline",
} as const;

export default function HomeScreen() {
  const { t, isRTL, currentLanguage, changeLanguage } = useTranslation();
  const { width } = useWindowDimensions();

  const rowDir: ViewStyle = { flexDirection: isRTL ? "row-reverse" : "row" };
  const textAlignStyle: TextStyle = { textAlign: isRTL ? "right" : "left" };

  const isPhone = width < 430;
  const isTablet = width >= 430 && width < 900;

  const avatarSize = isPhone ? 92 : isTablet ? 108 : 118;
  const helloSize = isPhone ? 22 : isTablet ? 26 : 28;
  const timerSize = isPhone ? 34 : isTablet ? 40 : 44;

  const userName = "נועה";
  const pointsValue = "1,250";
  const levelValue = 4;
  const coinsValue = 38;

  const onToggleLanguage = async () => {
    const next: SupportedLanguage = currentLanguage === "he" ? "en" : "he";
    await changeLanguage(next);
  };

  const leftIcon = isRTL ? ICON.accessibility : ICON.settings;
  const rightIcon = isRTL ? ICON.settings : ICON.accessibility;

  const leftA11y = isRTL ? t("home.accessibility") : t("home.settings");
  const rightA11y = isRTL ? t("home.settings") : t("home.accessibility");

  return (
    <>
      <Stack.Screen
        options={{
          title: t("home.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />

      <ScreenLayout>
        <View style={styles.page}>
          {/* Top bar: 3 fixed columns so the middle button stays perfectly centered */}
          <View style={styles.topRow}>
            <View style={[styles.topCol, { alignItems: "flex-start" }]}>
              <RoundIconButton
                name={leftIcon}
                onPress={() => {}}
                accessibilityLabel={leftA11y}
              />
            </View>

            <View style={styles.topColCenter}>
              <RoundIconButton
                name={ICON.language}
                onPress={onToggleLanguage}
                accessibilityLabel={t("common.change_language", "Change language")}
              />
            </View>

            <View style={[styles.topCol, { alignItems: "flex-end" }]}>
              <RoundIconButton
                name={rightIcon}
                onPress={() => {}}
                accessibilityLabel={rightA11y}
              />
            </View>
          </View>

          {/* Header card */}
          <View style={styles.headerCard}>
            <View style={[styles.headerRow, rowDir]}>
              <View style={[styles.avatarWrap, { width: avatarSize, height: avatarSize }]}>
                <LinearGradient
                  colors={["#3B82F6", "#BDE0FE"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.avatarGradient}
                >
                  <AppText weight="extraBold" style={styles.avatarLetter}>
                    נ
                  </AppText>
                </LinearGradient>
              </View>

              <View style={styles.helloBlock}>
                <AppText
                  weight="extraBold"
                  style={[styles.hello, { fontSize: helloSize }, textAlignStyle]}
                  numberOfLines={1}
                >
                  {t("home.hello_user", { name: userName })}
                </AppText>
              </View>
            </View>

            {/* Stats row: equal width pills with safe spacing */}
            <View style={[styles.statsRow, rowDir]}>
              <StatPill
                icon={ICON.points}
                text={t("home.points", { value: pointsValue })}
                variant="blue"
                isRTL={isRTL}
              />
              <StatPill
                icon={ICON.level}
                text={t("home.level", { level: levelValue })}
                variant="beige"
                isRTL={isRTL}
              />
              <StatPill
                icon={ICON.coins}
                text={t("home.coins", { value: coinsValue })}
                variant="primary"
                isRTL={isRTL}
              />
            </View>
          </View>

          {/* Time card */}
          <View style={styles.card}>
            <View style={[styles.cardTitleRow, rowDir]}>
              <View style={[styles.cardTitleLeft, rowDir]}>
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name={ICON.time} size={18} color="#0F172A" />
                </View>

                <AppText weight="extraBold" style={[styles.cardTitle, textAlignStyle]}>
                  {t("home.time_left_title")}
                </AppText>
              </View>
            </View>

            <AppText weight="extraBold" style={[styles.timerValue, { fontSize: timerSize }]}>
              00:12:45
            </AppText>

            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: "72%" }]} />
            </View>

            <AppText weight="bold" style={styles.timerSub}>
              {t("home.time_left_warning")}
            </AppText>
          </View>

          {/* Tiles grid: capped tile size so iPad doesn't blow up */}
          <View style={styles.grid}>
            <Tile iconName={ICON.apps} label={t("home.tile_apps")} onPress={() => {}} colorKey="apps" />
            <Tile
              iconName={ICON.extend}
              label={t("home.tile_extend")}
              onPress={() => router.push("/Child/extendTime" as Href)}
              colorKey="extend"
            />
            <Tile
              iconName={ICON.shop}
              label={t("home.tile_shop")}
              onPress={() => router.push("/Child/store" as Href)}
              colorKey="shop"
            />
            <Tile
              iconName={ICON.tasks}
              label={t("home.tile_tasks")}
              onPress={() => router.push("/Child/tasks" as Href)}
              colorKey="tasks"
            />
            <Tile
              iconName={ICON.achievements}
              label={t("home.tile_achievements")}
              onPress={() => {}}
              colorKey="achievements"
            />
            <Tile
              iconName={ICON.goals}
              label={t("home.tile_goals")}
              onPress={() => router.push("/Child/goals" as Href)}
              colorKey="goals"
            />
            <Tile
              iconName={ICON.reports}
              label={t("home.tile_reports")}
              onPress={() => {}}
              colorKey="help"
            />
            <Tile iconName={ICON.bulb} label={t("home.tile_ideas")} onPress={() => {}} colorKey="ideas" />
            <Tile iconName={ICON.help} label={t("home.tile_help")} onPress={() => {}} colorKey="help" />
          </View>

          {/* Panic button */}
          <Pressable
            style={({ pressed }) => [styles.panicBtn, pressed && styles.panicPressed, rowDir]}
            onPress={() => router.push("/Child/distress" as Href)}
            accessibilityRole="button"
            accessibilityLabel={t("home.panic_a11y")}
          >
            <View style={styles.panicIconBadge}>
              <MaterialCommunityIcons name={ICON.panic} size={18} color="#fff" />
            </View>

            <AppText weight="extraBold" style={styles.panicText}>
              {t("home.panic")}
            </AppText>
          </Pressable>
        </View>
      </ScreenLayout>
    </>
  );
}

function RoundIconButton({
  name,
  size = 22,
  onPress,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  onPress?: () => void | Promise<void>;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      onPress={() => void onPress?.()}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.circleBtn, pressed && styles.circleBtnPressed]}
    >
      <MaterialCommunityIcons name={name} size={size} color="#0F172A" />
    </Pressable>
  );
}

function StatPill({
  icon,
  text,
  variant,
  isRTL,
}: {
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  text: string;
  variant: "blue" | "beige" | "primary";
  isRTL: boolean;
}) {
  const pillStyle =
    variant === "blue"
      ? styles.statPillBlue
      : variant === "beige"
      ? styles.statPillBeige
      : styles.statPillPrimary;

  return (
    <View style={[styles.statPill, pillStyle, { flexDirection: isRTL ? "row-reverse" : "row" }]}>
      <MaterialCommunityIcons name={icon} size={18} color="#0F172A" />
      <AppText weight="extraBold" style={styles.statText} numberOfLines={1}>
        {text}
      </AppText>
    </View>
  );
}

function Tile({
  iconName,
  label,
  onPress,
  colorKey,
}: {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  label: string;
  onPress?: () => void;
  colorKey: keyof typeof TILE_COLORS;
}) {
  const c = TILE_COLORS[colorKey];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: c.bg, borderColor: c.border },
        pressed && styles.tilePressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.tileInner}>
        <View style={styles.tileIconZone}>
          <View style={[styles.tileIconWrap, { backgroundColor: c.badge }]}>
            <MaterialCommunityIcons name={iconName} size={26} color={c.icon} />
          </View>
        </View>

        <View style={styles.tileLabelZone}>
          <AppText weight="bold" style={styles.tileText} numberOfLines={2}>
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}