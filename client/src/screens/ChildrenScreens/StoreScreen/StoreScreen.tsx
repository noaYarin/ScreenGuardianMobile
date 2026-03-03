import React from "react";
import { View, Pressable } from "react-native";
import { Stack } from "expo-router";
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

export default function StoreScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");

  const rewards = [
    { id: 1, title: t("store.reward_time"), subtitle: t("store.reward_cost"), icon: ICON.clock, color: "#2F6BFF" },
    { id: 2, title: t("store.reward_movie"), subtitle: t("store.reward_cost"), icon: ICON.movie, color: "#7B3FF2" },
    { id: 3, title: t("store.reward_icecream"), subtitle: t("store.reward_cost"), icon: ICON.icecream, color: "#E91E63" },
    { id: 4, title: t("store.reward_small"), subtitle: t("store.reward_cost"), icon: ICON.gift, color: "#E53935" },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: t("store.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ אין Back כאן בכלל — מגיע מה־RootLayout

         
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
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
                <View style={styles.priceBox}>
                  <AppText weight="extraBold" style={styles.rewardPrice}>
                    25
                  </AppText>
                  <AppText style={styles.rewardCoins}>{t("store.coins")}</AppText>
                </View>

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