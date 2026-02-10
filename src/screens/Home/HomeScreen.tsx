import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { LanguageToggle } from '../../components/LanguageToggle';
import type { SupportedLanguage } from '../../locales/i18n';
import { setLanguage } from '../../store/settingsSlice';
import { styles } from './HomeScreen.styles';

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const currentLang = useSelector(
    (state: any) => state.settings.language as SupportedLanguage,
  );

  const toggleLanguage = () => {
    const nextLang: SupportedLanguage = currentLang === 'en' ? 'he' : 'en';
    dispatch(setLanguage(nextLang));
  };

  const handleStartOnboarding = () => {
    router.replace('/onboardingRoute');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/homeImg.png')}
        style={styles.homeImg}
      />
      <Text style={styles.title}>{t('app_name')}</Text>

      <View style={styles.buttonRow}>
        <LanguageToggle
          currentLanguage={currentLang}
          onToggle={toggleLanguage}
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleStartOnboarding}
        >
          <Text style={styles.buttonText}>
            {t('common.start', 'Start')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

