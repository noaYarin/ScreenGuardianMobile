import { useSelector } from 'react-redux';

import en from '../locales/en.json';
import he from '../locales/he.json';
import type { SupportedLanguage } from '../locales/i18n';

const translations: Record<SupportedLanguage, typeof en> = {
  en,
  he,
};

const resolvePath = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj as any);
};

export const useTranslation = () => {
  const currentLanguage = useSelector(
    (state: any) => state.language.currentLanguage as SupportedLanguage,
  );

  const t = (key: string): string => {
    const langBundle = translations[currentLanguage] || translations.en;
    const value = resolvePath(langBundle, key);
    if (typeof value === 'string') {
      return value;
    }
    return key;
  };

  const isRTL = currentLanguage === 'he';

  return {
    t,
    currentLanguage,
    isRTL,
  };
};

