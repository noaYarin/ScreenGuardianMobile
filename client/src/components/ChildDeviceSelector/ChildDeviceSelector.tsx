import React, { useMemo } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "../AppText/AppText";
import { styles } from "./styles";

import { useTranslation } from "../../../hooks/use-translation";
import { useLocaleLayout } from "../../../hooks/use-locale-layout";

export type DeviceType = "phone" | "tablet";

export type ChildDevice = {
  id: string;
  type: DeviceType;
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export type ChildOption = {
  id: string;
  name: string;
  initial: string;
  accent: string;
  subtitleKey?: string;
  devices: ChildDevice[];
};

type Props = {
  childrenOptions: ChildOption[];
  selectedChildId: string;
  selectedDeviceId: string;
  onSelectChild: (childId: string) => void;
  onSelectDevice: (deviceId: string) => void;
  childSectionTitleKey?: string;
  deviceSectionTitleKey?: string;
  childCardWidth?: number;
};

export default function ChildDeviceSelector({
  childrenOptions,
  selectedChildId,
  selectedDeviceId,
  onSelectChild,
  onSelectDevice,
  childSectionTitleKey = "childDeviceSelector.childrenSectionTitle",
  deviceSectionTitleKey = "childDeviceSelector.devicesSectionTitle",
  childCardWidth,
}: Props) {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const selectedChild =
    childrenOptions.find((child) => child.id === selectedChildId) ?? childrenOptions[0];

  const computedChildCardWidth = useMemo(() => {
    if (typeof childCardWidth === "number") {
      return childCardWidth;
    }

    if (width < 380) return 110;
    if (width < 450) return 120;
    return 132;
  }, [childCardWidth, width]);

  const computedDeviceChipWidth = useMemo(() => {
    if (width < 380) return 150;
    if (width < 450) return 160;
    return 170;
  }, [width]);

  const shouldCenterChildren = childrenOptions.length <= 2;
  const shouldCenterDevices = (selectedChild?.devices?.length ?? 0) <= 2;

  if (!selectedChild) {
    return null;
  }

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
              shouldCenterChildren ? styles.childrenRowCentered : null,
            ]}
          >
            {childrenOptions.map((child) => {
              const isSelected = child.id === selectedChildId;

              return (
                <Pressable
                  key={child.id}
                  onPress={() => onSelectChild(child.id)}
                  accessibilityRole="button"
                  accessibilityLabel={t("childDeviceSelector.childTabA11y", {
                    name: child.name,
                  })}
                  style={({ pressed }) => [
                    styles.childCard,
                    { width: computedChildCardWidth },
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
                    ellipsizeMode="tail"
                  >
                    {child.name}
                  </AppText>

                  <AppText
                    weight="medium"
                    style={[styles.childSubtitle, text]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {child.subtitleKey
                      ? t(child.subtitleKey)
                      : t("childDeviceSelector.defaultChildSubtitle")}
                  </AppText>

                  {isSelected ? (
                    <View
                      style={[
                        styles.selectedBadge,
                        isRTL ? styles.selectedBadgeRtl : styles.selectedBadgeLtr,
                        { backgroundColor: child.accent },
                      ]}
                    >
                      <MaterialCommunityIcons name="check" size={14} color="#FFFFFF" />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <View style={styles.section}>
        <AppText weight="bold" style={[styles.sectionTitle, text]}>
          {t(deviceSectionTitleKey)}
        </AppText>

        <View style={styles.devicesViewport}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.devicesRow,
              isRTL ? styles.devicesRowRtl : styles.devicesRowLtr,
              shouldCenterDevices ? styles.devicesRowCentered : null,
            ]}
          >
            {selectedChild.devices.map((device) => {
              const isSelected = device.id === selectedDeviceId;

              return (
                <Pressable
                  key={device.id}
                  onPress={() => onSelectDevice(device.id)}
                  accessibilityRole="button"
                  accessibilityLabel={t("childDeviceSelector.deviceTabA11y", {
                    childName: selectedChild.name,
                    deviceName: device.name,
                  })}
                  style={({ pressed }) => [
                    styles.deviceChip,
                    row,
                    { minWidth: computedDeviceChipWidth },
                    isSelected && styles.deviceChipSelected,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View
                    style={[
                      styles.deviceIconWrap,
                      isSelected && styles.deviceIconWrapSelected,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={device.icon}
                      size={20}
                      color={isSelected ? "#FFFFFF" : "#3D6BF2"}
                    />
                  </View>

                  <View style={styles.deviceTextWrap}>
                    <AppText
                      weight="bold"
                      style={[styles.deviceName, text]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {device.name}
                    </AppText>

                    <AppText
                      weight="medium"
                      style={[styles.deviceType, text]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {t(`childDeviceSelector.devices.${device.type}`)}
                    </AppText>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}