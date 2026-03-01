import * as Localization from "expo-localization";
import * as Updates from "expo-updates";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager, Platform } from "react-native";

import en from "./en.json";
import he from "./he.json";

const resources = {
  en: { translation: en },
  he: { translation: he },
};

export type SupportedLanguage = keyof typeof resources;

const FALLBACK_LANG: SupportedLanguage = "en";

const getDeviceLanguage = (): SupportedLanguage => {
  const locale = Localization.getLocales()[0]?.languageCode?.toLowerCase();

  if (locale && Object.prototype.hasOwnProperty.call(resources, locale)) {
    return locale as SupportedLanguage;
  }

  // אם המכשיר כבר RTL, נתחיל בעברית
  if (I18nManager.isRTL) {
    return "he";
  }

  return FALLBACK_LANG;
};

const initialLanguage = getDeviceLanguage();

/**
 * מפעיל/מכבה RTL לפי שפה.
 * מחזיר true אם נעשה שינוי שדורש reload.
 */
const applyRTL = (lang: SupportedLanguage): boolean => {
  const shouldBeRTL = lang === "he";
  const needsChange = I18nManager.isRTL !== shouldBeRTL;

  if (!needsChange) return false;

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);

  return true;
};

// מיישמים RTL באתחול (אם צריך)
const rtlChangedOnInit = applyRTL(initialLanguage);

// Init i18n
i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: FALLBACK_LANG,
  interpolation: {
    escapeValue: false,
  },
});

// אם באתחול היה שינוי RTL — צריך reload בנייטיב
if (rtlChangedOnInit && Platform.OS !== "web") {
  void Updates.reloadAsync();
}

/**
 * שינוי שפה + RTL/LTR (עם reload בנייטיב אם צריך)
 */
export const changeLanguage = async (lang: SupportedLanguage) => {
  // קודם נשנה את השפה של i18n כדי שהטקסטים יתעדכנו
  await i18n.changeLanguage(lang);

  // עכשיו נטפל בכיוון
  const rtlChanged = applyRTL(lang);

  // אם הכיוון השתנה — חייבים reload בנייטיב
  if (rtlChanged && Platform.OS !== "web") {
    await Updates.reloadAsync();
  }
};

export default i18n;