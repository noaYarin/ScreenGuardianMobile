import React from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
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
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}