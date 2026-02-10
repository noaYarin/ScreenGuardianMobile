import { createSlice } from '@reduxjs/toolkit';
import i18n from '../locales/i18n';
import { I18nManager, Platform } from 'react-native';

const initialState = {
  language: 'he',
};

const applyLayoutDirection = (language) => {
  const isHebrew = language === 'he';

  if (I18nManager.isRTL !== isHebrew) {
    I18nManager.allowRTL(isHebrew);
    I18nManager.forceRTL(isHebrew);

    if (Platform.OS !== 'web') {
      console.log(
        '[settingsSlice] Language changed. Please reload the app to fully apply RTL/LTR layout.',
      );
    }
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action) {
      const newLanguage = action.payload;

      state.language = newLanguage;

      applyLayoutDirection(newLanguage);
      i18n.changeLanguage(newLanguage);
    },
  },
});

export const { setLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;

