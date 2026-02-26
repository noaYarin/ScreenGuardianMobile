import React from "react";
import { View, Pressable, I18nManager } from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

const ICON = {
  coin: "coins",
  clock: "clock-outline",
  movie: "movie-open-outline",
  icecream: "ice-cream",
  gift: "gift-outline",
} as const;

export default function StoreScreen() {
  const { t } = useTranslation();

  // ✅ חץ "חזור" שמתאים את עצמו ל-RTL/LTR כמו ב-Distress
  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  const rewards = [
    {
      id: 1,
      title: t("store.reward_time"),
      subtitle: t("store.reward_cost"),
      icon: ICON.clock,
      color: "#2F6BFF",
    },
    {
      id: 2,
      title: t("store.reward_movie"),
      subtitle: t("store.reward_cost"),
      icon: ICON.movie,
      color: "#7B3FF2",
    },
    {
      id: 3,
      title: t("store.reward_icecream"),
      subtitle: t("store.reward_cost"),
      icon: ICON.icecream,
      color: "#E91E63",
    },
    {
      id: 4,
      title: t("store.reward_small"),
      subtitle: t("store.reward_cost"),
      icon: ICON.gift,
      color: "#E53935",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: t("store.title"),

          // בדיוק כמו אצלך ב-Distress
          headerRight: () => (
            <HeaderIconButton
              name={backIconName}
              onPress={() => router.back()}
              accessibilityLabel={t("store.back_a11y")}
            />
          ),

          headerLeft: () => (
            <HeaderIconButton
              name="menu"
              onPress={() => {}}
              accessibilityLabel={t("store.menu_a11y")}
            />
          ),

          // (אופציונלי אבל מומלץ לשמור עקביות, אם זה מה שיש לך בשאר מסכים)
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          {/* Balance */}
          <View style={styles.balanceSection}>
            <AppText weight="bold" style={styles.balanceLabel}>
              {t("store.your_balance")}
            </AppText>

            <View style={styles.balanceCard}>
              <AppText weight="extraBold" style={styles.balanceAmount}>
                250
              </AppText>

              <FontAwesome5 name={ICON.coin} size={34} color="#ffffff" />
            </View>
          </View>

          {/* Rewards */}
          <View style={styles.rewardsContainer}>
            <AppText weight="bold" style={styles.sectionTitle}>
              {t("store.available_rewards")}
            </AppText>

            {rewards.map((item) => (
              <Pressable
                key={item.id}
                style={styles.rewardCard}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${t("store.reward_cost")}`}
              >
                {/* ✅ ימין: מחיר */}
                <View style={styles.priceBox}>
                  <AppText weight="extraBold" style={styles.rewardPrice}>
                    25
                  </AppText>
                  <AppText style={styles.rewardCoins}>{t("store.coins")}</AppText>
                </View>

                {/* ✅ שמאל: טקסט + אייקון */}
                <View style={styles.contentBox}>
                  <View style={styles.textBox}>
                    <AppText weight="bold" style={styles.rewardTitle}>
                      {item.title}
                    </AppText>
                    <AppText style={styles.rewardSub}>{item.subtitle}</AppText>
                  </View>

                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={item.color}
                    style={styles.icon}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}

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