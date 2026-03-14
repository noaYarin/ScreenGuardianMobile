import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: COLORS.light.background,
    alignItems: "stretch",
  },

  content: {
    width: "100%",
    alignSelf: "center",
  },

  headerIconButton: {
    padding: 8,
  },

  headerIconButtonPressed: {
    opacity: 0.65,
  },

  profileCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  profileHeader: {
    alignItems: "center",
    gap: 12,
  },

  avatarWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  profileTextWrap: {
    flex: 1,
  },

  childName: {
    fontSize: 24,
    lineHeight: 30,
    color: "#0F172A",
  },

  childMeta: {
    marginTop: 6,
    fontSize: 14,
    color: "#475569",
  },

  statsRow: {
    marginTop: 16,
    gap: 12,
    flexWrap: "wrap",
  },

  statCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6E6FF",
    backgroundColor: "#F8FBFF",
    padding: 14,
  },

  statTitle: {
    fontSize: 13,
    color: "#475569",
  },

  statValue: {
    marginTop: 8,
    fontSize: 22,
    color: "#1D4ED8",
  },

  sectionHeader: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  sectionTitle: {
    fontSize: 20,
    color: "#0F172A",
  },

  addDeviceButton: {
    borderRadius: 14,
    backgroundColor: APP_COLORS.primaryBlue,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  addDeviceButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  devicesList: {
    marginTop: 14,
    gap: 14,
  },

  deviceCard: {
    width: "100%",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
    padding: 14,
  },

  deviceTopRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  deviceMainInfo: {
    flex: 1,
  },

  deviceName: {
    fontSize: 18,
    color: "#1F2937",
  },

  deviceStatusRow: {
    marginTop: 8,
    alignItems: "center",
    gap: 6,
  },

  deviceStatusText: {
    fontSize: 14,
    color: "#475569",
  },

  deviceAvatar: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  deviceInfoStrip: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },

  infoPillWarn: {
    borderRadius: 10,
    backgroundColor: "#FAD4D4",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  infoPillWarnText: {
    fontSize: 13,
    color: "#C2410C",
  },

  infoMiniRow: {
    alignItems: "center",
    gap: 4,
  },

  infoMiniText: {
    fontSize: 14,
    color: "#374151",
  },

  deviceBottomRow: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  viewLimitsButton: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#60A5FA",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  viewLimitsButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 20,
  },
});
