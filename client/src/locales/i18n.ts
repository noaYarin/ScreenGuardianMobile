import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import en from "./en.json";
import he from "./he.json";

const resources = {
  en: { translation: en },
  he: { translation: he },
};

export type SupportedLanguage = keyof typeof resources;

const FALLBACK_LANG: SupportedLanguage = "en";

/** מפעיל/מכבה RTL לפי שפה. מחזיר true אם הכיוון השתנה */
const applyRTL = (lang: SupportedLanguage): boolean => {
  const shouldBeRTL = lang === "he";
  const needsChange = I18nManager.isRTL !== shouldBeRTL;

  if (!needsChange) return false;

  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);

  return true;
};

/** שינוי שפה (ללא שמירה וללא reload) */
export const changeLanguage = (lang: SupportedLanguage) => {
  applyRTL(lang);
  // i18next מחזיר Promise, אבל אין צורך לחכות בתוך reducer
  void i18n.changeLanguage(lang);
};

/** אתחול: תמיד מתחילים מ-FALLBACK_LANG (כי אין זיהוי מכשיר ואין שמירה) */
export const initLanguage = async () => {
  const lang: SupportedLanguage = FALLBACK_LANG;

  applyRTL(lang);

  await i18n.use(initReactI18next).init({
    resources,
    lng: lang,
    fallbackLng: FALLBACK_LANG,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
};

export default i18n;