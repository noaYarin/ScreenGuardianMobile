import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";
import Constants from "expo-constants";

import en from "./en.json";
import he from "./he.json";

const resources = {
  en: { translation: en },
  he: { translation: he },
};

export type SupportedLanguage = keyof typeof resources;

const FALLBACK_LANG: SupportedLanguage = "en";

export const isRTLLanguage = (lang?: string) => (lang ?? i18n.language) === "he";

const isExpoGo = () => Constants.appOwnership === "expo";

const applyRTLNative = (lang: SupportedLanguage): boolean => {
  const shouldBeRTL = lang === "he";
  const needsChange = I18nManager.isRTL !== shouldBeRTL;

  if (!needsChange) return false;

  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldBeRTL);

  return true;
};

const reloadNativeIfPossible = async () => {
  try {
    const Updates = await import("expo-updates");
    if (Updates?.reloadAsync) {
      await Updates.reloadAsync();
      return;
    }
  } catch {
    // ignore
  }
};

export const changeLanguage = async (lang: SupportedLanguage) => {
  await i18n.changeLanguage(lang);

  if (Platform.OS === "web") return;

  // Expo Go: do not force RTL or reload. UI should mirror via styles.
  if (isExpoGo()) return;

  // Dev build / production: apply system RTL and reload to take effect.
  const needsReload = applyRTLNative(lang);
  if (needsReload) {
    await reloadNativeIfPossible();
  }
};

export const initLanguage = async () => {
  const lang: SupportedLanguage = FALLBACK_LANG;

  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: FALLBACK_LANG,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  // Apply initial RTL only for real native builds (not Expo Go), before relying on system mirroring.
  if (Platform.OS !== "web" && !isExpoGo()) {
    applyRTLNative(lang);
  }
};

export default i18n;