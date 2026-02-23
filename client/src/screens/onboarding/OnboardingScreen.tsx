import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, View } from 'react-native';

import { SIZES } from '../../../constants/theme';
import { getOnboardingSlides, OnboardingSlide } from '../../../data/onBoardingData';
import { useTranslation } from '../../../hooks/use-translation';
import { styles } from './onboarding.styles';

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const slides: OnboardingSlide[] = getOnboardingSlides(t);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStartUsingApp = () => {
    router.replace('/roleSelectionRoute' as any);
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SIZES.width);
    setCurrentIndex(index);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: OnboardingSlide;
    index: number;
  }) => {
    const isLast = index === slides.length - 1;

    return (
      <View style={styles.slideContainer}>
        <Feather name={item.icon} size={24} color="black" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {isLast && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartUsingApp}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>
              {t('dashboard.start')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.stepsContainer}>
        {slides.map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <View
              key={index}
              style={[
                styles.stepDot,
                isActive && styles.stepDotActive,
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};