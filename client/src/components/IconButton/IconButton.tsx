import React from "react";
import { Pressable, Image, ImageSourcePropType, StyleSheet } from "react-native";

type Props = {
  source: ImageSourcePropType;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export default function IconButton({
  source,
  size = 22,
  onPress,
  accessibilityLabel,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size, resizeMode: "contain" }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
});