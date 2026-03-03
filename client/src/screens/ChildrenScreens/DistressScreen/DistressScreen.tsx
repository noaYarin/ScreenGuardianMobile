import React from "react";
import { View, Pressable, Alert, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

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

export default function DistressScreen() {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();

  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");

  const areaSize = Math.min(320, Math.max(240, width - 32));
  const ringInset = Math.round(areaSize * (18 / 320));
  const buttonSize = Math.round(areaSize * (230 / 320));

  const onSOSPress = () => {
    Alert.alert(t("distress.alert_title"), t("distress.alert_desc"));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("distress.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ Back מגיע מה־RootLayout (לא מגדירים פה)

       
        }}
      />

      <ScreenLayout>
        <View style={styles.page}>
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
                { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
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

          <View style={styles.textBlock}>
            <AppText weight="extraBold" style={styles.titleText}>
              {t("distress.need_help")}
            </AppText>
            <AppText weight="medium" style={styles.subtitle}>
              {t("distress.tap_to_send")}
            </AppText>
          </View>

          <View style={styles.sendCard}>
            <View style={styles.sendCardRight}>
              <AppText weight="medium" style={styles.sendToLabel}>
                {t("distress.send_to")}
              </AppText>
              <AppText weight="extraBold" style={styles.sendToValue}>
                {t("distress.parents")}
              </AppText>
            </View>

            <View style={styles.peopleIcon} accessibilityElementsHidden importantForAccessibility="no">
              <MaterialCommunityIcons name="account-group-outline" size={22} color="#000" />
            </View>
          </View>

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