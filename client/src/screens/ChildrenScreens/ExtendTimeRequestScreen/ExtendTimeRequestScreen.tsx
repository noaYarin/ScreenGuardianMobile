import React, { useMemo, useState } from "react";
import { View, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type MinuteOption = {
  minutes: number;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  borderStyle: "blue" | "purple" | "green";
};

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

export default function ExtendTimeRequestScreen() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");

  const minuteOptions: MinuteOption[] = useMemo(
    () => [
      { minutes: 10, icon: "clock-outline", borderStyle: "blue" },
      { minutes: 5, icon: "clock-outline", borderStyle: "purple" },
      { minutes: 15, icon: "clock-outline", borderStyle: "green" },
    ],
    []
  );

  const [selectedMinutes, setSelectedMinutes] = useState<number>(minuteOptions[0]?.minutes ?? 5);
  const [customMinutes, setCustomMinutes] = useState<number>(5);
  const [message, setMessage] = useState<string>("");

  const selectPreset = (m: number) => setSelectedMinutes(m);

  const selectCustom = (m: number) => {
    setCustomMinutes(m);
    setSelectedMinutes(m);
  };

  const incCustom = () => selectCustom(Math.min(120, customMinutes + 1));
  const decCustom = () => selectCustom(Math.max(1, customMinutes - 1));

  const onSend = () => {
    router.back();
  };

  const getBorderStyle = (styleKey: MinuteOption["borderStyle"]) => {
    if (styleKey === "blue") return styles.cardBorderBlue;
    if (styleKey === "purple") return styles.cardBorderPurple;
    return styles.cardBorderGreen;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("extendTime.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ Back מגיע מה־RootLayout

        
        }}
      />

      <ScreenLayout>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
          <View style={styles.container}>
            <View style={styles.subTitleRow}>
              <MaterialCommunityIcons name="trending-up" size={18} color="#2A6CFF" />
              <AppText weight="bold" style={styles.subTitle}>
                {t("extendTime.subTitle")}
              </AppText>
            </View>

            <AppText weight="extraBold" style={styles.question}>
              {t("extendTime.question")}
            </AppText>

            <View style={styles.grid}>
              <View style={styles.row}>
                <MinuteCard
                  minutes={minuteOptions[0].minutes}
                  iconName={minuteOptions[0].icon}
                  active={selectedMinutes === minuteOptions[0].minutes}
                  borderStyle={getBorderStyle(minuteOptions[0].borderStyle)}
                  onPress={() => selectPreset(minuteOptions[0].minutes)}
                  a11y={t("extendTime.option_a11y", { minutes: minuteOptions[0].minutes })}
                  minutesLabel={t("extendTime.minutes")}
                />
                <MinuteCard
                  minutes={minuteOptions[1].minutes}
                  iconName={minuteOptions[1].icon}
                  active={selectedMinutes === minuteOptions[1].minutes}
                  borderStyle={getBorderStyle(minuteOptions[1].borderStyle)}
                  onPress={() => selectPreset(minuteOptions[1].minutes)}
                  a11y={t("extendTime.option_a11y", { minutes: minuteOptions[1].minutes })}
                  minutesLabel={t("extendTime.minutes")}
                />
              </View>

              <View style={styles.row}>
                <View
                  style={[
                    styles.cardBase,
                    styles.cardBorderOrange,
                    selectedMinutes === customMinutes ? styles.cardActive : null,
                  ]}
                  accessible={false}
                >
                  <Pressable
                    onPress={() => selectCustom(customMinutes)}
                    accessibilityRole="button"
                    accessibilityLabel={t("extendTime.custom_a11y")}
                    style={({ pressed }) => [
                      styles.cardOverlayPressable,
                      pressed ? styles.cardPressed : null,
                    ]}
                  />

                  <View style={styles.customTopRow}>
                    <MaterialCommunityIcons name="clock-outline" size={26} color="#E4572E" />
                  </View>

                  <AppText weight="extraBold" style={styles.customLabel}>
                    {t("extendTime.customTitle")}
                  </AppText>

                  <View style={styles.customValueRow}>
                    <Pressable
                      onPress={incCustom}
                      accessibilityRole="button"
                      accessibilityLabel={t("extendTime.customPlus_a11y")}
                      hitSlop={10}
                      style={({ pressed }) => [
                        styles.customControlBtn,
                        pressed ? styles.pressedOpacity : null,
                      ]}
                    >
                      <MaterialCommunityIcons name="plus" size={18} color="#E4572E" />
                    </Pressable>

                    <AppText weight="extraBold" style={styles.customValue}>
                      {customMinutes}
                    </AppText>

                    <Pressable
                      onPress={decCustom}
                      accessibilityRole="button"
                      accessibilityLabel={t("extendTime.customMinus_a11y")}
                      hitSlop={10}
                      style={({ pressed }) => [
                        styles.customControlBtn,
                        pressed ? styles.pressedOpacity : null,
                      ]}
                    >
                      <MaterialCommunityIcons name="minus" size={18} color="#E4572E" />
                    </Pressable>
                  </View>

                  <AppText style={styles.customUnit}>{t("extendTime.minutes")}</AppText>
                </View>

                <MinuteCard
                  minutes={minuteOptions[2].minutes}
                  iconName={minuteOptions[2].icon}
                  active={selectedMinutes === minuteOptions[2].minutes}
                  borderStyle={getBorderStyle(minuteOptions[2].borderStyle)}
                  onPress={() => selectPreset(minuteOptions[2].minutes)}
                  a11y={t("extendTime.option_a11y", { minutes: minuteOptions[2].minutes })}
                  minutesLabel={t("extendTime.minutes")}
                />
              </View>
            </View>

            <View style={styles.summaryBar}>
              <AppText weight="extraBold" style={styles.summaryText}>
                {t("extendTime.requestedLabel")} {t("extendTime.plusMinutes", { minutes: selectedMinutes })}
              </AppText>
            </View>

            <View style={styles.messageBlock}>
              <AppText weight="bold" style={styles.messageLabel}>
                {t("extendTime.messageLabel")}
              </AppText>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder={t("extendTime.messagePlaceholder")}
                placeholderTextColor="#8A8A8A"
                style={styles.messageInput}
                multiline
                textAlign={isRTL ? "right" : "left"}
                accessibilityLabel={t("extendTime.message_a11y")}
              />
            </View>

            <Pressable
              onPress={onSend}
              accessibilityRole="button"
              accessibilityLabel={t("extendTime.send_a11y")}
              style={({ pressed }) => [styles.sendBtn, pressed ? styles.sendBtnPressed : null]}
            >
              <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" />
              <AppText weight="extraBold" style={styles.sendBtnText}>
                {t("extendTime.send")}
              </AppText>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}

function MinuteCard({
  minutes,
  iconName,
  active,
  borderStyle,
  onPress,
  a11y,
  minutesLabel,
}: {
  minutes: number;
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  active: boolean;
  borderStyle: any;
  onPress: () => void;
  a11y: string;
  minutesLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        styles.cardBase,
        borderStyle,
        active ? styles.cardActive : null,
        pressed ? styles.cardPressed : null,
      ]}
    >
      <MaterialCommunityIcons name={iconName} size={26} color="#2A6CFF" />
      <AppText weight="extraBold" style={styles.minutesValue}>
        +{minutes}
      </AppText>
      <AppText style={styles.minutesLabel}>{minutesLabel}</AppText>
    </Pressable>
  );
}