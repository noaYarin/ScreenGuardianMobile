import React from "react";
import { Tabs, router } from "expo-router";
import { Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

const TAB_ROUTES = new Set(["home", "kids", "limits", "reports", "settings"]);

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

export default function ParentLayout() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("he") ?? false;

  return (
    <Tabs
      screenOptions={({ navigation, route }) => {
        const canGoBack = navigation.canGoBack();

        // ✅ visible tabs: no back button
        const isTopTab = TAB_ROUTES.has(route.name);

        let headerLeft: (() => React.ReactNode) | undefined = () => null;
        let headerRight: (() => React.ReactNode) | undefined = () => null;

        if (!isTopTab) {
          // ✅ hidden/internal parent screens: show back
          if (isRTL) headerRight = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
          else headerLeft = () => <BackBtn isRTL={isRTL} canGoBack={canGoBack} />;
        }

        // ✅ header title: tabs use translations
        const title =
          route.name === "home"
            ? t("homeParent.title")
            : TAB_ROUTES.has(route.name)
            ? t(`tabs.${route.name}`)
            : undefined;

        return {
          // Header (like your global one)
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.light.tint },
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false, // we use our own BackBtn
          headerLeft,
          headerRight,
          title,

          // Tab bar
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: "#E7EFFA",
            backgroundColor: "#FFFFFF",
          },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarActiveTintColor: COLORS.light.primary,
          tabBarInactiveTintColor: COLORS.light.tabIconDefault,
        };
      }}
    >
      {/* ✅ Tabs visible */}
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="kids"
        options={{
          tabBarLabel: t("tabs.kids"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="limits"
        options={{
          tabBarLabel: t("tabs.limits"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clock-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          tabBarLabel: t("tabs.reports"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: t("tabs.settings"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ✅ Hidden internal screens (NOT in tab bar) - examples */}
      <Tabs.Screen name="addChild" options={{ href: null, title: isRTL ? "הוספת ילד" : "Add child" }} />
      <Tabs.Screen name="kidDetails" options={{ href: null, title: isRTL ? "פרטי ילד" : "Kid details" }} />
    </Tabs>
  );
}