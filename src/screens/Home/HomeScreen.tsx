import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './HomeScreen.styles';

import { LanguageToggle } from '../../components/LanguageToggle';
import type { SupportedLanguage } from '../../locales/i18n';
import { setLanguage } from '../../store/settingsSlice';


export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentLang = useSelector(
    (state: any) => state.settings.language as SupportedLanguage,
  );

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = currentLang === 'en' ? 'he' : 'en';
    dispatch(setLanguage(nextLang));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('dashboard.title')}</Text>
      <Text style={styles.subtitle}>{t('alerts.time_up')}</Text>

      <View style={styles.buttonRow}>
        <LanguageToggle
          currentLanguage={currentLang}
          onToggle={toggleLanguage}
        />
      </View>
      
    </View>
  );
};
