import React, { useMemo, useState } from "react";
import { View, Pressable } from "react-native";
import { Stack, router, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type ChildCard = {
  id: string;
  name: string;
  usedText: string; // "2:30"
  limitText: string; // "4:00"
  colorKey: "good" | "warn" | "bad";
};

const ICON = {
  user: "account-outline",
  chevron: "chevron-left", // RTL: זה נראה כמו חץ שמאלה; אם תרצי אפשר להחליף ל-"chevron-right"
} as const;

export default function homeParentScreen() {
  const { t } = useTranslation();

  // 🔁 בהמשך תחברי ל-Redux/שרת
  const parentName = t("homeParent.parent_name_fallback"); // "אמא"
  const [selectedId, setSelectedId] = useState<string>("noam");

  const children: ChildCard[] = useMemo(
    () => [
      { id: "noam", name: "נועם", usedText: "2:30", limitText: "4:00", colorKey: "good" },
      { id: "tomer", name: "תומר", usedText: "4:00", limitText: "4:00", colorKey: "bad" },
      { id: "yael", name: "יעל", usedText: "3:45", limitText: "4:00", colorKey: "warn" },
    ],
    []
  );

  const onPressOverview = () => {
    // אם יש לך מסך דוחות/סטטיסטיקות לילד – תשני לנתיב שלך
    router.push("/Child/reports" as Href);
  };

  const onPressFullWatch = () => {
    // מסך צפייה מלאה / רשימת ילדים
    router.push("/Child/kids" as Href);
  };

  const onPressAddChild = () => {
    // מסך הוספת ילד / צימוד
    router.push("/Child/addChild" as Href);
  };

  return (
    <>
      {/* ✅ חריג homeParent: בלי חץ חזור בכלל */}
      <Stack.Screen
        options={{
          title: t("homeParent.title"), // "ברוכים הבאים"
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          {/* כותרת גדולה */}
          <AppText weight="extraBold" style={styles.bigHello}>
            {t("homeParent.hello", { name: parentName })}
          </AppText>

          {/* לינק סקירה כללית */}
          <Pressable
            onPress={onPressOverview}
            style={styles.overviewLinkWrap}
            accessibilityRole="button"
            accessibilityLabel={t("homeParent.overview_a11y")}
          >
            <AppText weight="bold" style={styles.overviewLink}>
              {t("homeParent.overview")}
            </AppText>
          </Pressable>

          {/* כותרת "הילדים שלי" */}
          <View style={styles.sectionHeader}>
            <AppText weight="bold" style={styles.sectionTitle}>
              {t("homeParent.my_kids")}
            </AppText>
          </View>

          {/* כרטיסי ילדים */}
          <View style={styles.cardsWrap}>
            {children.map((c) => {
              const isSelected = selectedId === c.id;

              return (
                <Pressable
                  key={c.id}
                  onPress={() => setSelectedId(c.id)}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.child_card_a11y", { name: c.name })}
                >
                  {/* שמאל: זמן */}
                  <View style={styles.cardLeft}>
                    <AppText
                      weight="extraBold"
                      style={[
                        styles.timeMain,
                        c.colorKey === "good" && styles.timeGood,
                        c.colorKey === "warn" && styles.timeWarn,
                        c.colorKey === "bad" && styles.timeBad,
                      ]}
                    >
                      {c.usedText}
                    </AppText>
                    <AppText style={styles.timeSub}>
                      {t("homeParent.out_of", { limit: c.limitText })}
                    </AppText>
                  </View>

                  {/* אמצע: שם + תיאור */}
                  <View style={styles.cardCenter}>
                    <AppText weight="extraBold" style={styles.childName} numberOfLines={1}>
                      {c.name}
                    </AppText>
                    <AppText style={styles.childSubtitle} numberOfLines={1}>
                      {t("homeParent.day_screen_time")}
                    </AppText>
                  </View>

                  {/* ימין: אווטאר */}
                  <View style={styles.cardRight}>
                    <View
                      style={[
                        styles.avatarCircle,
                        c.colorKey === "good" && styles.avatarGood,
                        c.colorKey === "warn" && styles.avatarWarn,
                        c.colorKey === "bad" && styles.avatarBad,
                      ]}
                    >
                      <MaterialCommunityIcons name={ICON.user} size={26} color="#1B1B1B" />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* כפתורים תחתונים */}
          <View style={styles.actionsWrap}>
            <Pressable
              onPress={onPressFullWatch}
              style={styles.primaryBtn}
              accessibilityRole="button"
              accessibilityLabel={t("homeParent.full_watch_a11y")}
            >
              <AppText weight="extraBold" style={styles.primaryBtnText}>
                {t("homeParent.full_watch")}
              </AppText>
            </Pressable>

            <Pressable
              onPress={onPressAddChild}
              style={styles.secondaryBtn}
              accessibilityRole="button"
              accessibilityLabel={t("homeParent.add_child_a11y")}
            >
              <AppText weight="extraBold" style={styles.secondaryBtnText}>
                {t("homeParent.add_child")}
              </AppText>
            </Pressable>
          </View>

          {/* רווח כדי שלא “יידבק” לטאב-בר */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScreenLayout>
    </>
  );
}