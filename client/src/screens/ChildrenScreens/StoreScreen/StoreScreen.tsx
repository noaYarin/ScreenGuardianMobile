import React from "react";
import { View, Pressable } from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const ICON = {
  coin: "coins",
  clock: "clock-outline",
  movie: "movie-open-outline",
  icecream: "ice-cream",
  gift: "gift-outline",
  back: "chevron-right",
} as const;

export default function StoreScreen() {
  const { t } = useTranslation();

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
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ חץ בצד ימין (RTL) בלי Header מותאם אישית
          headerRight: () => (
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t("store.back_a11y")}
              style={{ paddingHorizontal: 8, paddingVertical: 6 }}
            >
              <MaterialCommunityIcons name={ICON.back} size={28} color="#fff" />
            </Pressable>
          ),
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

              <FontAwesome5
                name={ICON.coin}
                size={34}
                color="#ffffff"
              />
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

                {/* ✅ שמאל: טקסט (מימין לשמאל) + אייקון בשמאל */}
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