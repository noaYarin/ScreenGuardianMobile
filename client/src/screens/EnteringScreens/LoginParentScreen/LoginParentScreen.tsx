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

const ICON = {
  email: "email-outline",
  lock: "lock-outline",
  eye: "eye-outline",
  eyeOff: "eye-off-outline",
  users: "account-group-outline",
  google: "google",
} as const;

const isValidEmail = (value: string) => {
  const v = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

export default function LoginParentScreen() {
  const { t, i18n } = useTranslation();
  const { width } = useWindowDimensions();

  // ✅ RTL יציב גם ב-Web
  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const cardWidth = useMemo(() => {
    const sidePadding = 16;
    const maxCard = 520;
    return Math.min(width - sidePadding * 2, maxCard);
  }, [width]);

  const canSubmit = useMemo(() => {
    return isValidEmail(email) && password.trim().length >= 1 && !submitting;
  }, [email, password, submitting]);

  const onSubmit = async () => {
    // ✅ FLOW ONLY (בינתיים): מעבר למסך הבית בלי בדיקות
    // השאירי את כל ה־validation כאן בהערות כדי להחזיר אחר כך

    // setErrorText(null);

    // if (!isValidEmail(email)) {
    //   setErrorText(t("loginParent.invalid_email"));
    //   return;
    // }
    // if (!password.trim()) {
    //   setErrorText(t("loginParent.missing_password"));
    //   return;
    // }

    // try {
    //   setSubmitting(true);
    //   await new Promise((r) => setTimeout(r, 600));
    // } catch {
    //   setErrorText(t("loginParent.generic_error"));
    // } finally {
    //   setSubmitting(false);
    // }

    router.replace("/Parent/home" as any);
  };

  const onGoogle = async () => {
    setErrorText(null);
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
    } catch {
      setErrorText(t("loginParent.google_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputRowStyle = useMemo(
    () => [styles.input, isRTL && styles.inputRTL],
    [isRTL]
  );

  const inputTextStyle = useMemo(
    () => [
      styles.inputText,
      isRTL && styles.inputTextRTL, // כולל textAlign + writingDirection בסטייל
    ],
    [isRTL]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t("loginParent.title"),
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
                {t("loginParent.title")}
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
                {t("loginParent.heading")}
              </AppText>

              <AppText style={styles.subtitle}>{t("loginParent.subheading")}</AppText>

              {/* ✅ EMAIL: RTL אמיתי (האייקון מימין) */}
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

              {/* ✅ PASSWORD: RTL אמיתי (המנעול מימין, העין שמאל) */}
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

              {errorText ? (
                <AppText style={styles.errorText} numberOfLines={2}>
                  {errorText}
                </AppText>
              ) : null}

              {/* ✅ שכחת סיסמה באמצע */}
              <Pressable
                onPress={() => {}}
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
                //disabled={!canSubmit} להחזיר לזה כשעושים את הצד שרת
                disabled={submitting} 
                accessibilityRole="button"
                accessibilityLabel={t("loginParent.connect_a11y")}
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

              <Pressable
                onPress={onGoogle}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel={t("loginParent.google_a11y")}
                style={({ pressed }) => [
                  styles.googleBtn,
                  { opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <MaterialCommunityIcons name={ICON.google} size={20} color="#111827" />
                <AppText weight="bold" style={styles.googleText} numberOfLines={1}>
                  {t("loginParent.google")}
                </AppText>
              </Pressable>

              <View style={styles.bottomRow}>
                <AppText style={styles.bottomText}>{t("loginParent.no_account")}</AppText>

                <Pressable
                  onPress={() => {}}
                  accessibilityRole="button"
                  accessibilityLabel={t("loginParent.register_a11y")}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <AppText weight="bold" style={styles.bottomLink}>
                    {t("loginParent.register")}
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