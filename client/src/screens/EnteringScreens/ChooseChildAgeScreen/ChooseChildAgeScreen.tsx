import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

const MIN_AGE = 6;
const MAX_AGE = 17;
const DEFAULT_AGE = 10;

export default function ChooseChildAgeScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [selectedAge, setSelectedAge] = useState<number>(DEFAULT_AGE);

  const isTablet = width >= 900;
  const isWide = width >= 700;

  const ageHintKey = useMemo(() => {
    if (selectedAge <= 8) return "chooseChildAge.ageGroup.young";
    if (selectedAge <= 12) return "chooseChildAge.ageGroup.middle";
    return "chooseChildAge.ageGroup.teen";
  }, [selectedAge]);

  const canDecrease = selectedAge > MIN_AGE;
  const canIncrease = selectedAge < MAX_AGE;

  function handleDecrease() {
    if (!canDecrease) return;
    setSelectedAge((prev) => Math.max(MIN_AGE, prev - 1));
  }

  function handleIncrease() {
    if (!canIncrease) return;
    setSelectedAge((prev) => Math.min(MAX_AGE, prev + 1));
  }

  function handleContinue() {

    router.replace("/Entering/roleSelectionRoute" as any);
  }

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            isTablet && styles.containerTablet,
          ]}
        >
          <View style={styles.heroCard}>

            <AppText weight="extraBold" style={[styles.title]}>
              {t("chooseChildAge.heading")}
            </AppText>

            <View
              style={[
                styles.selectorCard,
                isWide && styles.selectorCardWide,
              ]}
            >
              <View style={[styles.controlsRow, row]}>
                <Pressable
                  onPress={handleDecrease}
                  disabled={!canDecrease}
                  accessibilityRole="button"
                  accessibilityLabel={t("chooseChildAge.decrease_a11y")}
                  style={[
                    styles.stepButton,
                    !canDecrease && styles.stepButtonDisabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="minus"
                    size={26}
                    color={canDecrease ? "#243447" : "#A6B0BF"}
                  />
                </Pressable>

                <View style={styles.ageCenter}>
                  <View style={styles.ageCircle}>
                    <AppText weight="extraBold" style={styles.ageNumber}>
                      {selectedAge}
                    </AppText>
                  </View>

                  <AppText weight="bold" style={[styles.ageLabel, text]}>
                    {t("chooseChildAge.selectedAgeLabel")}
                  </AppText>

                </View>

                <Pressable
                  onPress={handleIncrease}
                  disabled={!canIncrease}
                  accessibilityRole="button"
                  accessibilityLabel={t("chooseChildAge.increase_a11y")}
                  style={[
                    styles.stepButton,
                    !canIncrease && styles.stepButtonDisabled,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="plus"
                    size={26}
                    color={canIncrease ? "#243447" : "#A6B0BF"}
                  />
                </Pressable>
              </View>

              <View style={styles.rangeCard}>
                <View
                  style={[
                    styles.rangeHeaderRow,
                    row,
                  ]}
                >
                  <AppText weight="bold" style={[styles.rangeTitle, text]}>
                    {t("chooseChildAge.rangeTitle")}
                  </AppText>

                  <AppText weight="medium" style={[styles.rangeValue, text]}>
                    {t("chooseChildAge.rangeValue", {
                      min: MIN_AGE,
                      max: MAX_AGE,
                    })}
                  </AppText>
                </View>

                <View style={styles.track}>
                  <View
                    style={[
                      styles.trackFill,
                      {
                        width: `${
                          ((selectedAge - MIN_AGE) / (MAX_AGE - MIN_AGE)) * 100
                        }%`,
                        ...(isRTL ? { right: 0 } : { left: 0 }),
                      },
                    ]}
                  />
                </View>

                <View style={[styles.trackLabelsRow, row]}>
                  <AppText weight="medium" style={styles.trackEdgeLabel}>
                    {MIN_AGE}
                  </AppText>
                  <AppText weight="medium" style={styles.trackEdgeLabel}>
                    {MAX_AGE}
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel={t("chooseChildAge.continue_a11y")}
            style={styles.continueButton}
          >
            <AppText weight="bold" style={styles.continueButtonText}>
              {t("chooseChildAge.continue")}
            </AppText>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}