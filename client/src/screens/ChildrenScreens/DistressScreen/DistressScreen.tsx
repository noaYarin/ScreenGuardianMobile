import React, { useMemo } from "react";
import { View, Pressable, Alert, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

export default function DistressScreen() {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();

  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");

  const areaSize = Math.min(320, Math.max(240, width - 32));
  const ringInset = Math.round(areaSize * (18 / 320));
  const buttonSize = Math.round(areaSize * (230 / 320));

  const rowDir = useMemo(
    () => ({ flexDirection: isRTL ? "row-reverse" : "row" } as const),
    [isRTL]
  );
  const textAlign = useMemo(
    () => ({ textAlign: isRTL ? "right" : "left" } as const),
    [isRTL]
  );
  const centerText = useMemo(() => ({ textAlign: "center" } as const), []);

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
        }}
      />

      <ScreenLayout>
        <View style={styles.page}>
          <View style={styles.heroCard}>
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
              <AppText weight="extraBold" style={[styles.titleText, centerText]}>
                {t("distress.need_help")}
              </AppText>
              <AppText weight="medium" style={[styles.subtitle, centerText]}>
                {t("distress.tap_to_send")}
              </AppText>
            </View>
          </View>

          <View style={[styles.sendCard, rowDir]}>
            <View style={styles.peopleIcon} accessibilityElementsHidden importantForAccessibility="no">
              <MaterialCommunityIcons name="account-group-outline" size={22} color="#2F6DEB" />
            </View>

            <View style={styles.sendCardText}>
              <AppText weight="medium" style={[styles.sendToLabel, textAlign]}>
                {t("distress.send_to")}
              </AppText>
              <AppText weight="extraBold" style={[styles.sendToValue, textAlign]}>
                {t("distress.parents")}
              </AppText>
            </View>
          </View>

          <View style={styles.warningBox}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#B46B00" />
            <AppText weight="medium" style={[styles.warningText, { textAlign: "center" }]}>
              {t("distress.warning")}
            </AppText>
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}