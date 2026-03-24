import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable, useWindowDimensions } from "react-native";
import { Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector, {
  type ChildOption,
  type DeviceType,
} from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

type ExtensionRequestStatus = "pending" | "approved" | "declined";

type ExtensionRequestItem = {
  id: string;
  childId: string;
  deviceId: string;
  childName: string;
  requestedMinutes: number;
  reasonKey: string;
  requestedAtKey: string;
  currentRemainingKey: string;
  deviceType: DeviceType;
  deviceNameKey: string;
  status: ExtensionRequestStatus;
};

const ALL_CHILD_ID = "all-children";
const ALL_DEVICE_ID = "all-devices";

const STATIC_CHILDREN: ChildOption[] = [
  {
    id: "noa",
    name: "נועה",
    initial: "נ",
    accent: "#12C9A0",
    subtitleKey: "extensionRequests.childSubtitles.personal",
    devices: [
      {
        id: "noa-phone",
        type: "phone",
        name: "Galaxy S23",
        icon: "cellphone",
      },
      {
        id: "noa-tablet",
        type: "tablet",
        name: "iPad Air",
        icon: "tablet-dashboard",
      },
    ],
  },
  {
    id: "yonatan",
    name: "יונתן",
    initial: "י",
    accent: "#6C8CFF",
    subtitleKey: "extensionRequests.childSubtitles.personal",
    devices: [
      {
        id: "yonatan-phone",
        type: "phone",
        name: "iPhone 13",
        icon: "cellphone",
      },
    ],
  },
  {
    id: "tamar",
    name: "תמר",
    initial: "ת",
    accent: "#D56CE0",
    subtitleKey: "extensionRequests.childSubtitles.personal",
    devices: [
      {
        id: "tamar-tablet",
        type: "tablet",
        name: "Lenovo Tab",
        icon: "tablet-dashboard",
      },
    ],
  },
];

const CHILDREN_WITH_ALL_OPTION: ChildOption[] = [
  {
    id: ALL_CHILD_ID,
    name: "כל הילדים",
    initial: "ה",
    accent: "#315BFF",
    devices: [
      {
        id: ALL_DEVICE_ID,
        type: "phone",
        name: "כל המכשירים",
        icon: "devices",
      },
    ],
  },
  ...STATIC_CHILDREN,
];

const STATIC_REQUESTS: ExtensionRequestItem[] = [
  {
    id: "req-1",
    childId: "noa",
    deviceId: "noa-phone",
    childName: "נועה",
    requestedMinutes: 30,
    reasonKey: "extensionRequests.reasons.studyVideo",
    requestedAtKey: "extensionRequests.requestTimes.fiveMinutesAgo",
    currentRemainingKey: "extensionRequests.remaining.almostFinished",
    deviceType: "phone",
    deviceNameKey: "extensionRequests.devices.galaxyS23",
    status: "pending",
  },
  {
    id: "req-2",
    childId: "noa",
    deviceId: "noa-tablet",
    childName: "נועה",
    requestedMinutes: 15,
    reasonKey: "extensionRequests.reasons.friendsMission",
    requestedAtKey: "extensionRequests.requestTimes.fifteenMinutesAgo",
    currentRemainingKey: "extensionRequests.remaining.timeEnded",
    deviceType: "tablet",
    deviceNameKey: "extensionRequests.devices.ipadAir",
    status: "pending",
  },
  {
    id: "req-3",
    childId: "yonatan",
    deviceId: "yonatan-phone",
    childName: "יונתן",
    requestedMinutes: 15,
    reasonKey: "extensionRequests.reasons.chatWithFriends",
    requestedAtKey: "extensionRequests.requestTimes.oneHourAgo",
    currentRemainingKey: "extensionRequests.remaining.twoMinutesLeft",
    deviceType: "phone",
    deviceNameKey: "extensionRequests.devices.iphone13",
    status: "pending",
  },
  {
    id: "req-4",
    childId: "tamar",
    deviceId: "tamar-tablet",
    childName: "תמר",
    requestedMinutes: 20,
    reasonKey: "extensionRequests.reasons.finishLesson",
    requestedAtKey: "extensionRequests.requestTimes.tenMinutesAgo",
    currentRemainingKey: "extensionRequests.remaining.fiveMinutesLeft",
    deviceType: "tablet",
    deviceNameKey: "extensionRequests.devices.lenovoTab",
    status: "pending",
  },
];

function getDeviceIconName(deviceType: DeviceType) {
  return deviceType === "tablet" ? "tablet-dashboard" : "cellphone";
}

export default function ExtensionRequestsScreen() {
  const { t } = useTranslation();
  const { text, row, isRTL } = useLocaleLayout();
  const { width } = useWindowDimensions();

  const isWide = width >= 920;

  const [selectedChildId, setSelectedChildId] = useState(ALL_CHILD_ID);
  const [selectedDeviceId, setSelectedDeviceId] = useState(ALL_DEVICE_ID);
  const [requests, setRequests] = useState<ExtensionRequestItem[]>(STATIC_REQUESTS);

  const selectedChild = useMemo(
    () =>
      CHILDREN_WITH_ALL_OPTION.find((child) => child.id === selectedChildId) ??
      CHILDREN_WITH_ALL_OPTION[0],
    [selectedChildId]
  );

  const selectedDevice = useMemo(() => {
    if (selectedChildId === ALL_CHILD_ID) {
      return {
        id: ALL_DEVICE_ID,
        type: "phone" as DeviceType,
        name: "כל המכשירים",
        icon: "devices" as React.ComponentProps<typeof MaterialCommunityIcons>["name"],
      };
    }

    return (
      selectedChild.devices.find((device) => device.id === selectedDeviceId) ??
      selectedChild.devices[0]
    );
  }, [selectedChild, selectedChildId, selectedDeviceId]);

  const visibleRequests = useMemo(() => {
    return requests.filter((request) => {
      if (request.status !== "pending") {
        return false;
      }

      const matchesChild =
        selectedChildId === ALL_CHILD_ID || request.childId === selectedChildId;

      const matchesDevice =
        selectedDeviceId === ALL_DEVICE_ID || request.deviceId === selectedDeviceId;

      return matchesChild && matchesDevice;
    });
  }, [requests, selectedChildId, selectedDeviceId]);

  const onSelectChild = (childId: string) => {
    setSelectedChildId(childId);

    if (childId === ALL_CHILD_ID) {
      setSelectedDeviceId(ALL_DEVICE_ID);
      return;
    }

    const nextChild = CHILDREN_WITH_ALL_OPTION.find((child) => child.id === childId);
    if (nextChild?.devices?.length) {
      setSelectedDeviceId(nextChild.devices[0].id);
    } else {
      setSelectedDeviceId("");
    }

    // TODO: Server integration
    // Fetch requests for the selected child here if needed.
  };

  const onSelectDevice = (deviceId: string) => {
    setSelectedDeviceId(deviceId);

    // TODO: Server integration
    // Fetch requests for the selected device here if needed.
  };

  const handleApprove = (requestId: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "approved" } : item
      )
    );

    // TODO: Server integration
    // Send approve action to backend, e.g. PATCH /extension-requests/:id/approve
  };

  const handleDecline = (requestId: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "declined" } : item
      )
    );

    // TODO: Server integration
    // Send decline action to backend, e.g. PATCH /extension-requests/:id/decline
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t("extensionRequests.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />

      <ScreenLayout>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <View style={styles.heroCard}>
              <View style={styles.heroGlow} />

              <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                {t("extensionRequests.heading")}
              </AppText>

              <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                {t("extensionRequests.subtitle")}
              </AppText>

              <View
                style={[
                  styles.heroMetaRow,
                  row,
                  isWide ? styles.heroMetaRowWide : undefined,
                ]}
              >
                <View style={styles.heroMetaChip}>
                  <MaterialCommunityIcons
                    name="account-child-outline"
                    size={18}
                    color="#315BFF"
                  />
                  <AppText weight="bold" style={[styles.heroMetaText, text]}>
                    {selectedChild.name}
                  </AppText>
                </View>

                <View style={styles.heroMetaChip}>
                  <MaterialCommunityIcons
                    name={
                      selectedChildId === ALL_CHILD_ID
                        ? "devices"
                        : getDeviceIconName(selectedDevice?.type ?? "phone")
                    }
                    size={18}
                    color="#315BFF"
                  />
                  <AppText weight="bold" style={[styles.heroMetaText, text]}>
                    {selectedDevice?.name ?? ""}
                  </AppText>
                </View>
              </View>
            </View>

            <ChildDeviceSelector
              childrenOptions={CHILDREN_WITH_ALL_OPTION}
              selectedChildId={selectedChildId}
              selectedDeviceId={selectedDeviceId}
              onSelectChild={onSelectChild}
              onSelectDevice={onSelectDevice}
              childCardWidth={width >= 700 ? 160 : 140}
            />

            <View
              style={[
                styles.sectionHeader,
                { alignItems: isRTL ? "flex-end" : "flex-start" },
              ]}
            >
              <View style={[styles.sectionTitleRow, row]}>
                <AppText weight="extraBold" style={[styles.sectionTitle, text]}>
                  {t("extensionRequests.pendingSectionTitle")}
                </AppText>

                <View style={styles.countBadge}>
                  <AppText weight="extraBold" style={styles.countBadgeText}>
                    {visibleRequests.length}
                  </AppText>
                </View>
              </View>

              <AppText weight="medium" style={[styles.sectionSubtitle, text]}>
                {t("extensionRequests.pendingSectionSubtitle")}
              </AppText>
            </View>

            {visibleRequests.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons
                  name="check-decagram-outline"
                  size={34}
                  color="#7A8599"
                />
                <AppText weight="extraBold" style={[styles.emptyTitle, text]}>
                  {t("extensionRequests.empty.title")}
                </AppText>
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("extensionRequests.empty.subtitle")}
                </AppText>
              </View>
            ) : (
              <View style={[styles.cardsWrap, isWide ? styles.cardsWrapWide : undefined]}>
                {visibleRequests.map((request) => (
                  <View
                    key={request.id}
                    style={[styles.requestCard, isWide ? styles.requestCardWide : undefined]}
                  >
                    <View style={[styles.cardTopRow, row]}>
                      <View style={styles.deviceBadge}>
                        <MaterialCommunityIcons
                          name={getDeviceIconName(request.deviceType)}
                          size={24}
                          color="#315BFF"
                        />
                      </View>

                      <View style={styles.cardTopTextWrap}>
                        <AppText weight="extraBold" style={[styles.deviceName, text]}>
                          {t(request.deviceNameKey)}
                        </AppText>

                        <AppText weight="medium" style={[styles.childName, text]}>
                          {request.childName}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.infoGrid}>
                      <View
                        style={[
                          styles.infoChip,
                          isRTL ? styles.infoChipRtl : styles.infoChipLtr,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="clock-plus-outline"
                          size={16}
                          color="#315BFF"
                        />

                        <AppText weight="bold" style={[styles.infoChipText, text]}>
                          {t("extensionRequests.requestedMinutesLabel", {
                            minutes: request.requestedMinutes,
                          })}
                        </AppText>
                      </View>
                    </View>

                    <View style={styles.reasonBox}>
                      <AppText weight="bold" style={[styles.reasonLabel, text]}>
                        {t("extensionRequests.reasonLabel")}
                      </AppText>

                      <AppText weight="medium" style={[styles.reasonText, text]}>
                        {t(request.reasonKey)}
                      </AppText>
                    </View>

                    <View style={styles.remainingBox}>
  <View style={isRTL ? styles.remainingRowRtl : styles.remainingRowLtr}>
    <MaterialCommunityIcons
      name="timer-sand"
      size={16}
      color="#7A8599"
    />
    <AppText weight="medium" style={[styles.remainingText, text]}>
      {t(request.currentRemainingKey)}
    </AppText>
  </View>
</View>

<View style={isRTL ? styles.timeRowRtl : styles.timeRowLtr}>
  <MaterialCommunityIcons
    name="history"
    size={16}
    color="#8A94A6"
  />
  <AppText weight="medium" style={[styles.timeText, text]}>
    {t(request.requestedAtKey)}
  </AppText>
</View>

                    <View style={[styles.actionsRow, row]}>
                      <Pressable
                        onPress={() => handleDecline(request.id)}
                        accessibilityRole="button"
                        accessibilityLabel={t("extensionRequests.a11y.declineRequest", {
                          childName: request.childName,
                          deviceName: t(request.deviceNameKey),
                        })}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.declineButton,
                          pressed && styles.actionButtonPressed,
                        ]}
                      >
                        <MaterialCommunityIcons name="close" size={18} color="#FFFFFF" />
                        <AppText weight="extraBold" style={styles.actionButtonText}>
                          {t("extensionRequests.decline")}
                        </AppText>
                      </Pressable>

                      <Pressable
                        onPress={() => handleApprove(request.id)}
                        accessibilityRole="button"
                        accessibilityLabel={t("extensionRequests.a11y.approveRequest", {
                          childName: request.childName,
                          deviceName: t(request.deviceNameKey),
                        })}
                        style={({ pressed }) => [
                          styles.actionButton,
                          styles.approveButton,
                          pressed && styles.actionButtonPressed,
                        ]}
                      >
                        <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
                        <AppText weight="extraBold" style={styles.actionButtonText}>
                          {t("extensionRequests.approve")}
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  );
}