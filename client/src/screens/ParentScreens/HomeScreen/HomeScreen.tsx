import React, { useEffect, useMemo } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { router, Stack, type Href } from "expo-router";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";

type ChildCard = {
  id: string;
  name: string;
  usedText: string;
  limitText: string;
  status: "good" | "warn" | "bad";
};

const ICON = {
  user: "account-outline",
  menu: "menu",
  bell: "bell-outline",
} as const;

export default function HomeParentScreen() {
  const { t } = useTranslation();
  const { row, text, isRTL } = useLocaleLayout();

  const dispatch = useDispatch<AppDispatch>();

  const { childrenList, isLoading, error } = useSelector(
    (state: RootState) => state.children ?? {}
  );
  const children = Array.isArray(childrenList) ? childrenList : [];

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  const parentName = t("homeParent.parent_name_fallback");

  const childCards: ChildCard[] = useMemo(() => {
    const list = Array.isArray(children) ? children : [];
    return list.map((child) => ({
      id: String(child?._id ?? ""),
      name: child?.name ?? "",
      usedText: "--:--",
      limitText: "--:--",
      status: "good" as const,
    }));
  }, [children]);

  const onPressOverview = () => router.push("/Parent/(tabs)/reports" as Href);
  const onPressFullWatch = () => router.push("/Parent/childDetails" as Href);
  const onPressAddChild = () => router.push("/Parent/addChild" as Href);
  const onPressChildCard = (childId: string, childName: string) =>
    router.push({
      pathname: "/Parent/childDetails" as Href,
      params: { id: childId, name: childName },
    } as never);


    const onPressNotifications = () => {
  router.push("/Parent/systemAlerts" as Href);
};

const bellButton = (
  <Pressable
    onPress={onPressNotifications}
    accessibilityRole="button"
    accessibilityLabel={t("homeParent.notifications_a11y")}
    hitSlop={10}
    style={({ pressed }) => [
      styles.headerMenuButton,
      pressed && styles.headerMenuButtonPressed,
    ]}
  >
    <MaterialCommunityIcons name={ICON.bell} size={24} color="#0F172A" />
  </Pressable>
);
  const onPressOpenMenu = () => router.push("/Parent/homeMenu" as Href);

  const menuButton = (
    <Pressable
      onPress={onPressOpenMenu}
      accessibilityRole="button"
      accessibilityLabel={t("homeParent.open_menu_a11y")}
      hitSlop={10}
      style={({ pressed }) => [
        styles.headerMenuButton,
        pressed && styles.headerMenuButtonPressed,
      ]}
    >
      <MaterialCommunityIcons name={ICON.menu} size={24} color="#0F172A" />
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: t("homeParent.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerBackVisible: false,
          ...(isRTL
            ? {
                headerLeft: () => menuButton,
                headerRight: () => bellButton,
              }
            : {
                headerRight: () => menuButton,
                headerLeft: () => bellButton,
              }),
        }}
      />

      <ScreenLayout>
        <View style={styles.container}>
          <View style={styles.content}>
          <View style={styles.header}>
            <AppText weight="extraBold" style={[styles.bigHello, text]}>
              {t("homeParent.hello", { name: parentName })}
            </AppText>

            <AppText
              onPress={onPressOverview}
              weight="bold"
              style={[styles.overviewLink, text]}
            >
              {t("homeParent.overview")}
            </AppText>
          </View>
            <View style={styles.summaryCard}>
              <View style={[styles.summaryRow, row]}>
                <View style={styles.summaryChip}>
                  <AppText weight="extraBold" style={styles.summaryChipText}>
                    {children.length}
                  </AppText>
                </View>

                <View style={styles.summaryTextWrap}>
                  <AppText weight="bold" style={[styles.sectionTitle, text]}>
                    {t("homeParent.my_kids")}
                  </AppText>

                  <AppText style={[styles.sectionSub, text]}>
                    {t("homeParent.day_screen_time")}
                  </AppText>
                </View>
              </View>
            </View>

            {isLoading ? (
              <View style={styles.loaderWrap}>
                <ActivityIndicator />
              </View>
            ) : error ? (
              <AppText style={[styles.sectionSub, text]}>{t(error)}</AppText>
            ) : children.length === 0 ? (
              <View style={styles.emptyState}>
                <AppText style={[styles.sectionSub, text]}>
                  {t("homeParent.no_children")}
                </AppText>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnSecondary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressAddChild}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.add_child_a11y")}
                >
                  <AppText weight="extraBold" style={styles.btnSecondaryText}>
                    {t("homeParent.add_child")}
                  </AppText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.cardsWrap}>
                {childCards.map((c) => (
                  <Pressable
                    key={c.id}
                    style={({ pressed }) => [
                      styles.card,
                      pressed && styles.cardPressed,
                    ]}
                    onPress={() => onPressChildCard(c.id, c.name)}
                    accessibilityRole="button"
                    accessibilityLabel={t("homeParent.child_card_a11y", {
                      name: c.name,
                    })}
                  >
                    <View style={[styles.cardInner, row]}>
                      <View
                        style={[
                          styles.avatarCircle,
                          c.status === "good" && styles.avatarGood,
                          c.status === "warn" && styles.avatarWarn,
                          c.status === "bad" && styles.avatarBad,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={ICON.user}
                          size={22}
                          color="#0F172A"
                        />
                      </View>

                      <View style={styles.cardCenter}>
                        <AppText
                          weight="extraBold"
                          style={[styles.childName, text]}
                          numberOfLines={1}
                        >
                          {c.name}
                        </AppText>

                        <AppText
                          style={[styles.childSubtitle, text]}
                          numberOfLines={1}
                        >
                          {t("homeParent.day_screen_time")}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.cardEdge,
                          isRTL ? styles.cardEdgeRtl : styles.cardEdgeLtr,
                        ]}
                      >
                        <AppText
                          weight="extraBold"
                          style={[
                            styles.timeMain,
                            c.status === "good" && styles.timeGood,
                            c.status === "warn" && styles.timeWarn,
                            c.status === "bad" && styles.timeBad,
                          ]}
                        >
                          {c.usedText}
                        </AppText>

                        <AppText style={styles.timeSub}>
                          {t("homeParent.out_of", { limit: c.limitText })}
                        </AppText>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}

            {childCards.length > 0 && (
              <View style={styles.actionsWrap}>
                <Pressable
                  style={({ pressed }) => [
                    styles.btnPrimary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressFullWatch}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.full_watch_a11y")}
                >
                  <AppText weight="extraBold" style={styles.btnPrimaryText}>
                    {t("homeParent.full_watch")}
                  </AppText>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.btnSecondary,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={onPressAddChild}
                  accessibilityRole="button"
                  accessibilityLabel={t("homeParent.add_child_a11y")}
                >
                  <AppText weight="extraBold" style={styles.btnSecondaryText}>
                    {t("homeParent.add_child")}
                  </AppText>
                </Pressable>
              </View>
            )}

            <View style={styles.bottomSpacer} />
          </View>
        </View>
      </ScreenLayout>
    </>
  );
}