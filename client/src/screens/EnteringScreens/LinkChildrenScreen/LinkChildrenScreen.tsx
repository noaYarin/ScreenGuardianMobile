import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Pressable, TextInput, useWindowDimensions, Alert } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { apiLinkDevice } from "../../../api/auth";
import { buildDeviceConnectionPayload } from "../../../lib/deviceConnectionInfo";
import { styles } from "./styles";

/** After a failed link, wait before re-enabling scan so the camera does not instantly re-read the same QR. */
const ERROR_RELEASE_DELAY = 750;

type Mode = "barcode" | "code";

export default function LinkChildrenScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  // Barcode or Code
  const [mode, setMode] = useState<Mode>("barcode");
  const [code, setCode] = useState("");
  const [permission, requestPermission] = useCameraPermissions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Blocks duplicate link-device calls synchronously state updates are async 
  const linkInFlightRef = useRef(false);
  const finishLinkErrorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBarcode = mode === "barcode";

  const tryBeginLink = (): boolean => {
    if (linkInFlightRef.current) return false;
    linkInFlightRef.current = true;
    setIsSubmitting(true);
    return true;
  };

  //Resets the linking state and releases the lock
    const finishLink = () => {
    linkInFlightRef.current = false;
    setIsSubmitting(false);
  };

  // Prevents the camera from immediately re-scanning the same QR code
  const scheduleFinishLinkAfterError = () => {
    if (finishLinkErrorTimeoutRef.current) {
      clearTimeout(finishLinkErrorTimeoutRef.current);
    }
    // Set a grace period before allowing the next scan attempt
    finishLinkErrorTimeoutRef.current = setTimeout(() => {
      finishLinkErrorTimeoutRef.current = null;
      finishLink();
    }, ERROR_RELEASE_DELAY);
  };

  const cardMaxWidth = useMemo(() => {
    if (width >= 900) return 520;
    if (width >= 650) return 480;
    return 420;
  }, [width]);


  // Request camera permission automatically on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {
      if (finishLinkErrorTimeoutRef.current) {
        clearTimeout(finishLinkErrorTimeoutRef.current);
      }
    };
  }, []);

  // Handle code 
  const pairingBtn = async () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;
    if (!tryBeginLink()) return;

    try {
      await apiLinkDevice({
        code: trimmedCode,
        barcodeToken: "",
        ...buildDeviceConnectionPayload(),
      });
      finishLink();
      router.replace("/Child/home");
    } catch (error) {
      Alert.alert(
        t("linkChildren.error_title"),
        t("linkChildren.error_generic"),
      );
      scheduleFinishLinkAfterError();
      router.replace('Entering/roleSelectionRoute' as any);
    }
  };

  // Handle barcode scanned
  const handleBarcodeScanned = async (result: { data?: string }) => {
    const token = result?.data?.trim();
    if (!token) return;
    if (!tryBeginLink()) return;

    try {
      await apiLinkDevice({
        code: "",
        barcodeToken: token,
        ...buildDeviceConnectionPayload(),
      });
      finishLink();
      router.replace("/Child/home");
    } catch (error) {
      Alert.alert(
        t("linkChildren.error_title"),
        t("linkChildren.error_generic"),
      );
      scheduleFinishLinkAfterError();
      router.replace('Entering/roleSelectionRoute' as any);
    }
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

            {!isBarcode ? (
              <View style={styles.iconCircle} accessible accessibilityRole="image">
                <MaterialCommunityIcons name="link-variant" size={34} color="#1E3A8A" />
              </View>
            ) : (
              <View style={styles.iconCircle} accessible accessibilityRole="image">
                <MaterialCommunityIcons name="qrcode-scan" size={34} color="#1E3A8A" />
              </View>
            )}
         
            <AppText weight="extraBold" style={styles.title} numberOfLines={2}>
              {t("linkChildren.heading")}
            </AppText>

            {isBarcode ? (
              <View style={styles.qrCard}>
                <View style={styles.qrBox}>
                  {permission?.granted ? (
                    <CameraView
                      style={styles.cameraView}
                      onBarcodeScanned={
                        isSubmitting ? undefined : handleBarcodeScanned
                      }
                      barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                    />
                  ) : (
                    <View style={styles.cameraFallback}>
                      <AppText style={styles.subtitle}>
                        {t(
                          "linkChildren.camera_denied_message"
                        )}
                      </AppText>
                    </View>
                  )}
                </View>

                <Pressable
                  onPress={requestPermission}
                  accessibilityRole="button"
                  accessibilityLabel={t("linkChildren.scan_a11y")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    { opacity: pressed || isSubmitting ? 0.75 : 1 },
                  ]}
                  disabled={isSubmitting}
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
                    autoComplete="off"
                    autoFocus={true}
                    keyboardType="numeric"
                    maxLength={6}
                    style={styles.input}
                    accessibilityLabel={t("linkChildren.code_input_a11y")}
                  />
                </View>

                <Pressable
                  onPress={pairingBtn}
                  disabled={!code.trim() || isSubmitting}
                  accessibilityRole="button"
                  accessibilityLabel={t("linkChildren.submit_a11y")}
                  style={({ pressed }) => [
                    styles.primaryBtn,
                    !code.trim() ? styles.primaryBtnDisabled : null,
                    { opacity: pressed || isSubmitting ? 0.75 : 1 },
                  ]}
                >
                  <AppText weight="extraBold" style={styles.primaryBtnText}>
                    {t("linkChildren.connect")}
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