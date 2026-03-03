import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";

import { OnboardingButton } from "../../../components/OnboardingButton";
import { COLORS, SIZES } from "../../../../constants/theme";
import {
  getOnboardingSlides,
  OnboardingSlide,
} from "../../../../data/onBoardingData";
import { useTranslation } from "../../../../hooks/use-translation";
import { styles } from "./onboarding.styles";

export const OnboardingScreen: React.FC = () => {
  const router = useRouter();

  // ✅ עכשיו ה-hook מחזיר גם changeLanguage + currentLanguage
  const { t, changeLanguage, currentLanguage, isRTL } = useTranslation();

  // ✅ נבנה מתוך t כדי שיתעדכן אוטומטית כששפה משתנה
  const slides: OnboardingSlide[] = getOnboardingSlides(t);

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingSlide> | null>(null);

  const goToRoleSelection = () => {
    router.replace("Entering/roleSelectionRoute" as any);
  };

  const handleStartUsingApp = () => {
    goToRoleSelection();
  };

  const handleSkipOnboarding = () => {
    goToRoleSelection();
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < slides.length) {
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SIZES.width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    return (
      <>
        <Text style={styles.link} onPress={handleSkipOnboarding}>
          {t("dashboard.skip")}
        </Text>

        <View style={styles.slideContainer}>
          <View style={styles.iconContainer}>
            <Feather name={item.icon} size={40} color={COLORS.light.background} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          {item.image && <Image source={item.image} style={styles.image} />}
        </View>
      </>
    );
  };

  return (
    <View style={styles.safeArea}>
      {/* ✅ בחירת שפה בטוחה (משמרת + משנה גלובלי) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
          marginTop: 8,
          marginBottom: 6,
        }}
      >
        <Pressable
          onPress={() => changeLanguage("he")}
          accessibilityRole="button"
          accessibilityLabel="עברית"
          style={({ pressed }) => [
            {
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              opacity: pressed ? 0.65 : 1,
              backgroundColor: currentLanguage === "he" ? "#E6F0FF" : "transparent",
              borderWidth: 1,
              borderColor: "#C9D9FF",
            },
          ]}
        >
          <Text style={{ fontSize: 14, color: "#1B2B3A" }}>עברית</Text>
        </Pressable>

        <Pressable
          onPress={() => changeLanguage("en")}
          accessibilityRole="button"
          accessibilityLabel="English"
          style={({ pressed }) => [
            {
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              opacity: pressed ? 0.65 : 1,
              backgroundColor: currentLanguage === "en" ? "#E6F0FF" : "transparent",
              borderWidth: 1,
              borderColor: "#C9D9FF",
            },
          ]}
        >
          <Text style={{ fontSize: 14, color: "#1B2B3A" }}>English</Text>
        </Pressable>

        {/* אופציונלי: אינדיקציה ל-RTL (אפשר למחוק) */}
        <Text style={{ fontSize: 12, color: "#6B7A88" }}>
          {isRTL ? "RTL" : "LTR"}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
      />

      <View style={styles.footerContainer}>
        <View style={styles.stepsContainer}>
          {slides.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <View
                key={index}
                style={[styles.stepDot, isActive && styles.stepDotActive]}
              />
            );
          })}
        </View>

        <OnboardingButton
          label={
            currentIndex < slides.length - 1
              ? t("dashboard.next")
              : t("dashboard.start")
          }
          onPress={currentIndex < slides.length - 1 ? handleNext : handleStartUsingApp}
          containerStyle={styles.startButton}
          textStyle={styles.startButtonText}
        />
      </View>
    </View>
  );
};