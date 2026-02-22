import React, { ReactNode, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { COLORS } from '../../../constants/theme';
import { roleCardStyles as styles } from './rolecard.styles';

type RoleCardProps = {
  title: string;
  icon: ReactNode;
  onPress: () => void;
  backgroundColor: string;
  containerStyle?: StyleProp<ViewStyle>;
  description: string;
};

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  icon,
  onPress,
  backgroundColor,
  containerStyle,
  description,
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={title}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor,
            borderColor: pressed ? COLORS.light.icon : 'transparent',
            transform: [{ scale }],
          },
          containerStyle,
        ]}
      >
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </Pressable>
  );
};

