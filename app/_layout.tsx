import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';

import { COLORS } from '@/constants/theme';
import i18n from '../src/locales/i18n';
import store from '../src/store';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <Stack screenOptions={{
    contentStyle: { backgroundColor: COLORS.light.background }, 
    headerStyle: { backgroundColor: COLORS.light.tint }, 
  }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </I18nextProvider>
    </ReduxProvider>
  );
}