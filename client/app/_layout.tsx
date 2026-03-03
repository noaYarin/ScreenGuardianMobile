import React, { useEffect, useState } from "react";
import { Stack, router } from "expo-router";
import { I18nextProvider, useTranslation } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { Pressable, View, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { COLORS } from "@/constants/theme";
import store from "../src/redux/store";

import i18n, { initLanguage } from "../src/locales/i18n";

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

        // ✅ ברירת מחדל: אין כלום
        let headerLeft: (() => React.ReactNode) | undefined = () => null;
        let headerRight: (() => React.ReactNode) | undefined = () => null;

        // ✅ החץ שלנו בצד הנכון
        if (shouldShowBack) {
          if (isRTL) headerRight = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
          else headerLeft = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
        }

        return {
          contentStyle: { backgroundColor: COLORS.light.background },
          headerStyle: { backgroundColor: COLORS.light.tint },
          headerTitleAlign: "center",
          headerShadowVisible: false,

          // ✅ מבטל את החץ המובנה של react-navigation
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
  const [ready, setReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await initLanguage();
        if (mounted) setReady(true);
      } catch (e: any) {
        console.error("initLanguage failed:", e);
        if (mounted) {
          setInitError(e?.message ?? "initLanguage failed");
          // כדי לא לתקוע את האפליקציה – נמשיך בכל מקרה
          setReady(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ מסך טעינה קצר במקום "Bundling..." שנתקע
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
        {/* אם תרצי לראות שגיאה בדף בעת פיתוח */}
        {/* {initError ? <Text>{initError}</Text> : null} */}
      </I18nextProvider>
    </ReduxProvider>
  );
}