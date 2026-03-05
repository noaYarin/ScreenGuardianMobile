import React, { useMemo } from "react";
import { View } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type ChildCard = {
  id: string;
  name: string;
  usedText: string;
  limitText: string;
  status: "good" | "warn" | "bad";
};

const ICON = {
  user: "account-outline",
} as const;

export default function HomeParentScreen() {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";
  const rowDir = { flexDirection: isRTL ? ("row-reverse" as const) : ("row" as const) };
  const textAlign = { textAlign: isRTL ? ("right" as const) : ("left" as const) };

 
  const parentName = t("homeParent.parent_name_fallback");

  const children: ChildCard[] = useMemo(
    () => [
      { id: "noam", name: "נועם", usedText: "2:30", limitText: "4:00", status: "good" },
      { id: "tomer", name: "תומר", usedText: "4:00", limitText: "4:00", status: "bad" },
      { id: "yael", name: "יעל", usedText: "3:45", limitText: "4:00", status: "warn" },
    ],
    []
  );

  const onPressOverview = () => router.push("/Parent/reports" as Href);
  const onPressFullWatch = () => router.push("/Parent/kids" as Href);
  const onPressAddChild = () => router.push("/Parent/addChild" as Href);

  return (
    <>
      {/* Home screen: */}
      <Stack.Screen
        options={{
          title: t("homeParent.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* */}
            <AppText weight="extraBold" style={[styles.bigHello, textAlign]}>
              {t("homeParent.hello", { name: parentName })}
            </AppText>

            {/* */}
            <AppText
              onPress={onPressOverview}
              weight="bold"
              style={[styles.overviewLink, textAlign]}
              accessibilityRole="button"
              accessibilityLabel={t("homeParent.overview_a11y")}
            >
              {t("homeParent.overview")}
            </AppText>

            {/* */}
            <View style={styles.summaryCard}>
              <View style={[styles.summaryRow, rowDir]}>
                <View style={styles.summaryChip}>
                  <AppText weight="extraBold" style={styles.summaryChipText}>
                    {children.length}
                  </AppText>
                </View>
                <View style={styles.summaryTextWrap}>
                  <AppText weight="bold" style={[styles.sectionTitle, textAlign]}>
                    {t("homeParent.my_kids")}
                  </AppText>
                  <AppText style={[styles.sectionSub, textAlign]}>
                    {t("homeParent.day_screen_time")}
                  </AppText>
                </View>
              </View>
            </View>

            {/* */}
            <View style={styles.cardsWrap}>
              {children.map((c) => (
                <View key={c.id} style={styles.card} accessibilityRole="summary">
                  <View style={[styles.cardInner, rowDir]}>
                    {/* avatar */}
                    <View
                      style={[
                        styles.avatarCircle,
                        c.status === "good" && styles.avatarGood,
                        c.status === "warn" && styles.avatarWarn,
                        c.status === "bad" && styles.avatarBad,
                      ]}
                    >
                      <MaterialCommunityIcons name={ICON.user} size={22} color="#0F172A" />
                    </View>

                    {/* name*/}
                    <View style={styles.cardCenter}>
                      <AppText weight="extraBold" style={[styles.childName, textAlign]} numberOfLines={1}>
                        {c.name}
                      </AppText>
                      <AppText style={[styles.childSubtitle, textAlign]} numberOfLines={1}>
                        {t("homeParent.day_screen_time")}
                      </AppText>
                    </View>

                    {/* time */}
                    <View style={styles.cardLeft}>
                      <AppText
                        weight="extraBold"
                        style={[
                          styles.timeMain,
                          c.status === "good" && styles.timeGood,
                          c.status === "warn" && styles.timeWarn,
                          c.status === "bad" && styles.timeBad,
                        ]}
                      >
                        {c.usedText}
                      </AppText>
                      <AppText style={styles.timeSub}>
                        {t("homeParent.out_of", { limit: c.limitText })}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* buttons */}
            <View style={styles.actionsWrap}>
              <View style={styles.btnPrimary} accessibilityRole="button" accessibilityLabel={t("homeParent.full_watch_a11y")}>
                <AppText onPress={onPressFullWatch} weight="extraBold" style={styles.btnPrimaryText}>
                  {t("homeParent.full_watch")}
                </AppText>
              </View>

              <View
                style={styles.btnSecondary}
                accessibilityRole="button"
                accessibilityLabel={t("homeParent.add_child_a11y")}
              >
                <AppText onPress={onPressAddChild} weight="extraBold" style={styles.btnSecondaryText}>
                  {t("homeParent.add_child")}
                </AppText>
              </View>
            </View>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}