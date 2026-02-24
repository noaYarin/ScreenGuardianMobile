import React from "react";
import { View, Pressable, Alert, useWindowDimensions, I18nManager } from "react-native";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../components/AppText/AppText";
import { styles } from "./styles";

export default function DistressScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const areaSize = Math.min(320, Math.max(240, width - 32));
  const ringInset = Math.round(areaSize * (18 / 320));
  const buttonSize = Math.round(areaSize * (230 / 320));

  const onSOSPress = () => {
    Alert.alert(t("distress.alert_title"), t("distress.alert_desc"));
  };

  // חץ "חזור" לכיוון ההפוך (מתהפך אוטומטית לפי RTL/LTR)
  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  return (
    <>
      <Stack.Screen
        options={{
          title: t("distress.title"),

          headerRight: () => (
            <HeaderIconButton
              name={backIconName}
              onPress={() => router.back()}
              accessibilityLabel={t("distress.back_a11y")}
            />
          ),

          headerLeft: () => (
            <HeaderIconButton
              name="menu"
              onPress={() => {}}
              accessibilityLabel={t("distress.menu_a11y")}
            />
          ),
        }}
      />

      <ScreenLayout>
        <View style={styles.page}>
          {/* SOS circle area */}
          <View style={[styles.sosArea, { width: areaSize, height: areaSize }]}>
            <View style={styles.ringOuter} />
            <View
              style={[
                styles.ringInner,
                { top: ringInset, left: ringInset, right: ringInset, bottom: ringInset },
              ]}
            />

            <Pressable
              onPress={onSOSPress}
              accessibilityRole="button"
              accessibilityLabel={t("distress.sos_a11y")}
              style={({ pressed }) => [
                styles.sosButton,
                {
                  width: buttonSize,
                  height: buttonSize,
                  borderRadius: buttonSize / 2,
                },
                pressed && styles.sosButtonPressed,
              ]}
            >
              <View style={styles.exMarkCircle}>
                <AppText weight="extraBold" style={styles.exMark}>
                  !
                </AppText>
              </View>

              <AppText weight="extraBold" style={styles.sosText}>
                SOS
              </AppText>
            </Pressable>
          </View>

          {/* Texts */}
          <View style={styles.textBlock}>
            <AppText weight="extraBold" style={styles.titleText}>
              {t("distress.need_help")}
            </AppText>
            <AppText weight="medium" style={styles.subtitle}>
              {t("distress.tap_to_send")}
            </AppText>
          </View>

          {/* Send-to card */}
          <View style={styles.sendCard}>
            <View style={styles.sendCardRight}>
              <AppText weight="medium" style={styles.sendToLabel}>
                {t("distress.send_to")}
              </AppText>
              <AppText weight="extraBold" style={styles.sendToValue}>
                {t("distress.parents")}
              </AppText>
            </View>

            <View
              style={styles.peopleIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            >
              <MaterialCommunityIcons name="account-group-outline" size={22} color="#000" />
            </View>
          </View>

          {/* warning box */}
          <View style={styles.warningBox}>
            <AppText weight="medium" style={styles.warningText}>
              {t("distress.warning")}
            </AppText>
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