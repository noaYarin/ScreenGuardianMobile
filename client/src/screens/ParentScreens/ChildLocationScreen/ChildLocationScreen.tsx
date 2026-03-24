import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildSelector from "../../../components/ChildSelector/ChildSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type ChildOption = {
  id: string;
  name: string;
  initial: string;
  accent: string;
  subtitleKey?: string;
};

type ChildLocationItem = {
  childId: string;
  cityKey: string;
  areaKey: string;
  addressKey: string;
  updatedAtKey: string;
  battery: number;
  accuracyKey: string;
};

const CHILDREN: ChildOption[] = [
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#18C29C",
    subtitleKey: "childLocation.children.noaSubtitle",
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#7B9CFF",
    subtitleKey: "childLocation.children.yonatanSubtitle",
  },
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#D46AD8",
    subtitleKey: "childLocation.children.tamarSubtitle",
  },
];

const LOCATION_DATA: ChildLocationItem[] = [ //static
  {
    childId: "noa",
    cityKey: "childLocation.mock.noa.city",
    areaKey: "childLocation.mock.noa.area",
    addressKey: "childLocation.mock.noa.address",
    updatedAtKey: "childLocation.mock.noa.updatedAt",
    battery: 74,
    accuracyKey: "childLocation.mock.noa.accuracy",
  },
  {
    childId: "yonatan",
    cityKey: "childLocation.mock.yonatan.city",
    areaKey: "childLocation.mock.yonatan.area",
    addressKey: "childLocation.mock.yonatan.address",
    updatedAtKey: "childLocation.mock.yonatan.updatedAt",
    battery: 52,
    accuracyKey: "childLocation.mock.yonatan.accuracy",
  },
  {
    childId: "tamar",
    cityKey: "childLocation.mock.tamar.city",
    areaKey: "childLocation.mock.tamar.area",
    addressKey: "childLocation.mock.tamar.address",
    updatedAtKey: "childLocation.mock.tamar.updatedAt",
    battery: 88,
    accuracyKey: "childLocation.mock.tamar.accuracy",
  },
];

export default function ChildLocationScreen() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const { text, row, isRTL } = useLocaleLayout();

  const [selectedChildId, setSelectedChildId] = useState<string>("noa");

  const isTablet = width >= 900;

  const selectedLocation =
    LOCATION_DATA.find((item) => item.childId === selectedChildId) ??
    LOCATION_DATA[0];

  const selectedChild =
    CHILDREN.find((child) => child.id === selectedChildId) ?? CHILDREN[0];

  const markerLeft = useMemo(() => {
    if (selectedChildId === "noa") return "57%";
    if (selectedChildId === "yonatan") return "45%";
    return "63%";
  }, [selectedChildId]);

  const markerTop = useMemo(() => {
    if (selectedChildId === "noa") return "43%";
    if (selectedChildId === "yonatan") return "34%";
    return "58%";
  }, [selectedChildId]);

  const onRefreshLocation = () => {
    // TODO: connect to thunk / API refresh action
    console.log("refresh child location");
  };

  const onNavigateToLocation = () => {
    // TODO: connect to maps / deep link
    console.log("navigate to child location");
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isTablet && styles.containerTablet]}>
          <View style={styles.heroCard}>
            <View style={styles.heroGlowOne} />
            <View style={styles.heroGlowTwo} />

            <View style={styles.heroHeader}>
              <View style={styles.heroTitleWrap}>
                <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                  {t("childLocation.heading")}
                </AppText>

                <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                  {t("childLocation.subtitle")}
                </AppText>
              </View>

              <View
                style={[
                  styles.statusPill,
                  row,
                  selectedLocation.battery <= 25 && styles.statusPillWarn,
                ]}
              >
                <MaterialCommunityIcons
                  name="battery-medium"
                  size={16}
                  color="#FFFFFF"
                />
                <AppText weight="bold" style={styles.statusPillText}>
                  {t("childLocation.batteryValue", {
                    value: selectedLocation.battery,
                  })}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.selectorCard}>
            <ChildSelector
              childrenOptions={CHILDREN}
              selectedChildId={selectedChildId}
              onSelectChild={setSelectedChildId}
            />
          </View>

          <View style={styles.mapCard}>
            <View style={styles.mapTopRow}>
              <View style={[styles.liveBadge, row]}>
                <View style={styles.liveDot} />
                <AppText weight="bold" style={styles.liveBadgeText}>
                  {t("childLocation.live")}
                </AppText>
              </View>

              <View style={[styles.cityPill, isRTL && styles.cityPillRtl]}>
                <AppText weight="bold" style={[styles.cityPillText, text]}>
                  {t(selectedLocation.cityKey)}
                </AppText>
              </View>
            </View>

            <View style={styles.mapArea}>
              <View style={styles.mapBase} />
              <View style={styles.mapRoadRoad1} />
              <View style={styles.mapRoadRoad2} />
              <View style={styles.mapRoadRoad3} />
              <View style={styles.mapRoadRoad4} />
              <View style={styles.mapWater} />
              <View style={styles.mapParkOne} />
              <View style={styles.mapParkTwo} />

              <View
                style={[
                  styles.markerWrap,
                  {
                    left: markerLeft,
                    top: markerTop,
                  },
                ]}
              >
                <View
                  style={[
                    styles.markerHalo,
                    { backgroundColor: `${selectedChild.accent}22` },
                  ]}
                />
                <View
                  style={[
                    styles.markerCore,
                    { backgroundColor: selectedChild.accent },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <AppText weight="bold" style={[styles.sectionTitle, text]}>
                {t("childLocation.detailsTitle")}
              </AppText>
            </View>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={[styles.infoLabelRow, row]}>
                  <MaterialCommunityIcons
                    name="map-marker-radius-outline"
                    size={18}
                    color="#4C7CF0"
                  />
                  <AppText weight="bold" style={[styles.infoLabel, text]}>
                    {t("childLocation.currentLocationLabel")}
                  </AppText>
                </View>

                <AppText weight="medium" style={[styles.infoValue, text]}>
                  {t(selectedLocation.addressKey)}
                </AppText>

                <AppText weight="regular" style={[styles.infoHint, text]}>
                  {t(selectedLocation.areaKey)}
                </AppText>
              </View>

              <View style={styles.infoItem}>
                <View style={[styles.infoLabelRow, row]}>
                  <MaterialCommunityIcons
                    name="clock-time-four-outline"
                    size={18}
                    color="#4C7CF0"
                  />
                  <AppText weight="bold" style={[styles.infoLabel, text]}>
                    {t("childLocation.updatedLabel")}
                  </AppText>
                </View>

                <AppText weight="medium" style={[styles.infoValue, text]}>
                  {t(selectedLocation.updatedAtKey)}
                </AppText>
              </View>

              <View style={styles.infoItem}>
                <View style={[styles.infoLabelRow, row]}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={18}
                    color="#4C7CF0"
                  />
                  <AppText weight="bold" style={[styles.infoLabel, text]}>
                    {t("childLocation.accuracyLabel")}
                  </AppText>
                </View>

                <AppText weight="medium" style={[styles.infoValue, text]}>
                  {t(selectedLocation.accuracyKey)}
                </AppText>
              </View>

              <View style={styles.infoItem}>
                <View style={[styles.infoLabelRow, row]}>
                  <MaterialCommunityIcons
                    name="account-circle-outline"
                    size={18}
                    color="#4C7CF0"
                  />
                  <AppText weight="bold" style={[styles.infoLabel, text]}>
                    {t("childLocation.selectedChildLabel")}
                  </AppText>
                </View>

                <AppText weight="medium" style={[styles.infoValue, text]}>
                  {selectedChild.name}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.actionsWrap}>
            <Pressable
              onPress={onRefreshLocation}
              accessibilityRole="button"
              accessibilityLabel={t("childLocation.refreshA11y")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={[styles.buttonContent, row]}>
                <MaterialCommunityIcons
                  name="refresh"
                  size={22}
                  color="#FFFFFF"
                />
                <AppText weight="bold" style={styles.primaryButtonText}>
                  {t("childLocation.refreshButton")}
                </AppText>
              </View>
            </Pressable>

            <Pressable
              onPress={onNavigateToLocation}
              accessibilityRole="button"
              accessibilityLabel={t("childLocation.navigateA11y")}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <View style={[styles.buttonContent, row]}>
                <MaterialCommunityIcons
                  name="navigation-variant-outline"
                  size={22}
                  color="#2A63E8"
                />
                <AppText weight="bold" style={styles.secondaryButtonText}>
                  {t("childLocation.navigateButton")}
                </AppText>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}