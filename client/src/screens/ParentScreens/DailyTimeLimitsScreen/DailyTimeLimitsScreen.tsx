import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import ScreenLayout from "../../../layouts/ScreenLayout/ScreenLayout";
import AppText from "../../../components/AppText/AppText";
import ChildDeviceSelector from "../../../components/ChildDeviceSelector/ChildDeviceSelector";
import { styles } from "./styles";

import { useTranslation } from "../../../../hooks/use-translation";
import { useLocaleLayout } from "../../../../hooks/use-locale-layout";

import type { AppDispatch, RootState } from "@/src/redux/store/types";
import { getMyChildrenThunk } from "@/src/redux/thunks/childrenThunks";
import {
  fetchDevicesByChild,
  updateDeviceDailyLimitThunk,
} from "@/src/redux/thunks/deviceThunks";
import type { DailyLimitMode } from "@/src/api/device";

const CHILD_ACCENTS = ["#EC6FB7", "#5B8DEF", "#16C7A1", "#F59E0B", "#8B5CF6"];

function getAccentFromIndex(index: number) {
  return CHILD_ACCENTS[index % CHILD_ACCENTS.length];
}

function formatMinutesToClock(totalMinutes: number) {
  const safeMinutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

export default function DailyTimeLimitsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const { isRTL, text, row } = useLocaleLayout();

  const {
    childrenList,
    isLoading: childrenLoading,
    error: childrenError,
  } = useSelector((state: RootState) => state.children);

  const { byChildId, statusByChildId, errorByChildId } = useSelector(
    (state: RootState) => state.devices
  );

  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [isEditing, setIsEditing] = useState(false);
  const [draftMode, setDraftMode] = useState<Exclude<DailyLimitMode, "NONE">>(
    "LIMITED"
  );
  const [minutesInput, setMinutesInput] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getMyChildrenThunk());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedChildId && childrenList.length > 0) {
      setSelectedChildId(String(childrenList[0]._id));
    }
  }, [childrenList, selectedChildId]);

  useEffect(() => {
    if (!selectedChildId) return;
    dispatch(fetchDevicesByChild(selectedChildId));
  }, [dispatch, selectedChildId]);

  const selectedChild = useMemo(() => {
    return (
      childrenList.find((child) => String(child._id) === selectedChildId) ?? null
    );
  }, [childrenList, selectedChildId]);

  const selectedChildIndex = useMemo(() => {
    return childrenList.findIndex(
      (child) => String(child._id) === selectedChildId
    );
  }, [childrenList, selectedChildId]);

  const currentChildDevices = useMemo(() => {
    return byChildId[selectedChildId] ?? [];
  }, [byChildId, selectedChildId]);

  const devicesStatus = selectedChildId
    ? statusByChildId[selectedChildId] ?? "idle"
    : "idle";

  const devicesError = selectedChildId
    ? errorByChildId[selectedChildId] ?? null
    : null;

  useEffect(() => {
    if (!currentChildDevices.length) {
      if (selectedDeviceId) {
        setSelectedDeviceId("");
      }
      setIsEditing(false);
      setMinutesInput("");
      setSubmitError(null);
      return;
    }

    const selectedStillExists = currentChildDevices.some(
      (device) => String(device._id) === String(selectedDeviceId)
    );

    if (!selectedStillExists) {
      setSelectedDeviceId(String(currentChildDevices[0]._id));
      setIsEditing(false);
      setMinutesInput("");
      setSubmitError(null);
    }
  }, [currentChildDevices, selectedDeviceId]);

  const selectedDevice = useMemo(() => {
    return (
      currentChildDevices.find(
        (device) => String(device._id) === String(selectedDeviceId)
      ) ?? null
    );
  }, [currentChildDevices, selectedDeviceId]);

  const selectedDeviceName =
    selectedDevice?.name ||
    t("devices.defaultDeviceName", "Connected device");

  const dailyLimitMode: DailyLimitMode =
    selectedDevice?.screenTime?.dailyLimitMode ?? "NONE";

  const dailyLimitMinutes = selectedDevice?.screenTime?.dailyLimitMinutes ?? null;
  const usedTodayMinutes = selectedDevice?.screenTime?.usedTodayMinutes ?? 0;

  const progress =
    dailyLimitMode === "LIMITED" &&
    typeof dailyLimitMinutes === "number" &&
    dailyLimitMinutes > 0
      ? Math.min(usedTodayMinutes / dailyLimitMinutes, 1)
      : 0;

  const heroInitial = String(selectedChild?.name ?? "").trim().charAt(0) || "?";
  const heroAccent = getAccentFromIndex(
    selectedChildIndex >= 0 ? selectedChildIndex : 0
  );

  const handleStartCreateLimited = () => {
    setDraftMode("LIMITED");
    setMinutesInput("");
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleStartCreateUnlimited = () => {
    setDraftMode("UNLIMITED");
    setMinutesInput("");
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleEditExisting = () => {
    if (!selectedDevice) return;

    if (
      dailyLimitMode === "LIMITED" &&
      typeof dailyLimitMinutes === "number" &&
      dailyLimitMinutes > 0
    ) {
      setDraftMode("LIMITED");
      setMinutesInput(String(dailyLimitMinutes));
    } else {
      setDraftMode("UNLIMITED");
      setMinutesInput("");
    }

    setSubmitError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setMinutesInput("");
    setSubmitError(null);
  };

  const handleSave = async () => {
    if (!selectedChildId || !selectedDeviceId) return;

    try {
      setIsSaving(true);
      setSubmitError(null);

      if (draftMode === "UNLIMITED") {
        await dispatch(
          updateDeviceDailyLimitThunk({
            childId: selectedChildId,
            deviceId: selectedDeviceId,
            dailyLimitMode: "UNLIMITED",
            dailyLimitMinutes: null,
          })
        ).unwrap();

        setIsEditing(false);
        setMinutesInput("");
        return;
      }

      const parsedMinutes = Number(minutesInput.trim());

      if (!Number.isFinite(parsedMinutes) || parsedMinutes <= 0) {
        setSubmitError(
          t(
            "dailyTimeLimits.validation.invalidMinutes",
            "Please enter a valid number of minutes greater than 0."
          )
        );
        return;
      }

      await dispatch(
        updateDeviceDailyLimitThunk({
          childId: selectedChildId,
          deviceId: selectedDeviceId,
          dailyLimitMode: "LIMITED",
          dailyLimitMinutes: Math.floor(parsedMinutes),
        })
      ).unwrap();

      setIsEditing(false);
      setMinutesInput("");
    } catch (error) {
      setSubmitError(
        (error as Error)?.message ??
          t("dailyTimeLimits.errors.saveFailed", "Failed to save screen-time rule.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveRule = async () => {
    if (!selectedChildId || !selectedDeviceId) return;

    try {
      setIsSaving(true);
      setSubmitError(null);

      await dispatch(
        updateDeviceDailyLimitThunk({
          childId: selectedChildId,
          deviceId: selectedDeviceId,
          dailyLimitMode: "NONE",
          dailyLimitMinutes: null,
        })
      ).unwrap();

      setIsEditing(false);
      setMinutesInput("");
    } catch (error) {
      setSubmitError(
        (error as Error)?.message ??
          t(
            "dailyTimeLimits.errors.removeFailed",
            "Failed to remove the screen-time rule."
          )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenLayout>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={[styles.heroHeader, row]}>
              <View
                style={[
                  styles.heroAvatar,
                  { backgroundColor: heroAccent },
                ]}
              >
                <AppText weight="extraBold" style={styles.heroAvatarText}>
                  {heroInitial}
                </AppText>
              </View>

              <View style={styles.heroTextBlock}>
                <AppText weight="extraBold" style={[styles.heroTitle, text]}>
                  {t("dailyTimeLimits.heroTitle")}
                </AppText>

                <AppText weight="medium" style={[styles.heroSubtitle, text]}>
                  {t("dailyTimeLimits.heroSubtitle")}
                </AppText>
              </View>
            </View>
          </View>

          <ChildDeviceSelector
            selectedChildId={selectedChildId}
            selectedDeviceId={selectedDeviceId}
            onSelectChild={(childId) => {
              setSelectedChildId(childId);
              setSelectedDeviceId("");
              setIsEditing(false);
              setMinutesInput("");
              setSubmitError(null);
            }}
            onSelectDevice={(deviceId) => {
              setSelectedDeviceId(deviceId);
              setIsEditing(false);
              setMinutesInput("");
              setSubmitError(null);
            }}
            showDevices
          />

          {childrenLoading && (
            <View style={styles.emptyState}>
              <ActivityIndicator size="small" color="#3D6BF2" />
              <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                {t("common.loading", "Loading...")}
              </AppText>
            </View>
          )}

          {!!childrenError && (
            <View style={styles.emptyState}>
              <AppText weight="bold" style={[styles.emptyTitle, text]}>
                {t("common.error", "Something went wrong")}
              </AppText>
              <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                {t(childrenError, childrenError)}
              </AppText>
            </View>
          )}

          {!childrenLoading &&
            !childrenError &&
            selectedChildId &&
            devicesStatus === "loading" && (
              <View style={styles.emptyState}>
                <ActivityIndicator size="small" color="#3D6BF2" />
                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("common.loading", "Loading...")}
                </AppText>
              </View>
            )}

          {!childrenLoading && !childrenError && !!devicesError && (
            <View style={styles.emptyState}>
              <AppText weight="bold" style={[styles.emptyTitle, text]}>
                {t("common.error", "Something went wrong")}
              </AppText>
              <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                {t(devicesError, devicesError)}
              </AppText>
            </View>
          )}

          {!childrenLoading &&
            !childrenError &&
            selectedChildId &&
            devicesStatus !== "loading" &&
            !devicesError &&
            currentChildDevices.length === 0 && (
              <View style={styles.emptyState}>
                <AppText weight="bold" style={[styles.emptyTitle, text]}>
                  {t("dailyTimeLimits.empty.noDevicesTitle")}
                </AppText>

                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("dailyTimeLimits.empty.noDevicesSubtitle")}
                </AppText>
              </View>
            )}

          {!childrenLoading &&
            !childrenError &&
            !!selectedDeviceId &&
            currentChildDevices.length > 0 &&
            dailyLimitMode === "NONE" &&
            !isEditing && (
              <View style={styles.emptyState}>
                <AppText weight="bold" style={[styles.emptyTitle, text]}>
                  {t("dailyTimeLimits.empty.noRuleTitle")}
                </AppText>

                <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                  {t("dailyTimeLimits.empty.noRuleSubtitle")}
                </AppText>

                <View
                  style={[
                    styles.emptyActionsRow,
                    isRTL && styles.emptyActionsRowRtl,
                  ]}
                >
                  <Pressable
                    onPress={handleStartCreateLimited}
                    accessibilityRole="button"
                    accessibilityLabel={t("dailyTimeLimits.a11y.setDailyLimit")}
                    style={({ pressed }) => [
                      styles.primaryActionButton,
                      row,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <AppText weight="bold" style={styles.primaryActionButtonText}>
                      {t("dailyTimeLimits.actions.setDailyLimit")}
                    </AppText>
                  </Pressable>

                  <Pressable
                    onPress={handleStartCreateUnlimited}
                    accessibilityRole="button"
                    accessibilityLabel={t("dailyTimeLimits.a11y.setUnlimited")}
                    style={({ pressed }) => [
                      styles.secondaryActionButton,
                      row,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="infinity"
                      size={18}
                      color="#2B4EFF"
                    />
                    <AppText weight="bold" style={styles.secondaryActionButtonText}>
                      {t("dailyTimeLimits.actions.noLimit")}
                    </AppText>
                  </Pressable>
                </View>
              </View>
            )}

          {!childrenLoading &&
            !childrenError &&
            !!selectedDeviceId &&
            currentChildDevices.length > 0 &&
            isEditing && (
              <View style={styles.limitCard}>
                <View style={[styles.limitTopRow, row]}>
                  <View style={styles.limitTitleWrap}>
                    <AppText weight="bold" style={[styles.limitTitle, text]}>
                      {t("dailyTimeLimits.daily.title")}
                    </AppText>

                    <AppText weight="medium" style={[styles.limitMeta, text]}>
                      {t("dailyTimeLimits.deviceContext", {
                        childName: selectedChild?.name ?? "",
                        deviceName: selectedDeviceName,
                      })}
                    </AppText>
                  </View>

                  <View style={styles.limitIconBox}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={24}
                      color="#3D6BF2"
                    />
                  </View>
                </View>

                <View
                  style={[
                    styles.modeSwitchRow,
                    isRTL && styles.modeSwitchRowRtl,
                  ]}
                >
                  <Pressable
                    onPress={() => setDraftMode("LIMITED")}
                    accessibilityRole="button"
                    accessibilityLabel={t("dailyTimeLimits.a11y.modeLimited")}
                    style={({ pressed }) => [
                      styles.modeChip,
                      draftMode === "LIMITED" && styles.modeChipActive,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.modeChipText,
                        draftMode === "LIMITED" && styles.modeChipTextActive,
                      ]}
                    >
                      {t("dailyTimeLimits.mode.limited")}
                    </AppText>
                  </Pressable>

                  <Pressable
                    onPress={() => setDraftMode("UNLIMITED")}
                    accessibilityRole="button"
                    accessibilityLabel={t("dailyTimeLimits.a11y.modeUnlimited")}
                    style={({ pressed }) => [
                      styles.modeChip,
                      draftMode === "UNLIMITED" && styles.modeChipActive,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <AppText
                      weight="bold"
                      style={[
                        styles.modeChipText,
                        draftMode === "UNLIMITED" && styles.modeChipTextActive,
                      ]}
                    >
                      {t("dailyTimeLimits.mode.unlimited")}
                    </AppText>
                  </Pressable>
                </View>

                {draftMode === "LIMITED" && (
                  <View style={styles.inputBlock}>
                    <AppText weight="medium" style={[styles.inputLabel, text]}>
                      {t("dailyTimeLimits.minutesPerDay")}
                    </AppText>

                    <TextInput
                      value={minutesInput}
                      onChangeText={(value) => {
                        setMinutesInput(value);
                        if (submitError) setSubmitError(null);
                      }}
                      keyboardType="number-pad"
                      placeholder={t("dailyTimeLimits.enterMinutes")}
                      placeholderTextColor="#94A3B8"
                      style={[
                        styles.minutesInput,
                        text,
                        isRTL && styles.minutesInputRtl,
                      ]}
                      accessibilityLabel={t("dailyTimeLimits.a11y.minutesInput")}
                    />
                  </View>
                )}

                {draftMode === "UNLIMITED" && (
                  <View style={styles.infoBanner}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={18}
                      color="#2B4EFF"
                    />
                    <AppText weight="medium" style={[styles.infoBannerText, text]}>
                      {t("dailyTimeLimits.unlimitedInfo")}
                    </AppText>
                  </View>
                )}

                {!!submitError && (
                  <View style={styles.emptyState}>
                    <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                      {submitError}
                    </AppText>
                  </View>
                )}

                <View
                  style={[
                    styles.editorButtonsRow,
                    isRTL && styles.editorButtonsRowRtl,
                  ]}
                >
                  <Pressable
                    onPress={handleSave}
                    disabled={isSaving}
                    accessibilityRole="button"
                    accessibilityLabel={t("common.save")}
                    style={({ pressed }) => [
                      styles.primaryActionButton,
                      row,
                      pressed && styles.buttonPressed,
                      isSaving && styles.buttonPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="content-save-outline"
                      size={18}
                      color="#FFFFFF"
                    />
                    <AppText weight="bold" style={styles.primaryActionButtonText}>
                      {t("common.save")}
                    </AppText>
                  </Pressable>

                  <Pressable
                    onPress={handleCancelEdit}
                    disabled={isSaving}
                    accessibilityRole="button"
                    accessibilityLabel={t("common.cancel")}
                    style={({ pressed }) => [
                      styles.secondaryActionButton,
                      row,
                      pressed && styles.buttonPressed,
                      isSaving && styles.buttonPressed,
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color="#2B4EFF"
                    />
                    <AppText weight="bold" style={styles.secondaryActionButtonText}>
                      {t("common.cancel")}
                    </AppText>
                  </Pressable>
                </View>
              </View>
            )}

          {!childrenLoading &&
            !childrenError &&
            !!selectedDeviceId &&
            currentChildDevices.length > 0 &&
            dailyLimitMode !== "NONE" &&
            !isEditing && (
              <View style={styles.cardsList}>
                <View style={styles.limitCard}>
                  <View style={[styles.limitTopRow, row]}>
                    <View style={styles.limitTitleWrap}>
                      <AppText weight="bold" style={[styles.limitTitle, text]}>
                        {t("dailyTimeLimits.daily.title")}
                      </AppText>

                      <AppText weight="medium" style={[styles.limitMeta, text]}>
                        {t("dailyTimeLimits.deviceContext", {
                          childName: selectedChild?.name ?? "",
                          deviceName: selectedDeviceName,
                        })}
                      </AppText>
                    </View>

                    <View style={styles.limitIconBox}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={24}
                        color="#3D6BF2"
                      />
                    </View>
                  </View>

                  <View style={[styles.timePillsRow, row]}>
                    <View style={styles.timePill}>
                      <AppText weight="medium" style={[styles.timePillLabel, text]}>
                        {t("dailyTimeLimits.usedToday")}
                      </AppText>

                      <AppText
                        weight="bold"
                        style={[
                          styles.timePillValue,
                          text,
                          isRTL && styles.timePillValueRtl,
                        ]}
                      >
                        {formatMinutesToClock(usedTodayMinutes)}
                      </AppText>
                    </View>

                    <View style={styles.timePill}>
                      <AppText weight="medium" style={[styles.timePillLabel, text]}>
                        {dailyLimitMode === "UNLIMITED"
                          ? t("dailyTimeLimits.limitType")
                          : t("dailyTimeLimits.limitLabel")}
                      </AppText>

                      <AppText
                        weight="bold"
                        style={[
                          styles.timePillValue,
                          text,
                          isRTL && styles.timePillValueRtl,
                        ]}
                      >
                        {dailyLimitMode === "UNLIMITED"
                          ? t("dailyTimeLimits.unlimitedShort")
                          : `${dailyLimitMinutes ?? 0} ${t("common.minutes")}`}
                      </AppText>
                    </View>
                  </View>

                  {dailyLimitMode === "LIMITED" && (
                    <>
                      <View
                        style={[
                          styles.progressMetaRow,
                          row,
                          isRTL && styles.progressMetaRowRtl,
                        ]}
                      >
                        <AppText weight="medium" style={[styles.progressMetaText, text]}>
                          {t("dailyTimeLimits.usedLabel")}
                        </AppText>

                        <AppText weight="bold" style={[styles.progressMetaValue, text]}>
                          {`${Math.round(progress * 100)}%`}
                        </AppText>
                      </View>

                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            isRTL ? styles.progressFillRtl : styles.progressFillLtr,
                            { width: `${progress * 100}%` },
                          ]}
                        />
                      </View>
                    </>
                  )}

                  <AppText weight="medium" style={[styles.summaryText, text]}>
                    {dailyLimitMode === "UNLIMITED"
                      ? t("dailyTimeLimits.summary.unlimited")
                      : t("dailyTimeLimits.summary.limited", {
                          value: dailyLimitMinutes ?? 0,
                        })}
                  </AppText>

                  {!!submitError && (
                    <View style={styles.emptyState}>
                      <AppText weight="medium" style={[styles.emptySubtitle, text]}>
                        {submitError}
                      </AppText>
                    </View>
                  )}

                  <View
                    style={[
                      styles.actionsRow,
                      isRTL && styles.actionsRow,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusChip,
                        row,
                        isRTL && styles.statusChipRtl,
                        dailyLimitMode === "UNLIMITED"
                          ? styles.statusChipNormal
                          : progress >= 0.8
                          ? styles.statusChipWarning
                          : styles.statusChipNormal,
                      ]}
                    >
                      <AppText
                        weight="bold"
                        style={[
                          styles.statusChipText,
                          dailyLimitMode === "UNLIMITED"
                            ? styles.statusChipTextNormal
                            : progress >= 0.8
                            ? styles.statusChipTextWarning
                            : styles.statusChipTextNormal,
                        ]}
                      >
                        {dailyLimitMode === "UNLIMITED"
                          ? t("dailyTimeLimits.status.unlimited")
                          : progress >= 0.8
                          ? t("dailyTimeLimits.status.almostReached")
                          : t("dailyTimeLimits.status.ok")}
                      </AppText>
                    </View>

                    <View style={styles.actionButtonsWrap}>
                      <Pressable
                        onPress={handleEditExisting}
                        disabled={isSaving}
                        accessibilityRole="button"
                        accessibilityLabel={t("dailyTimeLimits.a11y.editRule")}
                        style={({ pressed }) => [
                          styles.editButton,
                          row,
                          pressed && styles.editButtonPressed,
                          isSaving && styles.editButtonPressed,
                        ]}
                      >
                        <AppText weight="bold" style={styles.editButtonText}>
                          {t("dailyTimeLimits.edit")}
                        </AppText>

                        <MaterialCommunityIcons
                          name="pencil-outline"
                          size={18}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      <Pressable
                        onPress={handleRemoveRule}
                        disabled={isSaving}
                        accessibilityRole="button"
                        accessibilityLabel={t("dailyTimeLimits.a11y.removeRule")}
                        style={({ pressed }) => [
                          styles.removeButton,
                          row,
                          pressed && styles.buttonPressed,
                          isSaving && styles.buttonPressed,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="delete-outline"
                          size={18}
                          color="#DC2626"
                        />
                        <AppText weight="bold" style={styles.removeButtonText}>
                          {t("dailyTimeLimits.removeRule")}
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}