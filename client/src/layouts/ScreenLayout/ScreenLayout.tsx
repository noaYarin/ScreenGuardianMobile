import React from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./styles";

export default function ScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.inner}>{children}</View>
    </ScrollView>
  );
}