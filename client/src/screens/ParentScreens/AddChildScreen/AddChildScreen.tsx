import React, { useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  I18nManager,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/src/redux/store/types";
import { addChildThunk } from "@/src/redux/thunks/childrenThunks";
import { clearChildrenError } from "@/src/redux/slices/children-slice";
import { showAppToast } from "@/src/utils/appToast";

function HeaderIconButton({
  name,
  onPress,
  accessibilityLabel,
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      style={({ pressed }) => [
        styles.headerIconButton,
        pressed && styles.headerIconButtonPressed,
      ]}
    >
      <MaterialCommunityIcons name={name} size={22} color="#000" />
    </Pressable>
  );
}

type GenderOption = "boy" | "girl" | "other";

const GENDER_OPTIONS: {
  key: GenderOption;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
}[] = [
    { key: "boy", icon: "human-male" },
    { key: "girl", icon: "human-female" },
    { key: "other", icon: "human-greeting-variant" },
  ];

function isValidDate(value: string) {
  return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value.trim());
}

function toIsoDate(value: string) {
  const [day, month, year] = value.trim().split("/");

  if (!day || !month || !year) return "";

  return `${year}-${month}-${day}`;
}

export default function AddChildScreen() {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector(
    (state: { children: { isLoading: boolean; error: string | null } }) => state.children
  );

  const { row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<GenderOption>("boy");

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  const onSave = async () => {
    try {
      dispatch(clearChildrenError());

      if (!childName.trim()) {
        showAppToast(t("addChild.validation_name"), t("addChild.validation_title"));
        return;
      }

      if (!isValidDate(birthDate)) {
        showAppToast(t("addChild.validation_birthdate"), t("addChild.validation_title"));
        return;
      }

      await dispatch(
        addChildThunk({
          name: childName.trim(),
          birthDate: toIsoDate(birthDate),
          gender,
        })
      ).unwrap();

      router.back();
    } catch (err: any) {
      showAppToast(
        typeof err === "string" ? t(err) : t("common.generic_error"),
        t("addChild.validation_title")
      );
    }
  };


  return (
    <>
      <Stack.Screen
        options={{
          title: t("addChild.title"),
          headerTitleAlign: "center",
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={[styles.content, { maxWidth: maxContentWidth }]}>
            <View style={styles.heroCard}>
              <AppText weight="extraBold" style={[styles.heading, text]}>
                {t("addChild.heading")}
              </AppText>

              <AppText style={[styles.subheading, text]}>
                {t("addChild.subheading")}
              </AppText>
            </View>

            <View style={styles.formCard}>
              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.name_label")}
                </AppText>

                <TextInput
                  value={childName}
                  onChangeText={setChildName}
                  placeholder={t("addChild.name_placeholder")}
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, text]}
                  maxLength={30}
                  accessibilityLabel={t("addChild.name_a11y")}
                />
              </View>

              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.birthdate_label")}
                </AppText>

                <TextInput
                  value={birthDate}
                  onChangeText={setBirthDate}
                  placeholder={t("addChild.birthdate_placeholder")}
                  placeholderTextColor="#94A3B8"
                  style={[styles.input, text]}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                  accessibilityLabel={t("addChild.birthdate_a11y")}
                />
              </View>

              <View style={styles.fieldBlock}>
                <AppText weight="bold" style={[styles.label, text]}>
                  {t("addChild.gender_label")}
                </AppText>

                <View style={[styles.genderRow, row]}>
                  {GENDER_OPTIONS.map((option) => {
                    const isSelected = gender === option.key;

                    return (
                      <Pressable
                        key={option.key}
                        onPress={() => setGender(option.key)}
                        style={[
                          styles.genderButton,
                          isSelected && styles.genderButtonActive,
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={t(`addChild.gender_${option.key}_a11y`)}
                      >
                        <MaterialCommunityIcons
                          name={option.icon}
                          size={20}
                          color={isSelected ? "#2563EB" : "#475569"}
                        />

                        <AppText
                          weight="bold"
                          style={[
                            styles.genderButtonText,
                            isSelected && styles.genderButtonTextActive,
                          ]}
                        >
                          {t(`addChild.gender_${option.key}`)}
                        </AppText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <Pressable
              style={[styles.saveButton, isLoading && { opacity: 0.7 }]}
              onPress={onSave}
              disabled={isLoading}

              accessibilityRole="button"
              accessibilityLabel={t("addChild.save_a11y")}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText weight="extraBold" style={styles.saveButtonText}>
                  {t("addChild.save")}
                </AppText>
              )}
            </Pressable>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}
