import { useCallback } from "react";
import { useTranslation as useI18NextTranslation } from "react-i18next";
import i18n, { changeLanguage, type SupportedLanguage } from "../src/locales/i18n";

export const useTranslation = () => {
  const { t } = useI18NextTranslation();

  const currentLanguage = (i18n.language as SupportedLanguage) || "en";
  const isRTL = currentLanguage === "he";

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    changeLanguage(lang);
  }, []);

  return {
    t,
    currentLanguage,
    isRTL,
    changeLanguage: setLanguage,
  };
};