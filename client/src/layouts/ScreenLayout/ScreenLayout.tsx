import React from "react";
import { SafeAreaView, View, ScrollView, Platform } from "react-native";
import { styles } from "./styles";

type Props = {
  children: React.ReactNode;
};

export default function ScreenLayout({ children }: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, Platform.OS === "web" && styles.webFrame]}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}