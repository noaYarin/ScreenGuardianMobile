import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Stack, router } from "expo-router";
import { useTranslation } from "react-i18next";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { RoleCard } from "../RoleCard/RoleCard";

import { styles } from "./styles";
import { APP_COLORS, COLORS } from "../../../../constants/theme";

export default function RoleSelectionScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const isTablet = width >= 650;

  const handleParent = () => {
    router.push("/Entering/loginParent" as any);
  };

  const handleChild = () => {
    router.push("/Entering/linkChild" as any);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("roleSelection.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          // ❌ אין פה headerRight/headerLeft של חזור
          // ✅ החץ מגיע מה-RootLayout באופן גלובלי
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <AppText weight="extraBold" style={styles.heading}>
            {t("roleSelection.heading")}
          </AppText>

          <AppText style={styles.subHeading}>
            {t("roleSelection.subHeading")}
          </AppText>

          <View
            style={[
              styles.cardsContainer,
              isTablet && styles.cardsContainerTablet,
            ]}
          >
            <RoleCard
              title={t("roleSelection.childs")}
              imageSource={require("../../../../assets/images/childrens.webp")}
              description={t("roleSelection.childDescription")}
              onPress={handleChild}
              backgroundColor={APP_COLORS.beige}
              avatarCircleBackground={COLORS.light.tint}
              accessibilityLabel={t("roleSelection.child_a11y")}
            />

            <RoleCard
              title={t("roleSelection.parents")}
              imageSource={require("../../../../assets/images/parents.webp")}
              description={t("roleSelection.parentDescription")}
              onPress={handleParent}
              backgroundColor={COLORS.light.tint}
              avatarCircleBackground={APP_COLORS.beige}
              accessibilityLabel={t("roleSelection.parent_a11y")}
            />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}