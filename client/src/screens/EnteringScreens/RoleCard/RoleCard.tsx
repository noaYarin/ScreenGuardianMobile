import React, { useRef, useState } from 'react';
import {
  Animated,
  ImageSourcePropType,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { roleCardStyles as styles } from './rolecard.styles';

type RoleCardProps = {
  title: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  backgroundColor: string;
  avatarCircleBackground: string;
  containerStyle?: StyleProp<ViewStyle>;
  description: string;

  // ✅ נגישות (לא חובה – כדי לא לשבור שימושים קיימים)
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  imageSource,
  onPress,
  backgroundColor,
  avatarCircleBackground,
  containerStyle,
  description,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      friction: 6,
      tension: 80,
    }).start();
  };

  const handlePressIn = () => {
    setPressed(true);
    animateTo(0.95);
  };

  const handlePressOut = () => {
    animateTo(1);
    setPressed(false);
  };

  const a11yLabel = accessibilityLabel ?? title;
  const a11yHint = accessibilityHint ?? description;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint={a11yHint}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            borderWidth: 0,
            transform: [{ scale }],
            opacity: pressed ? 0.98 : 1,
          },
          containerStyle,
        ]}
      >
        <View style={[styles.imageContainer, { backgroundColor: avatarCircleBackground }]}>
          <Image source={imageSource} style={styles.image} />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </Pressable>
  );
};