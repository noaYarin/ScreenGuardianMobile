import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  View,
  ScrollView,
  Pressable,
  Switch,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { logout, setError, setAuthLoading, logoutParent } from "../../../redux/slices/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthTokens } from "../../../services/authStorage";
type SettingRow = {
  key: string;
  titleKey: string;
  subtitleKey?: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: string;
};

export default function SettingsScreen() {
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { isRTL, row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();
  const isLoggingOut = useSelector((state: any) => state.auth.isLoading);
  const isTablet = width >= 900;
  const iconTextRow = {
    flexDirection: isRTL ? "row-reverse" : "row",
  } as const;

  const [appAlertsEnabled, setAppAlertsEnabled] = useState(true);
  const [locationAccessEnabled, setLocationAccessEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  const preferenceRows: SettingRow[] = useMemo(
    () => [
      {
        key: "privacy",
        titleKey: "settings.rows.privacy.title",
        subtitleKey: "settings.rows.privacy.subtitle",
        icon: "shield-check-outline",
        route: "/Parent/privacySettings",
      },
      {
        key: "help",
        titleKey: "settings.rows.help.title",
        subtitleKey: "settings.rows.help.subtitle",
        icon: "lifebuoy",
        route: "/Parent/helpSupport",
      },
    ],
    []
  );

  const onToggleLanguage = async () => {
    const nextLanguage = currentLanguage === "he" ? "en" : "he";
    await changeLanguage(nextLanguage);
  };

  const onPressLogout = async () => {
    dispatch(setAuthLoading(true));
    dispatch(setError(null));

    try {
      await (dispatch as any)(logoutParent()).unwrap();
    } catch (error) {
      const message = (error as Error)?.message ?? "settings.logout.failed";
      dispatch(setError(message));
      Alert.alert("", t(message));
    } finally {
      await clearAuthTokens();
      dispatch(logout());
      router.replace("/" as Href);
      dispatch(setAuthLoading(false));
    }
  };

  const onPressRow = (route?: string) => {
    if (!route) return;
    router.push(route as Href);
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isTablet && styles.containerTablet]}>
          <View style={styles.heroCard}>
            <View style={[styles.heroTopRow, row]}>
              <View style={styles.heroTextWrap}>
                <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                  {t("settings.heading")}
                </AppText>

                <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                  {t("settings.subtitle")}
                </AppText>
              </View>

              <View style={styles.heroIconBadge}>
                <MaterialCommunityIcons
                  name="cog-outline"
                  size={28}
                  color="#315AEF"
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeaderRow, row]}>
              <View style={styles.sectionHeaderIcon}>
                <MaterialCommunityIcons
                  name="translate"
                  size={22}
                  color="#315AEF"
                />
              </View>

              <View style={styles.sectionHeaderTextWrap}>
                <AppText weight="bold" style={[styles.sectionTitle, text]}>
                  {t("settings.language.title")}
                </AppText>

                <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                  {t("settings.language.subtitle")}
                </AppText>
              </View>
            </View>

            <Pressable
              onPress={onToggleLanguage}
              accessibilityRole="button"
              accessibilityLabel={t("settings.language.buttonA11y")}
              style={({ pressed }) => [
                styles.languageButton,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.languageButtonContent, row]}>
                <View style={[styles.languageButtonLeft, iconTextRow]}>
                  <View style={styles.languageActionIcon}>
                    <MaterialCommunityIcons
                      name="translate"
                      size={22}
                      color="#FFFFFF"
                    />
                  </View>

                  <View style={styles.languageTextWrap}>
                    <AppText
                      weight="bold"
                      style={[styles.languageButtonTitle, text]}
                    >
                      {t("settings.language.button")}
                    </AppText>

                    <AppText
                      weight="medium"
                      style={[styles.languageButtonSubtitle, text]}
                    >
                      {currentLanguage === "he"
                        ? t("settings.language.current.he")
                        : t("settings.language.current.en")}
                    </AppText>
                  </View>
                </View>

                <MaterialCommunityIcons
                  name={isRTL ? "chevron-left" : "chevron-right"}
                  size={24}
                  color="#7A8599"
                />
              </View>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeaderRow, row]}>
              <View style={styles.sectionHeaderIcon}>
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={22}
                  color="#315AEF"
                />
              </View>

              <View style={styles.sectionHeaderTextWrap}>
                <AppText weight="bold" style={[styles.sectionTitle, text]}>
                  {t("settings.notifications.title")}
                </AppText>

                <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                  {t("settings.notifications.subtitle")}
                </AppText>
              </View>
            </View>

            <View style={styles.switchList}>
              <View style={[styles.switchRow, row]}>
                <View style={[styles.switchTextWrap, isRTL && styles.switchTextWrapRtl]}>
                  <AppText weight="bold" style={[styles.switchTitle, text]}>
                    {t("settings.notifications.rows.appAlerts.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.switchSubtitle, text]}>
                    {t("settings.notifications.rows.appAlerts.subtitle")}
                  </AppText>
                </View>

                <Switch
                  value={appAlertsEnabled}
                  onValueChange={setAppAlertsEnabled}
                  accessibilityLabel={t("settings.notifications.rows.appAlerts.a11y")}
                  trackColor={{ false: "#D8DCE6", true: "#AFC1FF" }}
                  thumbColor={appAlertsEnabled ? "#315AEF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.divider} />

              <View style={[styles.switchRow, row]}>
                <View style={[styles.switchTextWrap, isRTL && styles.switchTextWrapRtl]}>
                  <AppText weight="bold" style={[styles.switchTitle, text]}>
                    {t("settings.notifications.rows.location.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.switchSubtitle, text]}>
                    {t("settings.notifications.rows.location.subtitle")}
                  </AppText>
                </View>

                <Switch
                  value={locationAccessEnabled}
                  onValueChange={setLocationAccessEnabled}
                  accessibilityLabel={t("settings.notifications.rows.location.a11y")}
                  trackColor={{ false: "#D8DCE6", true: "#AFC1FF" }}
                  thumbColor={locationAccessEnabled ? "#315AEF" : "#FFFFFF"}
                />
              </View>

              <View style={styles.divider} />

              <View style={[styles.switchRow, row]}>
                <View style={[styles.switchTextWrap, isRTL && styles.switchTextWrapRtl]}>
                  <AppText weight="bold" style={[styles.switchTitle, text]}>
                    {t("settings.notifications.rows.push.title")}
                  </AppText>

                  <AppText weight="medium" style={[styles.switchSubtitle, text]}>
                    {t("settings.notifications.rows.push.subtitle")}
                  </AppText>
                </View>

                <Switch
                  value={pushEnabled}
                  onValueChange={setPushEnabled}
                  accessibilityLabel={t("settings.notifications.rows.push.a11y")}
                  trackColor={{ false: "#D8DCE6", true: "#AFC1FF" }}
                  thumbColor={pushEnabled ? "#315AEF" : "#FFFFFF"}
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionCard}>
            <View style={[styles.sectionHeaderRow, row]}>
              <View style={styles.sectionHeaderIcon}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={22}
                  color="#315AEF"
                />
              </View>

              <View style={styles.sectionHeaderTextWrap}>
                <AppText weight="bold" style={[styles.sectionTitle, text]}>
                  {t("settings.preferences.title")}
                </AppText>

                <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                  {t("settings.preferences.subtitle")}
                </AppText>
              </View>
            </View>

            <View style={styles.rowsList}>
              {preferenceRows.map((item, index) => (
                <View key={item.key}>
                  <Pressable
                    onPress={() => onPressRow(item.route)}
                    accessibilityRole="button"
                    accessibilityLabel={t(`settings.rows.${item.key}.a11y`)}
                    style={({ pressed }) => [
                      styles.rowButton,
                      pressed && styles.pressed,
                    ]}
                  >
                    <View style={[styles.rowButtonContent, row]}>
                      <View style={[styles.rowMainSide, iconTextRow]}>
                        <View style={styles.rowIconBadge}>
                          <MaterialCommunityIcons
                            name={item.icon}
                            size={22}
                            color="#315AEF"
                          />
                        </View>

                        <View style={styles.rowTexts}>
                          <AppText weight="bold" style={[styles.rowTitle, text]}>
                            {t(item.titleKey)}
                          </AppText>

                          {!!item.subtitleKey && (
                            <AppText
                              weight="medium"
                              style={[styles.rowSubtitle, text]}
                            >
                              {t(item.subtitleKey)}
                            </AppText>
                          )}
                        </View>
                      </View>

                      <MaterialCommunityIcons
                        name={isRTL ? "chevron-left" : "chevron-right"}
                        size={24}
                        color="#98A2B3"
                      />
                    </View>
                  </Pressable>

                  {index !== preferenceRows.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          </View>

          <Pressable
            onPress={onPressLogout}
            disabled={isLoggingOut}
            accessibilityRole="button"
            accessibilityLabel={t("settings.logout.a11y")}
            style={({ pressed }) => [
              styles.logoutButton,
              !isLoggingOut && pressed && styles.logoutPressed,
              isLoggingOut ? { opacity: 0.7 } : null,
            ]}
          >
            <View style={[styles.logoutContent, row]}>
              <MaterialCommunityIcons name="logout" size={22} color="#FFFFFF" />
              <AppText weight="bold" style={styles.logoutText}>
                {t("settings.logout.button")}
              </AppText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}