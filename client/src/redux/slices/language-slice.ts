import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { I18nManager, Platform } from 'react-native';

import type { SupportedLanguage } from '../../locales/i18n';
import { changeLanguage } from '../../locales/i18n';

export interface LanguageState {
  currentLanguage: SupportedLanguage;
}

const initialState: LanguageState = {
  currentLanguage: 'he',
};

const applyLayoutDirection = (language: SupportedLanguage) => {
  const isHebrew = language === 'he';

  if (I18nManager.isRTL !== isHebrew) {
    I18nManager.allowRTL(isHebrew);
    I18nManager.forceRTL(isHebrew);

    if (Platform.OS !== 'web') {
      console.log(
        '[language-slice] Language changed. Please reload the app to fully apply RTL/LTR layout.',
      );
    }
  }
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      const newLanguage = action.payload;
      state.currentLanguage = newLanguage;

      applyLayoutDirection(newLanguage);
      changeLanguage(newLanguage);
    },
  },
});

export const { setLanguage } = languageSlice.actions;

export default languageSlice.reducer;

