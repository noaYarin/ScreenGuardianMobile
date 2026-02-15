import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  ariaLabel?: string;
  style?: ViewStyle;
  disabled?: boolean;
};

export default function IconButton({
  children,
  onPress,
  ariaLabel,
  style,
  disabled,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={ariaLabel}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      hitSlop={8}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.6,
  },
  disabled: {
    opacity: 0.35,
  },
});
