import React from 'react';
import { Button } from 'react-native';

import type { SupportedLanguage } from '../locales/i18n';

export interface LanguageToggleProps {
  currentLanguage: SupportedLanguage;
  onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onToggle,
}) => {
  const label = currentLanguage === 'en' ? 'עברית' : 'English';

  return <Button title={label} onPress={onToggle} />;
};

