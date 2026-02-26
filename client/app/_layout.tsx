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
            contentStyle: {
              backgroundColor: COLORS.light.background,
            },
            headerStyle: {
              backgroundColor: COLORS.light.tint,
            },
            headerTitleAlign: "center",
            headerTitleStyle: {
              color: "#1E3A8A",
              fontFamily: "Heebo_700Bold",
              fontSize: 20,
            },
            headerTintColor: "#1E3A8A",
            headerBackTitle: "",
          }}
        />
      </I18nextProvider>
    </ReduxProvider>
  );
}