import React from "react";
import { SafeAreaView, View, ScrollView, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";

export default function ScreenLayout({ children }: { children: React.ReactNode }) {
  // This hook re-renders the component on language change
  const { i18n } = useTranslation();

  const rtl = i18n.resolvedLanguage === "he";

  return (
      <ScrollView>
        <View style={styles.inner}>{children}</View>
      </ScrollView>
  );
}