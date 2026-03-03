import React from "react";
import { Stack, router } from "expo-router";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { COLORS } from "@/constants/theme";
import i18n from "../src/locales/i18n";
import store from "../src/redux/store";

function BackBtn({ isRTL, canGoBack }: { isRTL: boolean; canGoBack: boolean }) {
  const iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    isRTL ? "arrow-right" : "arrow-left";

  const onPress = () => {
    if (canGoBack) router.back();
    else router.replace("/roleSelectionRoute" as any);
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={10}
      style={({ pressed }) => [{ padding: 8, opacity: pressed ? 0.65 : 1 }]}
    >
      <MaterialCommunityIcons name={iconName} size={22} color="#000" />
    </Pressable>
  );
}

function AppStack() {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl" || i18n.language?.startsWith("he");

  return (
    <Stack
      screenOptions={({ navigation, route }) => {
        const canGoBack = navigation.canGoBack();
        const shouldShowBack = route.name !== "index";

        // ✅ מאפסים תמיד כדי שלא יופיע שום כפתור מובנה
        let headerLeft: (() => React.ReactNode) | undefined = () => null;
        let headerRight: (() => React.ReactNode) | undefined = () => null;

        // ✅ מדליקים רק את שלנו בצד הנכון
        if (shouldShowBack) {
          if (isRTL) {
            headerRight = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
          } else {
            headerLeft = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
          }
        }

        return {
          contentStyle: { backgroundColor: COLORS.light.background },
          headerStyle: { backgroundColor: COLORS.light.tint },
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ מבטל את החץ המובנה
          headerBackVisible: false,

          headerLeft,
          headerRight,
        };
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboardingRoute" options={{ headerTitle: "" }} />
      <Stack.Screen name="roleSelectionRoute" options={{ headerTitle: "" }} />

    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppStack />
      </I18nextProvider>
    </ReduxProvider>
  );
}