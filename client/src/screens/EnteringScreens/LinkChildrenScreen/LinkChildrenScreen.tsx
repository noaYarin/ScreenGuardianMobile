import React, { useMemo, useState } from "react";
import { View, Pressable, TextInput, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

type Mode = "barcode" | "code";

export default function LinkChildrenScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const [mode, setMode] = useState<Mode>("barcode");
  const [code, setCode] = useState("");

  const cardMaxWidth = useMemo(() => {
    if (width >= 900) return 520;
    if (width >= 650) return 480;
    return 420;
  }, [width]);

  const isBarcode = mode === "barcode";

  const onSubmitCode = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    router.back();
  };

  return (
    <>
      <ScreenLayout>
        <View style={styles.page}>
          <View style={[styles.card, { maxWidth: cardMaxWidth }]}>
            <View style={styles.segmentWrap} accessibilityRole="tablist">
              <Pressable
                onPress={() => setMode("barcode")}
                accessibilityRole="tab"
                accessibilityState={{ selected: isBarcode }}
                accessibilityLabel={t("linkChildren.tab_barcode_a11y")}
                style={[
                  styles.segmentBtn,
                  isBarcode ? styles.segmentActive : styles.segmentInactive,
                ]}
              >
                <AppText
                  weight={isBarcode ? "extraBold" : "bold"}
                  style={[
                    styles.segmentText,
                    isBarcode ? styles.segmentTextActive : styles.segmentTextInactive,
                  ]}
                  numberOfLines={1}
                >
                  {t("linkChildren.tab_barcode")}
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => setMode("code")}
                accessibilityRole="tab"
                accessibilityState={{ selected: !isBarcode }}
                accessibilityLabel={t("linkChildren.tab_code_a11y")}
                style={[
                  styles.segmentBtn,
                  !isBarcode ? styles.segmentActive : styles.segmentInactive,
                ]}
              >
                <View style={styles.segmentRow}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={18}
                    color={!isBarcode ? "#0B4DFF" : "#4B5563"}
                  />
                  <AppText
                    weight={!isBarcode ? "extraBold" : "bold"}
                    style={[
                      styles.segmentText,
                      !isBarcode ? styles.segmentTextActive : styles.segmentTextInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {t("linkChildren.tab_code")}
                  </AppText>
                </View>
              </Pressable>
            </View>

            <View style={styles.iconCircle} accessible accessibilityRole="image">
              <MaterialCommunityIcons name="link-variant" size={34} color="#1E3A8A" />
            </View>

            <AppText weight="extraBold" style={styles.title} numberOfLines={2}>
              {t("linkChildren.heading")}
            </AppText>

            <AppText style={styles.subtitle} numberOfLines={3}>
              {isBarcode ? t("linkChildren.sub_barcode") : t("linkChildren.sub_code")}
            </AppText>

            {isBarcode ? (
              <View style={styles.qrCard}>
                <View style={styles.qrBox}>
                  <MaterialCommunityIcons name="qrcode-scan" size={64} color="#1E3A8A" />
                </View>

                <Pressable
                  onPress={() => router.push("/Child/home")} //לשנות כשיהיה קוד נכון

                  accessibilityRole="button"
                  accessibilityLabel={t("linkChildren.scan_a11y")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.primaryBtnText}>
                    {t("linkChildren.scan")}
                  </AppText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.codeArea}>
            <AppText style={styles.subtitle} numberOfLines={3}>
              {isBarcode ? t("linkChildren.sub_barcode") : t("linkChildren.sub_code")}
            </AppText>
                <View style={styles.inputWrap}> 
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder={t("linkChildren.code_placeholder")}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    style={styles.input}
                    accessibilityLabel={t("linkChildren.code_input_a11y")}
                    returnKeyType="done"
                    onSubmitEditing={onSubmitCode}
                  />
                </View>

                <Pressable
                  onPress={() => router.push("/Child/home")} //לשנות כשיהיה קוד נכון
                  disabled={!code.trim()}
                  accessibilityRole="button"
                  accessibilityLabel={t("linkChildren.submit_a11y")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    !code.trim() ? styles.primaryBtnDisabled : null,
                    { opacity: pressed ? 0.75 : 1 },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.primaryBtnText}>
                    {t("linkChildren.submit")}
                  </AppText>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}