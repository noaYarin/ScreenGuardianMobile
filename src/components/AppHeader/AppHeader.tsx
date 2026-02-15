import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles";

type Props = {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export default function AppHeader({ title, left, right }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.sideLeft}>{left}</View>

      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
      </View>

      <View style={styles.sideRight}>{right}</View>
    </View>
  );
}
