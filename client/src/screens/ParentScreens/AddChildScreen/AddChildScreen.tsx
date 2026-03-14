import React, { useState } from "react";
import {
  View,
  Pressable,
  TextInput,
  I18nManager,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

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

export default function AddChildScreen() {
  const { t } = useTranslation();
  const { row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<GenderOption>("boy");

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));

  const backIconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"] =
    I18nManager.isRTL ? "arrow-left" : "arrow-right";

  const onSave = () => {
    if (!childName.trim()) {
      Alert.alert(t("addChild.validation_title"), t("addChild.validation_name"));
      return;
    }

    if (!isValidDate(birthDate)) {
      Alert.alert(
        t("addChild.validation_title"),
        t("addChild.validation_birthdate")
      );
      return;
    }

    // TODO: Connect this action to the backend.
    // TODO: Send childName, birthDate, and gender to the server.
    // TODO: After successful save, navigate back to the parent home screen.

    Alert.alert(t("addChild.success_title"), t("addChild.success_message"));
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("addChild.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerRight: () => (
            <HeaderIconButton
              name={backIconName}
              onPress={() => router.back()}
              accessibilityLabel={t("addChild.back_a11y")}
            />
          ),
          headerLeft: () => (
            <HeaderIconButton
              name="menu"
              onPress={() => {}}
              accessibilityLabel={t("addChild.menu_a11y")}
            />
          ),
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
                  keyboardType="number-pad"
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
              style={styles.saveButton}
              onPress={onSave}
              accessibilityRole="button"
              accessibilityLabel={t("addChild.save_a11y")}
            >
              <AppText weight="extraBold" style={styles.saveButtonText}>
                {t("addChild.save")}
              </AppText>
            </Pressable>

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}
