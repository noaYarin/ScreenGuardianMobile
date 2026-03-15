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
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { AppDispatch } from "@/src/redux/store/types";
import { registerParent } from "@/src/redux/slices/auth-slice";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-plus-outline",
} as const;

const isValidEmail = (value: string) => {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

export default function RegisterParentScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Redux state
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);
  // Local state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const displayError = errorMessage || error;


  const cardWidth = useMemo(() => {
    const sidePadding = 16;
    const maxCard = 520;
    return Math.min(width - sidePadding * 2, maxCard);
  }, [width]);


  const onSubmit = async () => {
    try {
      if (!validateForm()) return;
      // Using .unwrap() to handle the Thunk result as a standard Promise.
      await (dispatch as AppDispatch)(registerParent({ email, password })).unwrap();
      router.replace("/Entering/loginParent" as any);
    } catch (err: any) {
      console.error(err);
    }
  };

const validateForm = () => {

  if (!email.trim()&& !password.trim()&& !confirmPassword.trim()) {
    setErrorMessage(t("registerParent.missing_fields"));
    return false;
  }

  if (!isValidEmail(email)) {
    setErrorMessage(t("registerParent.invalid_email"));
    return false;
  }
  if (password !== confirmPassword) {
    setErrorMessage(t("registerParent.passwords_not_match"));
    return false;
  }
  if (password.length < 8) {
    setErrorMessage(t("registerParent.invalid_password"));
    return false;
  }
  if (confirmPassword.length < 8) {
    setErrorMessage(t("registerParent.invalid_confirm_password"));
    return false;
  }

  return true;
}

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
          title: "",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <KeyboardAvoidingView
          style={styles.flex1}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
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

              {displayError ? (
                <AppText style={styles.errorText} numberOfLines={2}>
                  {t(displayError as string)}
                </AppText>
              ) : null}

              <Pressable
                onPress={onSubmit}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={t("registerParent.register_a11y")}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  (isLoading) && styles.primaryBtnDisabled,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <LinearGradient
                  colors={["#1D4ED8", "#7C3AED"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtnGradient}
                >
                  {isLoading ? (
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

              <View style={styles.bottomRow}>
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
                <AppText style={styles.bottomText}>
                  {t("registerParent.have_account")}
                </AppText>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}