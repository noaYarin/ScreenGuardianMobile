import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";

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
              color: "#1E3A8A",
              fontFamily: "Heebo_700Bold",
              fontSize: 20,
            },

            // צבע חץ ואייקונים ב-header
            headerTintColor: "#1E3A8A",

            // ✅ מסתיר את הטקסט של ה-Back (במקום headerBackTitleVisible שלא קיים)
            headerBackTitle: "",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </I18nextProvider>
    </ReduxProvider>
  );
}