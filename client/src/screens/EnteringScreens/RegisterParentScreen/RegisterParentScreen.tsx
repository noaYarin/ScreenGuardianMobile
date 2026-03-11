import React, { useMemo, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-plus-outline",
  google: "google",
} as const;

const isValidEmail = (value: string) => {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

export default function RegisterParentScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const cardWidth = useMemo(() => {
    const sidePadding = 16;
    const maxCard = 520;
    return Math.min(width - sidePadding * 2, maxCard);
  }, [width]);

  const canSubmit = useMemo(() => {
    return (
      isValidEmail(email) &&
      password.trim().length >= 1 &&
      confirmPassword.trim().length >= 1 &&
      password === confirmPassword &&
      !submitting
    );
  }, [email, password, confirmPassword, submitting]);

  const onSubmit = async () => {
    setErrorText(null);

    if (!isValidEmail(email)) {
      setErrorText(t("registerParent.invalid_email"));
      return;
    }

    if (!password.trim()) {
      setErrorText(t("registerParent.missing_password"));
      return;
    }

    if (!confirmPassword.trim()) {
      setErrorText(t("registerParent.missing_confirm_password"));
      return;
    }

    if (password !== confirmPassword) {
      setErrorText(t("registerParent.passwords_not_match"));
      return;
    }

    try {
      setSubmitting(true);

      //add to server
      await new Promise((r) => setTimeout(r, 600));

      router.replace("/Parent/home" as any);
    } catch {
      setErrorText(t("registerParent.generic_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    setErrorText(null);

    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      setErrorText(t("registerParent.google_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputRowStyle = useMemo(
    () => [styles.input, isRTL && styles.inputRTL],
    [isRTL]
  );

  const inputTextStyle = useMemo(
    () => [styles.inputText, isRTL && styles.inputTextRTL],
    [isRTL]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t("registerParent.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <LinearGradient
              colors={["#1D4ED8", "#7C3AED"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.hero}
            >
              <AppText weight="extraBold" style={styles.heroTitle}>
                {t("registerParent.title")}
              </AppText>
            </LinearGradient>

            <View style={[styles.card, { width: cardWidth }]}>
              <View style={styles.iconWrap}>
                <LinearGradient
                  colors={["#2563EB", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconBadge}
                >
                  <MaterialCommunityIcons name={ICON.users} size={28} color="#fff" />
                </LinearGradient>
              </View>

              <AppText weight="extraBold" style={styles.title}>
                {t("registerParent.heading")}
              </AppText>

              <AppText style={styles.subtitle}>
                {t("registerParent.subheading")}
              </AppText>

              <View style={inputRowStyle}>
                <MaterialCommunityIcons name={ICON.email} size={20} color="#6B7280" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t("registerParent.email_placeholder")}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputTextStyle}
                  accessibilityLabel={t("registerParent.email_a11y")}
                />
              </View>

              <View style={inputRowStyle}>
                <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("registerParent.password_placeholder")}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputTextStyle}
                  accessibilityLabel={t("registerParent.password_a11y")}
                />

                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  accessibilityRole="button"
                  accessibilityLabel={t("registerParent.toggle_password_a11y")}
                  hitSlop={10}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? ICON.eyeOff : ICON.eye}
                    size={22}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              <View style={inputRowStyle}>
                <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />

                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t("registerParent.confirm_password_placeholder")}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputTextStyle}
                  accessibilityLabel={t("registerParent.confirm_password_a11y")}
                />

                <Pressable
                  onPress={() => setShowConfirmPassword((s) => !s)}
                  accessibilityRole="button"
                  accessibilityLabel={t("registerParent.toggle_confirm_password_a11y")}
                  hitSlop={10}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? ICON.eyeOff : ICON.eye}
                    size={22}
                    color="#6B7280"
                  />
                </Pressable>
              </View>

              {errorText ? (
                <AppText style={styles.errorText} numberOfLines={2}>
                  {errorText}
                </AppText>
              ) : null}

              <Pressable
                onPress={onSubmit}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel={t("registerParent.register_a11y")}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (!canSubmit || submitting) && styles.primaryBtnDisabled,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#1D4ED8", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtnGradient}
                >
                  {submitting ? (
                    <ActivityIndicator />
                  ) : (
                    <AppText weight="extraBold" style={styles.primaryBtnText}>
                      {t("registerParent.register")}
                    </AppText>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{t("registerParent.or")}</AppText>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                onPress={onGoogle}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel={t("registerParent.google_a11y")}
                style={({ pressed }) => [
                  styles.googleBtn,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <MaterialCommunityIcons name={ICON.google} size={20} color="#111827" />
                <AppText weight="bold" style={styles.googleText} numberOfLines={1}>
                  {t("registerParent.google")}
                </AppText>
              </Pressable>

              <View style={styles.bottomRow}>
                <AppText style={styles.bottomText}>
                  {t("registerParent.have_account")}
                </AppText>

                <Pressable
                  onPress={() => router.replace("/Entering/loginParent" as any)}
                  accessibilityRole="button"
                  accessibilityLabel={t("registerParent.login_a11y")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <AppText weight="bold" style={styles.bottomLink}>
                    {t("registerParent.login")}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}