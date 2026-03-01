import React, { useState } from "react";
import { View, Pressable, ScrollView, I18nManager } from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

const ICON = {
  coin: "cash-multiple",
  check: "check",
  camera: "camera-outline",
} as const;

type Task = {
  id: string;
  title: string;
  coins: number;
  done: boolean;
};

export default function TasksScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"done" | "todo">("done");

  // ✅ חץ "חזור" שמתאים את עצמו ל-RTL/LTR כמו ב-Distress
  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  const tasks: Task[] = [
    { id: "1", title: t("tasks.clean_room"), coins: 15, done: true },
    { id: "2", title: t("tasks.read_book"), coins: 10, done: true },
    { id: "3", title: t("tasks.tidy_room"), coins: 10, done: false },
    { id: "4", title: t("tasks.walk_dog"), coins: 8, done: false },
    { id: "5", title: t("tasks.help_table"), coins: 12, done: false },
  ];

  const filteredTasks =
    activeTab === "done"
      ? tasks.filter((t) => t.done)
      : tasks.filter((t) => !t.done);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("tasks.title"),

          headerRight: () => (
            <HeaderIconButton
              name={backIconName}
              onPress={() => router.back()}
              accessibilityLabel={t("tasks.back_a11y")}
            />
          ),

          headerLeft: () => (
            <HeaderIconButton
              name="menu"
              onPress={() => {}}
              accessibilityLabel={t("tasks.menu_a11y")}
            />
          ),

          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          {/* Tabs */}
          <View style={styles.tabsWrapper}>
            <Pressable
              style={[styles.tabBtn, activeTab === "todo" && styles.activeTab]}
              onPress={() => setActiveTab("todo")}
              accessibilityRole="button"
              accessibilityLabel={t("tasks.todo_a11y")}
            >
              <AppText weight="bold">{t("tasks.todo")}</AppText>
            </Pressable>

            <Pressable
              style={[styles.tabBtn, activeTab === "done" && styles.activeTab]}
              onPress={() => setActiveTab("done")}
              accessibilityRole="button"
              accessibilityLabel={t("tasks.done_a11y")}
            >
              <AppText weight="bold">{t("tasks.done")}</AppText>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredTasks.map((task) => (
              <View key={task.id} style={styles.card}>
                <View style={styles.coinsBadge}>
                  <MaterialCommunityIcons name={ICON.coin} size={18} color="#C18400" />
                  <AppText weight="bold" style={styles.coinsText}>
                    {task.coins}
                  </AppText>
                </View>

                <AppText weight="extraBold" style={styles.taskTitle}>
                  {task.title}
                </AppText>

                {task.done ? (
                  <View style={styles.doneBox}>
                    <MaterialCommunityIcons name={ICON.check} size={20} color="#0E7A3E" />
                    <AppText weight="bold" style={styles.doneText}>
                      {t("tasks.completed")}
                    </AppText>
                  </View>
                ) : (
                  <View style={styles.uploadRow}>
                    <AppText style={styles.notUploaded}>{t("tasks.not_uploaded")}</AppText>

                    <Pressable
                      style={styles.uploadBtn}
                      accessibilityRole="button"
                      accessibilityLabel={t("tasks.upload_a11y")}
                    >
                      <MaterialCommunityIcons name={ICON.camera} size={20} color="#2E5BFF" />
                      <AppText weight="bold" style={styles.uploadText}>
                        {t("tasks.upload")}
                      </AppText>
                    </Pressable>
                  </View>
                )}
              </View>
            ))}

            {/* Weekly summary */}
            <View style={styles.weekBox}>
              <MaterialCommunityIcons name={ICON.coin} size={20} color="#B36B00" />
              <AppText weight="extraBold" style={styles.weekText}>
                {t("tasks.week_total", { total: 38 })}
              </AppText>
            </View>
          </ScrollView>
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