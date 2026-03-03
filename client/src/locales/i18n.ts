import * as Localization from "expo-localization";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const STORAGE_KEY = "app_lang";

/** שפת מכשיר כברירת מחדל (רק אם אין שמירה) */
const getDeviceLanguage = (): SupportedLanguage => {
  const locale = Localization.getLocales()[0]?.languageCode?.toLowerCase();

  if (locale && Object.prototype.hasOwnProperty.call(resources, locale)) {
    return locale as SupportedLanguage;
  }

  // אם המכשיר כבר RTL, נתחיל בעברית
  if (I18nManager.isRTL) return "he";

  return FALLBACK_LANG;
};

/** מפעיל/מכבה RTL לפי שפה. מחזיר true אם צריך reload בנייטיב */
const applyRTL = (lang: SupportedLanguage): boolean => {
  const shouldBeRTL = lang === "he";
  const needsChange = I18nManager.isRTL !== shouldBeRTL;

  if (!needsChange) return false;

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);

  return true;
};

/** קורא שפה שמורה (אם קיימת) */
export const getStoredLanguage = async (): Promise<SupportedLanguage | null> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved === "he" || saved === "en") return saved;
    return null;
  } catch {
    return null;
  }
};

/** שומר + משנה שפה + RTL + reload (אם צריך) */
export const changeLanguage = async (lang: SupportedLanguage) => {
  // 1) שמירה
  try {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }

  // 2) שינוי שפה ל-i18next
  await i18n.changeLanguage(lang);

  // 3) טיפול RTL/LTR
  const rtlChanged = applyRTL(lang);

  // 4) אם הכיוון השתנה — חייבים reload בנייטיב
  if (rtlChanged && Platform.OS !== "web") {
    await Updates.reloadAsync();
  }
};

/** אתחול בטוח: בוחר שפה שמורה אם יש, אחרת שפת מכשיר */
export const initLanguage = async () => {
  const saved = await getStoredLanguage();
  const lang = saved ?? getDeviceLanguage();

  // RTL באתחול (אם צריך)
  const rtlChangedOnInit = applyRTL(lang);

  // init i18n
  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: FALLBACK_LANG,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

  if (rtlChangedOnInit && Platform.OS !== "web") {
    await Updates.reloadAsync();
  }
};

export default i18n;