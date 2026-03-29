import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
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
import { deleteChildThunk } from "@/src/redux/thunks/childrenThunks";

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
  const [isDeleting, setIsDeleting] = useState(false);

  const childId = useMemo(() => parseRouteParam(params.id), [params.id]);
  const nameFromRoute = useMemo(() => parseRouteParam(params.name), [params.name]);

  const { childrenList } = useSelector((state: RootState) => state.children ?? {});

  const child = useMemo(() => {
    if (!childrenList) return null;
    return childrenList.find((c) => String(c._id) === String(childId)) || null;
  }, [childrenList, childId]);

  const displayName =
    (child?.name && child.name.trim()) ||
    nameFromRoute ||
    t("childProfile.name_fallback");

  const ageYears = useMemo(
    () => getAgeInFullYearsFromBirthDate(child?.birthDate),
    [child?.birthDate]
  );

  const isTablet = width >= 900;
  const contentMaxWidth = width >= 1200 ? 980 : width >= 900 ? 840 : undefined;

  const onPressDeleteChild = () => {
    if (!childId || isDeleting) {
      return;
    }

    Alert.alert(
      t("childProfile.delete_confirm_title", "Delete child"),
      t(
        "childProfile.delete_confirm_message",
        "Are you sure you want to delete this child? This action cannot be undone."
      ),
      [
        {
          text: t("common.cancel", "Cancel"),
          style: "cancel",
        },
        {
          text: t("common.delete", "Delete"),
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);

              await dispatch(deleteChildThunk(childId)).unwrap();

              Alert.alert(
                t("childProfile.delete_success_title", "Deleted"),
                t(
                  "childProfile.delete_success_message",
                  "The child was deleted successfully."
                )
              );

              router.replace("/Parent/(tabs)/children");
            } catch (error: any) {
              Alert.alert(
                t("common.error", "Error"),
                error?.message ||
                  t(
                    "childProfile.delete_error_message",
                    "Could not delete the child."
                  )
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

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

              <View
                style={[
                  styles.profileActionsRow,
                  isRTL ? styles.profileActionsRowRtl : styles.profileActionsRowLtr,
                ]}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/Parent/editChildProfile",
                      params: { childId: childId },
                    } as never)
                  }
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

                <Pressable
                  onPress={onPressDeleteChild}
                  disabled={isDeleting}
                  accessibilityRole="button"
                  accessibilityLabel={t(
                    "childProfile.delete_a11y",
                    "Delete child"
                  )}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.pressedSoft,
                    isDeleting && styles.deleteButtonDisabled,
                  ]}
                >
                  <View style={styles.deleteButtonContent}>
                    <MaterialCommunityIcons
                      name="trash-can-outline"
                      size={18}
                      color="#B42318"
                    />
                    <AppText weight="bold" style={styles.deleteButtonText}>
                      {isDeleting
                        ? t("common.deleting", "Deleting...")
                        : t("common.delete", "Delete")}
                    </AppText>
                  </View>
                </Pressable>
              </View>
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