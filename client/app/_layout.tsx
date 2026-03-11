import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { Pressable, View, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";
import store from "../src/redux/store";

import i18n, { initLanguage } from "../src/locales/i18n";


function AppStack() {
  const { i18n } = useTranslation();

  const isRTL = i18n.language?.startsWith("he") ?? false;

  return (
    <Stack
      screenOptions={() => {

        return {
          contentStyle: { backgroundColor: COLORS.light.background },
          headerStyle: {
            backgroundColor: COLORS.light.tint,
          },
          headerTitleAlign: "center",
          headerShadowVisible: false,
        };
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Parent" options={{ headerShown: true, title: "", headerShadowVisible: false }} />
      <Stack.Screen name="Child" options={{ headerShown: true, title: "", headerShadowVisible: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await initLanguage();
        if (mounted) setReady(true);
      } catch (e: any) {
        console.error("initLanguage failed:", e);
        }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.light.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppStack />
      </I18nextProvider>
    </ReduxProvider>
  );
}