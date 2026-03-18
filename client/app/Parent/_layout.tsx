import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";
import { useTranslation } from "react-i18next";
import { COLORS } from "@/constants/theme";

export default function ParentRootLayout() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.startsWith("he") ?? false;

  return (
    <Stack
      screenOptions={({ navigation }) => ({
        headerTitleAlign: "center",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: COLORS.light.background,
        },
        headerStyle: {
          backgroundColor: COLORS.light.tint,
        },

        ...(isRTL
          ? {
              headerBackVisible: false,
              headerLeft: () => null,
              headerRight: (props) =>
                navigation.canGoBack() ? (
                  <View style={{ transform: [{ scaleX: -1 }] }}>
                    <HeaderBackButton {...props} onPress={navigation.goBack} />
                  </View>
                ) : null,
            }
          : {
              headerBackVisible: true,
            }),
      })}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="addChild"
        options={{
          title: isRTL ? "הוספת ילד" : "Add Child",
        }}
      />

      <Stack.Screen
        name="kidDetails"
        options={{
          title: isRTL ? "פרטי ילד" : "Kid Details",
        }}
      />

      <Stack.Screen
        name="childProfile"
        options={{
          title: isRTL ? "פרופיל ילד" : "Child Profile",
        }}
      />
    </Stack>
  );
}