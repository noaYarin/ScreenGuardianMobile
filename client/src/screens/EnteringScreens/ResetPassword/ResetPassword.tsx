import React, { useMemo, useState } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, useWindowDimensions, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./resetPassword.styles";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { resetPassword } from "@/src/redux/thunks/authThunks";
import { AppDispatch } from "@/src/redux/store/types";

const ICON = {
  lock: "lock-reset",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
} as const;

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  
  const { email } = useLocalSearchParams<{ email?: string }>();

  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { isLoading, error } = useSelector((state: any) => state.auth);
  const displayError = errorMessage || error;

  const cardWidth = useMemo(() => {
    const sidePadding = 16;
    const maxCard = 520;
    return Math.min(width - sidePadding * 2, maxCard);
  }, [width]);

  const validateForm = () => {
    if (!email) {
      setErrorMessage(t("resetPassword.missing_email") || "Missing email. Please restart the reset process.");
      return false;
    }

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setErrorMessage(t("resetPassword.invalid_code") || "Please enter the 6-digit verification code.");
      return false;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage(t("resetPassword.missing_fields"));
      return false;
    }
    if (password.length < 8) {
      setErrorMessage(t("resetPassword.invalid_password"));
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t("resetPassword.passwords_not_match"));
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    try {
      setErrorMessage(null);
      if (!validateForm()) return;

      await dispatch(
        resetPassword({
          email: String(email),
          otpCode: verificationCode.trim(),
          password,
        })
      ).unwrap();

      Alert.alert(
        t("resetPassword.success_title") || "Password updated",
        t("resetPassword.success_message") || "Your password has been reset successfully.",
        [
          {
            text: t("common.ok") || "OK",
            onPress: () => {
              router.replace("/Entering/loginParent" as any);
            },
          },
        ]
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <View style={[styles.card, { width: cardWidth }]}>
            
            <View style={styles.iconWrap}>
              <LinearGradient colors={["#6366f1", "#4f46e5"]} style={styles.iconBadge}>
                <MaterialCommunityIcons name={ICON.lock} size={28} color="#fff" />
              </LinearGradient>
            </View>

            <AppText weight="extraBold" style={styles.title}>
              {t("resetPassword.heading")}
            </AppText>

            <AppText style={styles.subtitle}>
              {t("resetPassword.subheading")}
            </AppText>

            <View style={styles.input}>
              <MaterialCommunityIcons name="numeric" size={20} color="#6B7280" />
              <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder={t("resetPassword.code_placeholder") || "Verification code"}
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
                style={styles.inputText}
              />
            </View>

            <View style={styles.input}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="#6B7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={t("resetPassword.new_password_placeholder")}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={styles.inputText}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons name={showPassword ? ICON.eyeOff : ICON.eye} size={22} color="#6B7280" />
              </Pressable>
            </View>

            <View style={styles.input}>
              <MaterialCommunityIcons name="lock-check-outline" size={20} color="#6B7280" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={t("resetPassword.confirm_password_placeholder")}
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                style={styles.inputText}
              />
            </View>

            {displayError ? (
              <AppText style={styles.errorText}>{displayError}</AppText>
            ) : null}

            <Pressable onPress={onSubmit} disabled={isLoading} style={styles.primaryBtn}>
              <LinearGradient colors={["#1D4ED8", "#7C3AED"]} style={styles.primaryBtnGradient}>
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <AppText weight="extraBold" style={styles.primaryBtnText}>
                    {t("resetPassword.submit_btn")}
                  </AppText>
                )}
              </LinearGradient>
            </Pressable>

          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}