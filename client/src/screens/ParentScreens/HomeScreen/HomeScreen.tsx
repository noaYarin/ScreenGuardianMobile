import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

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
  const { t } = useTranslation();
  const { row, text } = useLocaleLayout();

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
      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Greeting */}
            <AppText weight="extraBold" style={[styles.bigHello, text]}>
              {t("homeParent.hello", { name: parentName })}
            </AppText>

            {/* Overview link */}
            <AppText
              onPress={onPressOverview}
              weight="bold"
              style={[styles.overviewLink, text]}
              accessibilityRole="button"
              accessibilityLabel={t("homeParent.overview_a11y")}
            >
              {t("homeParent.overview")}
            </AppText>

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <View style={[styles.summaryRow, row]}>
                <View style={styles.summaryChip}>
                  <AppText weight="extraBold" style={styles.summaryChipText}>
                    {children.length}
                  </AppText>
                </View>

                <View style={styles.summaryTextWrap}>
                  <AppText weight="bold" style={[styles.sectionTitle, text]}>
                    {t("homeParent.my_kids")}
                  </AppText>
                  <AppText style={[styles.sectionSub, text]}>
                    {t("homeParent.day_screen_time")}
                  </AppText>
                </View>
              </View>
            </View>

            {/* Children cards */}
            <View style={styles.cardsWrap}>
              {children.map((c) => (
                <View key={c.id} style={styles.card} accessibilityRole="summary">
                  <View style={[styles.cardInner, row]}>
                    {/* Avatar */}
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

                    {/* Child info */}
                    <View style={styles.cardCenter}>
                      <AppText
                        weight="extraBold"
                        style={[styles.childName, text]}
                        numberOfLines={1}
                      >
                        {c.name}
                      </AppText>
                      <AppText
                        style={[styles.childSubtitle, text]}
                        numberOfLines={1}
                      >
                        {t("homeParent.day_screen_time")}
                      </AppText>
                    </View>

                    {/* Time info */}
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

            {/* Action buttons */}
            <View style={styles.actionsWrap}>
              <Pressable
                style={styles.btnPrimary}
                onPress={onPressFullWatch}
                accessibilityRole="button"
                accessibilityLabel={t("homeParent.full_watch_a11y")}
              >
                <AppText weight="extraBold" style={styles.btnPrimaryText}>
                  {t("homeParent.full_watch")}
                </AppText>
              </Pressable>

              <Pressable
                style={styles.btnSecondary}
                onPress={onPressAddChild}
                accessibilityRole="button"
                accessibilityLabel={t("homeParent.add_child_a11y")}
              >
                <AppText weight="extraBold" style={styles.btnSecondaryText}>
                  {t("homeParent.add_child")}
                </AppText>
              </Pressable>
            </View>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}