import React, { useMemo } from "react";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../hooks/use-translation";
import { useLocaleLayout } from "../../../hooks/use-locale-layout";

export type ChildSelectorOption = {
  id: string;
  name: string;
  initial: string;
  accent: string;
  subtitleKey?: string;
};

type Props = {
  childrenOptions: ChildSelectorOption[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  childSectionTitleKey?: string;
};

export default function ChildSelector({
  childrenOptions,
  selectedChildId,
  onSelectChild,
  childSectionTitleKey = "childSelector.childrenSectionTitle",
}: Props) {
  const { t } = useTranslation();
  const { isRTL, text } = useLocaleLayout();
  const { width } = useWindowDimensions();

  if (!childrenOptions.length) return null;

  // 🔥 רוחב דינמי קטן יותר לטלפון
  const cardWidth = useMemo(() => {
    if (width < 380) return 110;
    if (width < 450) return 120;
    return 132;
  }, [width]);

  // 🔥 אם מעט ילדים → נמרכז
  const shouldCenter = childrenOptions.length <= 2;

  return (
    <View style={styles.wrapper}>
      <View style={styles.section}>
        <AppText weight="bold" style={[styles.sectionTitle, text]}>
          {t(childSectionTitleKey)}
        </AppText>

        <View style={styles.childrenViewport}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.childrenRow,
              isRTL ? styles.childrenRowRtl : styles.childrenRowLtr,
              shouldCenter && styles.childrenRowCentered, // 🔥 חדש
            ]}
          >
            {childrenOptions.map((child) => {
              const isSelected = child.id === selectedChildId;

              return (
                <Pressable
                  key={child.id}
                  onPress={() => onSelectChild(child.id)}
                  style={({ pressed }) => [
                    styles.childCard,
                    { width: cardWidth }, // 🔥 דינמי
                    isSelected && [
                      styles.childCardSelected,
                      {
                        borderColor: child.accent,
                        shadowColor: child.accent,
                      },
                    ],
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View
                    style={[
                      styles.childAvatarWrap,
                      isSelected && styles.childAvatarWrapSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.childAvatarCircle,
                        { backgroundColor: child.accent },
                      ]}
                    >
                      <AppText weight="extraBold" style={styles.childAvatarText}>
                        {child.initial}
                      </AppText>
                    </View>
                  </View>

                  <AppText
                    weight="bold"
                    style={styles.childName}
                    numberOfLines={1}
                  >
                    {child.name}
                  </AppText>

                  <AppText
                    weight="medium"
                    style={[styles.childSubtitle, text]}
                    numberOfLines={1}
                  >
                    {child.subtitleKey
                      ? t(child.subtitleKey)
                      : t("childSelector.defaultChildSubtitle")}
                  </AppText>

                  {isSelected && (
                    <View
                      style={[
                        styles.selectedBadge,
                        isRTL
                          ? styles.selectedBadgeRtl
                          : styles.selectedBadgeLtr,
                        { backgroundColor: child.accent },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={14}
                        color="#FFF"
                      />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}