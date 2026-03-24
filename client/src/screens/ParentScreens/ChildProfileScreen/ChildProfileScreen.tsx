import React, { useCallback, useMemo } from "react";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { getAgeInFullYearsFromBirthDate } from "../../../../hooks/use-child-profile-labels";
import { parseRouteParam } from "../ChildDetailsScreen/childDetailsRouteParams";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";

type ActionCard = {
  key: string;
  titleKey: string;
  subtitleKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route: string;
};

const ACTIONS: ActionCard[] = [
  {
    key: "apps",
    titleKey: "childProfile.actions.apps.title",
    subtitleKey: "childProfile.actions.apps.subtitle",
    icon: "cellphone",
    route: "/Parent/child-apps",
  },
  {
    key: "limits",
    titleKey: "childProfile.actions.limits.title",
    subtitleKey: "childProfile.actions.limits.subtitle",
    icon: "clock-outline",
    route: "/Parent/child-limits",
  },
  {
    key: "reports",
    titleKey: "childProfile.actions.reports.title",
    subtitleKey: "childProfile.actions.reports.subtitle",
    icon: "chart-bar",
    route: "/Parent/child-reports",
  },
  {
    key: "location",
    titleKey: "childProfile.actions.location.title",
    subtitleKey: "childProfile.actions.location.subtitle",
    icon: "map-marker-outline",
    route: "/Parent/childLocation",
  },
  {
    key: "requests",
    titleKey: "childProfile.actions.requests.title",
    subtitleKey: "childProfile.actions.requests.subtitle",
    icon: "message-outline",
    route: "/Parent/extension-requests",
  },
];

export default function ChildProfileScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { isRTL, text } = useLocaleLayout();
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();

  const childId = useMemo(() => parseRouteParam(params.id), [params.id]);
  const nameFromRoute = useMemo(() => parseRouteParam(params.name), [params.name]);

  const { childrenList } = useSelector((state: RootState) => state.children ?? {});
  const children = Array.isArray(childrenList) ? childrenList : [];

  const child = useMemo(
    () => children.find((c) => String(c._id) === childId) ?? null,
    [children, childId]
  );


  const displayName =
    (child?.name && child.name.trim()) || nameFromRoute || t("childProfile.name_fallback");

  const ageYears = useMemo(
    () => getAgeInFullYearsFromBirthDate(child?.birthDate),
    [child?.birthDate]
  );

  const isTablet = width >= 900;
  const contentMaxWidth = width >= 1200 ? 980 : width >= 900 ? 840 : undefined;

  return (
    <>
      <Stack.Screen
        options={{
          title: t("childProfile.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.inner,
              contentMaxWidth ? { maxWidth: contentMaxWidth } : null,
            ]}
          >
            <View style={styles.heroCard}>
              <View style={styles.avatarCircle}>
                <MaterialCommunityIcons
                  name="account-outline"
                  size={58}
                  color="#4F93D2"
                />
              </View>

              <AppText weight="extraBold" style={[styles.childName, text]}>
                {displayName}
              </AppText>

              {ageYears != null ? (
                <AppText weight="medium" style={[styles.childMeta, text]}>
                  {t("childProfile.age", { age: ageYears })}
                </AppText>
              ) : null}

             <Pressable
  onPress={() => router.push("/Parent/defineChildProfile")}
  accessibilityRole="button"
  accessibilityLabel={t("childProfile.edit_a11y")}
  style={({ pressed }) => [
    styles.editButton,
    pressed && styles.pressedSoft,
  ]}
>
                <View style={styles.editButtonContent}>
                  <MaterialCommunityIcons
                    name="pencil-outline"
                    size={18}
                    color="#3B5B7A"
                  />
                  <AppText weight="bold" style={styles.editButtonText}>
                    {t("childProfile.edit")}
                  </AppText>
                </View>
              </Pressable>
            </View>

            <View style={[styles.cardsGrid, isTablet && styles.cardsGridTablet]}>
              {ACTIONS.map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => router.push(item.route as never)}
                  accessibilityRole="button"
                  accessibilityLabel={t(`childProfile.actions.${item.key}.a11y`)}
                  style={({ pressed }) => [
                    styles.actionCard,
                    isTablet && styles.actionCardTablet,
                    pressed && styles.pressedCard,
                  ]}
                >
                  <View
                    style={[
                      styles.actionContent,
                      isRTL ? styles.actionContentRtl : styles.actionContentLtr,
                    ]}
                  >
                    <View style={styles.iconBubble}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4F93D2"
                      />
                    </View>

                    <View style={styles.actionTextWrap}>
                      <AppText weight="extraBold" style={[styles.actionTitle, text]}>
                        {t(item.titleKey)}
                      </AppText>

                      <AppText weight="medium" style={[styles.actionSubtitle, text]}>
                        {t(item.subtitleKey)}
                      </AppText>
                    </View>

                    <View style={styles.chevronWrap}>
                      <MaterialCommunityIcons
                        name={isRTL ? "chevron-left" : "chevron-right"}
                        size={22}
                        color="#A7B3C2"
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}