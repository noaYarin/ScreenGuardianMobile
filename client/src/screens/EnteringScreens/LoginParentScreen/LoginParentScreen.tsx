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
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginParent } from "@/src/redux/thunks/authThunks";
import { useDispatch, useSelector } from "react-redux";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { AppDispatch } from "@/src/redux/store/types";

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-group-outline",
} as const;

const isValidEmail = (value: string) => {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

export default function LoginParentScreen() {
  const { t } = useTranslation();
  const { isRTL} = useLocaleLayout();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  // Redux state
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      await dispatch(loginParent({ email, password })).unwrap();
      router.replace("/Parent/home" as any);
    } catch (error: any) {
      setErrorMessage(error as string);
    }
  };

  
const validateForm = () => {

  if (!email.trim()&& !password.trim()) {
    setErrorMessage(t("loginParent.missing_fields"));
    return false;
  }

  if (!isValidEmail(email)) {
    setErrorMessage(t("loginParent.invalid_email"));
    return false;
  }
  if (password.length < 8) {
    setErrorMessage(t("loginParent.invalid_password"));
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
                {t("loginParent.heading")}
              </AppText>

              <AppText style={styles.subtitle}>
                {t("loginParent.subheading")}
              </AppText>

              {/* Email input with RTL-aware layout */}
              <View style={inputRowStyle}>
                <MaterialCommunityIcons name={ICON.email} size={20} color="#6B7280" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t("loginParent.email_placeholder")}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputTextStyle}
                  accessibilityLabel={t("loginParent.email_a11y")}
                />
              </View>

              {/* Password input with RTL-aware layout */}
              <View style={inputRowStyle}>
                <MaterialCommunityIcons name={ICON.lock} size={20} color="#6B7280" />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("loginParent.password_placeholder")}
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={inputTextStyle}
                  accessibilityLabel={t("loginParent.password_a11y")}
                />

                <Pressable
                  onPress={() => setShowPassword((s) => !s)}
                  accessibilityRole="button"
                  accessibilityLabel={t("loginParent.toggle_password_a11y")}
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

              {displayError ? (
                <AppText style={styles.errorText} numberOfLines={2}>
                  {t(displayError as string)}
                </AppText>
              ) : null}

              {/* Centered forgot password action */}

              <Pressable
                onPress={() => router.push('/Entering/forgotPassword' as any)}  
                accessibilityRole="button"
                accessibilityLabel={t("loginParent.forgot_a11y")}
                style={({ pressed }) => [
                  styles.forgotWrap,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <AppText style={styles.forgotText}>{t("loginParent.forgot")}</AppText>
              </Pressable>

              <Pressable
                onPress={onSubmit}
                disabled={isLoading}
                accessibilityRole="button"
                accessibilityLabel={t("loginParent.connect_a11y")}
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
                      {t("loginParent.connect")}
                    </AppText>
                  )}
                </LinearGradient>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText style={styles.dividerText}>{t("loginParent.or")}</AppText>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.bottomRow}>
                <Pressable
                  onPress={() => router.replace('/Entering/registerParent' as any)}
                  accessibilityRole="button"
                  accessibilityLabel={t("loginParent.register_a11y")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <AppText weight="bold" style={styles.bottomLink}>
                    {t("loginParent.register")}
                  </AppText>
                </Pressable>
                <AppText style={styles.bottomText}>
                  {t("loginParent.no_account")}
                </AppText>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenLayout>
    </>
  );
}