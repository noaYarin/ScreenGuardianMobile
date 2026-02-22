import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';

import en from './en.json';
import he from './he.json';

const resources = {
  en: { translation: en },
  he: { translation: he },
};

export type SupportedLanguage = keyof typeof resources;

const FALLBACK_LANG: SupportedLanguage = 'en';

const getDeviceLanguage = (): SupportedLanguage => {
  const locale = Localization.getLocales()[0]?.languageCode?.toLowerCase();

  if (locale && Object.prototype.hasOwnProperty.call(resources, locale)) {
    return locale as SupportedLanguage;
  }

  if (I18nManager.isRTL) {
    return 'he';
  }

  return FALLBACK_LANG;
};

const initialLanguage = getDeviceLanguage();

const isHebrew = initialLanguage === 'he';
if (I18nManager.isRTL !== isHebrew) {
  I18nManager.allowRTL(isHebrew);
  I18nManager.forceRTL(isHebrew);

  if (Platform.OS !== 'web') {
    console.log(
      '[i18n] RTL configuration changed. Please reload the app to apply layout direction.',
    );
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: FALLBACK_LANG,
    interpolation: {
      escapeValue: false, 
    },
  });

export const changeLanguage = (lang: SupportedLanguage) => {
  const isHeb = lang === 'he';

  if (I18nManager.isRTL !== isHeb) {
    I18nManager.allowRTL(isHeb);
    I18nManager.forceRTL(isHeb);

    if (Platform.OS !== 'web') {
      console.log(
        '[i18n] Language changed. Please reload the app to fully apply RTL/LTR layout.',
      );
    }
  }

  return i18n.changeLanguage(lang);
};

export default i18n;

