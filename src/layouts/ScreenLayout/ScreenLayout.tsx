import React from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import AppHeader from "../../components/AppHeader/AppHeader";
import { styles } from "./styles";

type Props = {
  title: string;
  children: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
};

export default function ScreenLayout({ title, children, headerLeft, headerRight }: Props) {
  return (
    <SafeAreaView style={styles.page}>
      <AppHeader title={title} left={headerLeft} right={headerRight} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
