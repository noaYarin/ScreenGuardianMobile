import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';

import i18n from '../src/locales/i18n';
import store from '../src/store';

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
        </Stack>
      </I18nextProvider>
    </ReduxProvider>
  );
}