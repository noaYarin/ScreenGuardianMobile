import React, { useMemo, useState } from "react";
import { View, Pressable, ScrollView } from "react-native";
import { Stack } from "expo-router";
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
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage || i18n.language || "en";
  const isRTL = currentLanguage?.startsWith("he") || i18n.dir() === "rtl";

  const rowDir = useMemo(
    () => ({ flexDirection: isRTL ? "row-reverse" as const : "row" as const }),
    [isRTL]
  );
  const textAlign = useMemo(
    () => ({ textAlign: isRTL ? "right" as const : "left" as const }),
    [isRTL]
  );

  const [activeTab, setActiveTab] = useState<"done" | "todo">("done");

  const tasks: Task[] = [
    { id: "1", title: t("tasks.clean_room"), coins: 15, done: true },
    { id: "2", title: t("tasks.read_book"), coins: 10, done: true },
    { id: "3", title: t("tasks.tidy_room"), coins: 10, done: false },
    { id: "4", title: t("tasks.walk_dog"), coins: 8, done: false },
    { id: "5", title: t("tasks.help_table"), coins: 12, done: false },
  ];

  const filteredTasks =
    activeTab === "done"
      ? tasks.filter((x) => x.done)
      : tasks.filter((x) => !x.done);

  return (
    <>
      <Stack.Screen
        options={{
          title: t("tasks.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.contentMaxWidth}>
            <View style={[styles.tabsWrapper, rowDir]}>
              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "todo" ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("todo")}
                accessibilityRole="button"
                accessibilityLabel={t("tasks.todo_a11y")}
              >
                <AppText weight="extraBold" style={styles.tabText}>
                  {t("tasks.todo")}
                </AppText>
              </Pressable>

              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "done" ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("done")}
                accessibilityRole="button"
                accessibilityLabel={t("tasks.done_a11y")}
              >
                <AppText weight="extraBold" style={styles.tabText}>
                  {t("tasks.done")}
                </AppText>
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {filteredTasks.map((task) => (
                <View key={task.id} style={styles.card}>
                  {/* Title on one side, coins on the opposite side (RTL/LTR aware) */}
                  <View style={[styles.cardHeader, rowDir]}>
                    <AppText
                      weight="extraBold"
                      style={[styles.taskTitle, textAlign]}
                      numberOfLines={2}
                    >
                      {task.title}
                    </AppText>

                    <View style={[styles.coinsBadge, rowDir]}>
                      <MaterialCommunityIcons
                        name={ICON.coin}
                        size={18}
                        color="#B46B00"
                      />
                      <AppText weight="extraBold" style={styles.coinsText}>
                        {task.coins}
                      </AppText>
                    </View>
                  </View>

                  {task.done ? (
                    <View style={[styles.statusBoxDone, rowDir]}>
                      <View
                        style={[
                          styles.statusIconCircle,
                          styles.statusIconCircleDone,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={ICON.check}
                          size={18}
                          color="#0F8A5F"
                        />
                      </View>

                      <AppText
                        weight="bold"
                        style={[styles.statusTextDone, textAlign]}
                      >
                        {t("tasks.completed")}
                      </AppText>
                    </View>
                  ) : (
                    <View style={styles.todoArea}>
                      <AppText style={[styles.todoHint, textAlign]}>
                        {t("tasks.not_uploaded")}
                      </AppText>

                      <Pressable
                        style={styles.uploadBtn}
                        accessibilityRole="button"
                        accessibilityLabel={t("tasks.upload_a11y")}
                      >
                        <View style={[styles.uploadBtnInner, rowDir]}>
                          <View
                            style={[
                              styles.statusIconCircle,
                              styles.statusIconCircleUpload,
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={ICON.camera}
                              size={18}
                              color="#2F6DEB"
                            />
                          </View>

                          <AppText weight="extraBold" style={styles.uploadText}>
                            {t("tasks.upload")}
                          </AppText>
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              ))}

              <View style={styles.weekBox}>
                <View style={[styles.weekInner, rowDir]}>
                  <View style={styles.weekIconCircle}>
                    <MaterialCommunityIcons
                      name={ICON.coin}
                      size={18}
                      color="#B46B00"
                    />
                  </View>

                  <AppText weight="extraBold" style={[styles.weekText, textAlign]}>
                    {t("tasks.week_total", { total: 38 })}
                  </AppText>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}