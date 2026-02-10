import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';
import { getOnboardingSlides, OnboardingSlide } from '../../../data/onBoardingData';
// @ts-ignore
import { styles } from './onboardingScreen.styles';

export const OnboardingScreen: React.FC = () => {
    const { t } = useTranslation();
    const slides: OnboardingSlide[] = getOnboardingSlides(t);

    const renderItem = ({ item }: { item: OnboardingSlide }) => (
        <View style={styles.slideContainer}>
            <Feather name={item.icon} size={24} color="black" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
      );

    return (
        <FlatList
            data={slides}
            renderItem={renderItem}
            horizontal
            pagingEnabled
        />
    );
};