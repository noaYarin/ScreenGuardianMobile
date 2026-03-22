import React from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { router, type Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type MenuItem = {
  key: string;
  labelKey: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: Href;
};

const MENU_ITEMS: MenuItem[] = [
  {
    key: "location",
    labelKey: "homeMenu.items.location",
    icon: "map-marker-outline",
  },
  {
    key: "alerts",
    labelKey: "homeMenu.items.alerts",
    icon: "bell-outline",
  },
  {
    key: "requests",
    labelKey: "homeMenu.items.requests",
    icon: "message-outline",
    route: "/Parent/extensionRequests" as Href,
  },
  {
    key: "activities",
    labelKey: "homeMenu.items.activities",
    icon: "star-four-points-outline",
  },
  {
    key: "rewards",
    labelKey: "homeMenu.items.rewards",
    icon: "gift-outline",
  },
  {
    key: "chatbot",
    labelKey: "homeMenu.items.chatbot",
    icon: "emoticon-outline",
  },
  {
    key: "history",
    labelKey: "homeMenu.items.history",
    icon: "history",
  },
];

export default function HomeMenuScreen() {
  const { t } = useTranslation();
  const { text, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const maxContentWidth = width >= 900 ? 760 : width >= 600 ? 620 : undefined;

  const handleItemPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.container,
            maxContentWidth ? { maxWidth: maxContentWidth } : null,
          ]}
        >
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <Pressable
                key={item.key}
                onPress={() => handleItemPress(item)}
                accessibilityRole="button"
                accessibilityLabel={t(`${item.labelKey}_a11y`, {
                  defaultValue: t(item.labelKey),
                })}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                  index < MENU_ITEMS.length - 1 && styles.menuItemBorder,
                ]}
              >
                <View
                  style={[
                    styles.menuItemRow,
                    isRTL ? styles.menuItemRowRtl : styles.menuItemRowLtr,
                  ]}
                >
                  <View
                    style={[
                      styles.menuMainSide,
                      isRTL ? styles.menuMainSideRtl : styles.menuMainSideLtr,
                    ]}
                  >
                    <View style={styles.menuIconWrap}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color="#4A90E2"
                      />
                    </View>

                    <View
                      style={[
                        styles.menuTextWrap,
                        isRTL ? styles.menuTextWrapRtl : styles.menuTextWrapLtr,
                      ]}
                    >
                      <AppText weight="bold" style={[styles.menuText, text]}>
                        {t(item.labelKey)}
                      </AppText>
                    </View>
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
  );
}