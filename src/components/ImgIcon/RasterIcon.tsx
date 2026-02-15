import React from "react";
import { Image, ImageSourcePropType, StyleSheet } from "react-native";

type Props = {
  source: ImageSourcePropType;
  size?: number;
  accessibilityLabel?: string;
};

export default function RasterIcon({ source, size = 24, accessibilityLabel }: Props) {
  return (
    <Image
      source={source}
      style={[styles.img, { width: size, height: size }]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    />
  );
}

const styles = StyleSheet.create({
  img: {
    resizeMode: "contain",
  },
});
