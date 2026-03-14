import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import { HeaderBackButton } from "@react-navigation/elements";

import { COLORS } from "@/constants/theme";
import store from "../src/redux/store";

import i18n, { initLanguage } from "../src/locales/i18n";

function AppStack() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("he") ?? false;

  return (
    <Stack
    // header options
      screenOptions={({ navigation }) =>
        ({
          contentStyle: { backgroundColor: COLORS.light.background },
          headerStyle: {
            backgroundColor: COLORS.light.tint,
          },
          headerTitleAlign: "center",
          headerDirection: isRTL ? "rtl" : "ltr",
          ...(isRTL
            ? {
                headerBackVisible: false,
                headerLeft: () => null,
                headerRight: (props: any) =>
                  navigation.canGoBack() ? (
                    <View style={{ transform: [{ scaleX: -1 }] }}>
                      <HeaderBackButton
                        {...props}
                        onPress={navigation.goBack}
                      />
                    </View>
                  ) : null,
              }
            : {
              // default back button
                headerBackVisible: true,
              }),
        } as any)
      }
    >
      <Stack.Screen name="index" options={{ headerShown: false}} />
      <Stack.Screen name="Parent" options={{ headerShown: false, title: "", headerShadowVisible: false }} />
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
          <ActivityIndicator size="large" color={COLORS.light.tint} />
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