import React, { useMemo, useState } from "react";
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/src/redux/thunks/authThunks"; 
import { styles } from "./forgotPassword.styles";
import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { AppDispatch } from "@/src/redux/store/types";
import { setError } from "@/src/redux/slices/auth-slice";

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  
  const { isLoading, error } = useSelector((state: { auth: { isLoading: boolean; error: string | null } }) => state.auth);

  const cardWidth = useMemo(() => {
    const sidePadding = 16;
    const maxCard = 520;
    return Math.min(width - sidePadding * 2, maxCard);
  }, [width]);

  const handleSendEmail = async () => {
    dispatch(setError(null));
    const trimmedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      dispatch(setError("loginParent.invalid_email"));
      return;
    }

    try {
      await dispatch(forgotPassword(trimmedEmail)).unwrap();

      router.push({
        pathname: "/Entering/resetPassword",
        params: { email: trimmedEmail },
      } as any);
    } catch (err: any) {
      if (typeof err === "string") {
        dispatch(setError(err));
      }
    }
  };

  return (
    <ScreenLayout>
      <KeyboardAvoidingView style={styles.flex1} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.container}>
          <View style={[styles.card, { width: cardWidth }]}>
            
            <View style={styles.iconWrap}>
              <LinearGradient colors={["#2563EB", "#7C3AED"]} style={styles.iconBadge}>
                <MaterialCommunityIcons name="lock-reset" size={28} color="#fff" />
              </LinearGradient>
            </View>

            <AppText weight="extraBold" style={styles.title}>
              {t("forgotPassword.heading")}
            </AppText>

            <AppText style={styles.subtitle}>
              {t("forgotPassword.subheading")}
            </AppText>

            <View style={styles.input}>
              <MaterialCommunityIcons name="email-outline" size={20} color="#6B7280" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("loginParent.email_placeholder")}
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.inputText}
              />
            </View>

            {error && (
              <AppText style={styles.errorText}>
                {t(error as string)}
              </AppText>
            )}

            <Pressable onPress={handleSendEmail} disabled={isLoading} style={styles.primaryBtn}>
              <LinearGradient colors={["#1D4ED8", "#7C3AED"]} style={styles.primaryBtnGradient}>
                {isLoading ? <ActivityIndicator color="#fff" /> : (
                  <AppText weight="extraBold" style={styles.primaryBtnText}>
                    {t("forgotPassword.send_button")}
                  </AppText>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable onPress={() => {
              dispatch(setError(null));
              router.back();
            }} style={styles.backButtonWrapper}>
              <AppText style={styles.bottomLink}>{t("common.back")}</AppText>
            </Pressable>

          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}