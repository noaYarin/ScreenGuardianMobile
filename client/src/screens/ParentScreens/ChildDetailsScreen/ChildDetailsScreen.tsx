import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  RefreshControl,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";
import { useChildProfileLabels } from "../../../../hooks/use-child-profile-labels";
import { RootState, AppDispatch } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  deleteDeviceForChild,
} from "@/src/redux/thunks/deviceThunks";
import { setDeviceLockLocal } from "@/src/redux/slices/device-slice";
import { ChildrenStrip } from "@/src/components/ChildDetails/ChildrenStrip";
import { ChildDetailsProfileCard } from "@/src/components/ChildDetails/ChildDetailsProfileCard";
import { ChildDetailsDevicesSection } from "@/src/components/ChildDetails/ChildDetailsDevicesSection";
import { mapDevicesToRows } from "@/src/components/ChildDetails/mapDevicesToRows";
import { childDetailsStyles as styles } from "@/src/components/ChildDetails/childDetails.styles";
import { parseRouteParam } from "./childDetailsRouteParams";

export default function ChildDetailsScreen() {
  const { t } = useTranslation();
  const { row, text } = useLocaleLayout();
  const { width } = useWindowDimensions();
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    deviceId?: string | string[];
  }>();
  const dispatch = useDispatch<AppDispatch>();

  const paramDeviceId = useMemo(
    () => parseRouteParam(params.deviceId),
    [params.deviceId]
  );
  const paramChildIdFromRoute = useMemo(
    () => parseRouteParam(params.id),
    [params.id]
  );

  const { childrenList, isLoading, error: childrenError } = useSelector(
    (state: RootState) => state.children
  );
  const devicesSlice = useSelector((state: RootState) => state.devices);
  const children = Array.isArray(childrenList) ? childrenList : [];

  const [userSelectedChildId, setUserSelectedChildId] = useState<string | null>(
    null
  );
  const [isDevicesExpanded, setIsDevicesExpanded] = useState(false);
  const [devicesRefreshing, setDevicesRefreshing] = useState(false);
  const [deletingDeviceId, setDeletingDeviceId] = useState<string | null>(null);

  const maxContentWidth = Math.min(900, Math.max(340, width - 32));


  /*
   This logic prioritizes (in order): a valid child ID given via route param, one selected by the user,
   or the first child in the children array
   */
  const effectiveChildId = useMemo(() => {
    if (children.length === 0) {
      return paramChildIdFromRoute || userSelectedChildId || "";
    }
    if (
      paramChildIdFromRoute &&
      children.some((c) => String(c._id) === paramChildIdFromRoute)
    ) {
      return paramChildIdFromRoute;
    }
    if (
      userSelectedChildId &&
      children.some((c) => String(c._id) === String(userSelectedChildId))
    ) {
      return String(userSelectedChildId);
    }
    return String(children[0]._id);
  }, [children, paramChildIdFromRoute, userSelectedChildId]);

  const devices = useMemo(() => {
    if (!effectiveChildId) return [];
    const list = devicesSlice.byChildId[effectiveChildId];
    return Array.isArray(list) ? list : [];
  }, [devicesSlice.byChildId, effectiveChildId]);

  const devicesLoading =
    Boolean(effectiveChildId) &&
    devicesSlice.statusByChildId[effectiveChildId] === "loading";

  const deepLinkDevices = Boolean(paramDeviceId && paramChildIdFromRoute);

  const refreshChildrenList = useCallback(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  // Refresh parent children list
  useFocusEffect(
    useCallback(() => {
      refreshChildrenList();
    }, [refreshChildrenList])
  );

  // load devices for that child
  useEffect(() => {
    if (!effectiveChildId) return;
    dispatch(fetchDevicesByChild(effectiveChildId));
  }, [dispatch, effectiveChildId]);

  // Expand devices section
  useEffect(() => {
    if (deepLinkDevices) {
      setIsDevicesExpanded(true);
    }
  }, [deepLinkDevices]);

  const handleRefreshDevices = useCallback(() => {
    setDevicesRefreshing(true);
    refreshChildrenList();
    const p = effectiveChildId
      ? dispatch(fetchDevicesByChild(effectiveChildId)).unwrap()
      : Promise.resolve();
    p.catch(() => {}).finally(() => setDevicesRefreshing(false));
  }, [refreshChildrenList, dispatch, effectiveChildId]);

  // Get child details
  const selectedChild = useMemo(
    () =>
      children.find((c) => String(c._id) === String(effectiveChildId)) ?? null,
    [children, effectiveChildId]
  );

  const { childName, birthDateLabel, genderLabel } =
    useChildProfileLabels(selectedChild);

  const deviceRows = useMemo(
    () => mapDevicesToRows(devices, t),
    [devices, t]
  );

  const handleRetryLoadChildren = useCallback(() => {
    refreshChildrenList();
    if (effectiveChildId) {
      dispatch(fetchDevicesByChild(effectiveChildId));
    }
  }, [refreshChildrenList, dispatch, effectiveChildId]);

  const handleConnectDevice = useCallback(() => {
    if (!effectiveChildId) return;
    router.push({
      pathname: "/Parent/linkDevice",
      params: { id: effectiveChildId, name: childName },
    } as never);
  }, [effectiveChildId, childName]);

  const handleOpenChildProfile = useCallback(() => {
    router.push({
      pathname: "/Parent/childProfile" as Href,
      params: { id: effectiveChildId, name: childName },
    } as never);
  }, [effectiveChildId, childName]);

  const handleDeleteDevice = useCallback(
    (deviceId: string, deviceDisplayName: string) => {
      if (!effectiveChildId || deletingDeviceId) return;
      const childLabel = childName.trim() || t("childDetails.devices_title");
      Alert.alert(
        t("childDetails.delete_device_title", { device: deviceDisplayName }),
        t("childDetails.delete_device_message", { child: childLabel }),
        [
          { text: t("childDetails.delete_device_cancel"), style: "cancel" },
          {
            text: t("childDetails.delete_device_confirm"),
            style: "destructive",
            onPress: () => {
              setDeletingDeviceId(deviceId);
              dispatch(
                deleteDeviceForChild({
                  childId: effectiveChildId,
                  deviceId,
                })
              )
                .unwrap()
                .catch(() => {
                  Alert.alert("", t("childDetails.delete_device_error"));
                })
                .finally(() => {
                  setDeletingDeviceId(null);
                });
            },
          },
        ]
      );
    },
    [dispatch, effectiveChildId, deletingDeviceId, childName, t]
  );

  const handleSetDeviceLocked = useCallback(
    (deviceId: string, locked: boolean) => {
      if (!effectiveChildId || deletingDeviceId) return;
      dispatch(
        setDeviceLockLocal({
          childId: effectiveChildId,
          deviceId,
          isLocked: locked,
        })
      );
    },
    [dispatch, effectiveChildId, deletingDeviceId]
  );

  const showFullScreenLoader =
    isLoading &&
    children.length === 0 &&
    !deepLinkDevices;

  const showChildrenFetchError =
    Boolean(childrenError) && !isLoading && children.length === 0;

  const showEmptyState =
    !isLoading && children.length === 0 && !childrenError;

  const errorMessage = childrenError
    ? t(childrenError, { defaultValue: childrenError })
    : "";

  if (showFullScreenLoader) {
    return (
      <ScreenLayout>
        <View
          style={[styles.container, { alignItems: "center", paddingTop: 40 }]}
        >
          <ActivityIndicator />
          <AppText style={[styles.loadingHint, text]}>
            {t("childDetails.loading_children")}
          </AppText>
        </View>
      </ScreenLayout>
    );
  }

  if (showChildrenFetchError) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
          <AppText style={[styles.childMeta, text]}>{errorMessage}</AppText>
          <Pressable
            onPress={handleRetryLoadChildren}
            style={styles.reduxRetryPressable}
          >
            <AppText style={styles.reduxRetryText}>{t("common.retry")}</AppText>
          </Pressable>
        </View>
      </ScreenLayout>
    );
  }

  if (showEmptyState) {
    return (
      <ScreenLayout>
        <View style={[styles.container, { paddingTop: 24 }]}>
          <AppText style={[styles.childMeta, text]}>
            {t("homeParent.no_children")}
          </AppText>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <ScrollView
        style={styles.scrollRoot}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={devicesRefreshing}
            onRefresh={handleRefreshDevices}
          />
        }
      >
        <View style={[styles.content, { maxWidth: maxContentWidth }]}>
          {isLoading && children.length > 0 ? (
            <View style={[styles.reduxSyncRow, row]}>
              <ActivityIndicator size="small" />
              <AppText style={[styles.childMeta, text]}>
                {t("childDetails.loading_sync")}
              </AppText>
            </View>
          ) : null}
          {childrenError && children.length > 0 ? (
            <View style={styles.reduxErrorBox}>
              <AppText style={[styles.childMeta, text]}>{errorMessage}</AppText>
              <Pressable
                onPress={handleRetryLoadChildren}
                style={styles.reduxRetryPressable}
              >
                <AppText style={styles.reduxRetryText}>
                  {t("common.retry")}
                </AppText>
              </Pressable>
            </View>
          ) : null}
          <ChildrenStrip
            childrenList={children}
            selectedChildId={effectiveChildId}
            onSelectChildId={setUserSelectedChildId}
            row={row}
          />
          <ChildDetailsProfileCard
            childName={childName}
            birthDateLabel={birthDateLabel}
            genderLabel={genderLabel}
            row={row}
            text={text}
            onOpenProfile={handleOpenChildProfile}
          />
          <ChildDetailsDevicesSection
            expanded={isDevicesExpanded}
            onToggleExpanded={() => setIsDevicesExpanded((p) => !p)}
            onAddDevice={handleConnectDevice}
            devicesLoading={devicesLoading}
            rows={deviceRows}
            row={row}
            text={text}
            deletingDeviceId={deletingDeviceId}
            onDeleteDevice={handleDeleteDevice}
            onSetDeviceLocked={handleSetDeviceLocked}
          />
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
