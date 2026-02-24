import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { Platform } from "react-native";

import { COLORS } from "@/constants/theme";
import i18n from "../src/locales/i18n";
import store from "../src/store";

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <Stack
          screenOptions={{
            // רקע כללי למסכים
            contentStyle: {
              backgroundColor: COLORS.light.background,
            },

            // רקע ה-Header
            headerStyle: {
              backgroundColor: COLORS.light.tint,
            },

            // כותרת באמצע
            headerTitleAlign: "center",

            // עיצוב טקסט הכותרת
            headerTitleStyle: {
              color: "#1E3A8A", // תשני לצבע שאת רוצה
              fontFamily: "Heebo_700Bold",
              fontSize: 20,
            },

            // צבע חץ ואייקונים ב-header
            headerTintColor: "#1E3A8A",

            // אם את רוצה שהחץ יהיה תמיד משמאל גם ב-RTL
            headerBackTitleVisible: false,
          
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />  
        </Stack>
      </I18nextProvider>
    </ReduxProvider>
  );
}