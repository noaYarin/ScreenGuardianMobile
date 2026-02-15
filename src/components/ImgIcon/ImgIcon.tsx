import React from "react";
import { Image, ImageSourcePropType } from "react-native";

type Props = {
  source: ImageSourcePropType;
  size?: number;
};

export default function ImgIcon({ source, size = 24 }: Props) {
  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
