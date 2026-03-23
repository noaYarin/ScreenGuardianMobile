import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions, Platform } from "react-native";
import { Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildSelector, {
  type ChildSelectorOption,
} from "../../../components/ChildSelector/ChildSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type GenderValue = "male" | "female" | "other";

type GenderOption = {
  key: GenderValue;
  labelKey: string;
};

const STATIC_CHILDREN: ChildSelectorOption[] = [
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#D96AD9",
    subtitleKey: "childSelector.defaultChildSubtitle",
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#6C8CFF",
    subtitleKey: "childSelector.defaultChildSubtitle",
  },
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#15C9A8",
    subtitleKey: "childSelector.defaultChildSubtitle",
  },
];

const GENDER_OPTIONS: GenderOption[] = [
  { key: "male", labelKey: "defineChildProfile.gender.options.male" },
  { key: "female", labelKey: "defineChildProfile.gender.options.female" },
  { key: "other", labelKey: "defineChildProfile.gender.options.other" },
];

function formatDateForDisplay(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default function DefineChildProfileScreen() {
const { t, currentLanguage } = useTranslation();
  const { width } = useWindowDimensions();
  const { text, isRTL, row } = useLocaleLayout();

  const isTablet = width >= 768;
  const isLargeTablet = width >= 1100;

  const [selectedChildId, setSelectedChildId] = useState(STATIC_CHILDREN[2].id);
  const [birthDate, setBirthDate] = useState<Date>(new Date(2016, 4, 12));
  const [gender, setGender] = useState<GenderValue>("female");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedChild = useMemo(
    () => STATIC_CHILDREN.find((child) => child.id === selectedChildId) ?? STATIC_CHILDREN[0],
    [selectedChildId]
  );

  const formattedBirthDate = useMemo(() => {
    const locale = currentLanguage === "he" ? "he-IL" : "en-US";
    return formatDateForDisplay(birthDate, locale);
  }, [birthDate, currentLanguage]);

  const handleSave = () => {
    console.log("Save child profile", {
      childId: selectedChildId,
      birthDate: birthDate.toISOString(),
      gender,
    });
  };
  return (
    <>

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.container,
              isTablet && styles.containerTablet,
              isLargeTablet && styles.containerLargeTablet,
            ]}
          >
            <ChildSelector
              childrenOptions={STATIC_CHILDREN}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
              //childCardWidth={isLargeTablet ? 180 : isTablet ? 160 : 136}
            />

            <View style={[styles.formGrid, isTablet && styles.formGridTablet]}>
              <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
                <View style={styles.sectionHeader}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("defineChildProfile.birthDate.title")}
                  </AppText>
                </View>

                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  accessibilityRole="button"
                  accessibilityLabel={t("defineChildProfile.accessibility.birthDate")}
                  style={({ pressed }) => [
                    styles.dateFieldButton,
                    pressed && styles.dateFieldButtonPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.dateFieldContent,
                      isRTL ? styles.dateFieldContentRtl : styles.dateFieldContentLtr,
                    ]}
                  >
                    <View style={[styles.dateFieldLeft, row]}>
                      <View style={styles.dateIconWrap}>
                        <AppText style={styles.dateIconEmoji}>📅</AppText>
                      </View>

                      <View style={styles.dateTextWrap}>
                        <AppText weight="medium" style={[styles.dateFieldLabel, text]}>
                          {t("defineChildProfile.birthDate.fieldLabel")}
                        </AppText>

                        <AppText weight="extraBold" style={[styles.dateFieldValue, text]}>
                          {formattedBirthDate}
                        </AppText>
                      </View>
                    </View>

                    <AppText weight="bold" style={styles.dateFieldChangeText}>
                      {t("defineChildProfile.birthDate.change")}
                    </AppText>
                  </View>
                </Pressable>

                {showDatePicker ? (
                  <DateTimePicker
                    value={birthDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      if (Platform.OS === "android") {
                        setShowDatePicker(false);
                      }

                      if (selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                  />
                ) : null}

                {Platform.OS === "ios" && showDatePicker ? (
                  <View style={styles.iosPickerFooter}>
                    <Pressable
                      onPress={() => setShowDatePicker(false)}
                      accessibilityRole="button"
                      accessibilityLabel={t("defineChildProfile.accessibility.confirmBirthDate")}
                      style={({ pressed }) => [
                        styles.iosPickerDoneButton,
                        pressed && styles.pressedSoft,
                      ]}
                    >
                      <AppText weight="bold" style={styles.iosPickerDoneText}>
                        {t("defineChildProfile.birthDate.done")}
                      </AppText>
                    </Pressable>
                  </View>
                ) : null}
              </View>

              <View style={[styles.sectionCard, isTablet && styles.sectionCardHalf]}>
                <View style={styles.sectionHeader}>
                  <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                    {t("defineChildProfile.gender.title")}
                  </AppText>
                </View>

                <View
                  style={[
                    styles.genderRow,
                    isRTL ? styles.genderRowRtl : styles.genderRowLtr,
                  ]}
                >
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = option.key === gender;

                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setGender(option.key)}
                        accessibilityRole="button"
                        accessibilityLabel={t(
                          "defineChildProfile.accessibility.genderOption",
                          {
                            gender: t(option.labelKey),
                          }
                        )}
                        style={({ pressed }) => [
                          styles.genderChip,
                          isSelected && styles.genderChipSelected,
                          pressed && styles.genderChipPressed,
                        ]}
                      >
                        <View
                          style={[
                            styles.genderIndicator,
                            isSelected && styles.genderIndicatorSelected,
                          ]}
                        >
                          {isSelected ? <View style={styles.genderIndicatorInner} /> : null}
                        </View>

                        <AppText
                          weight={isSelected ? "extraBold" : "medium"}
                          style={[
                            styles.genderChipText,
                            text,
                            isSelected && styles.genderChipTextSelected,
                          ]}
                        >
                          {t(option.labelKey)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Pressable
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityLabel={t("defineChildProfile.accessibility.save")}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                ]}
              >
                <AppText weight="extraBold" style={styles.saveButtonText}>
                  {t("defineChildProfile.actions.save")}
                </AppText>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}