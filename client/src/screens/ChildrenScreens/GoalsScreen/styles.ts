import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  headerBackBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  rowReverse: {
    flexDirection: "row-reverse",
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  headerTitle: {
    fontSize: 22,
    marginTop: 8,
    color: "#8B5E3C",
    textAlign: "center",
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#5E6A73",
    textAlign: "center",
  },

  progressCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 20,
    padding: 18,
    marginBottom: 25,
  },

  progressTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },

  progressPercent: {
    fontSize: 20,
    color: "#8B5E3C",
    textAlign: "right",
  },

  progressLabel: {
    fontSize: 16,
    color: "#2E3A45",
    textAlign: "right",
  },

  // ✅ RTL progress bar background
  progressBarBackground: {
    height: 12,
    backgroundColor: "#D6D6D6",
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },

  // ✅ RTL fill: anchored to the RIGHT
  progressBarFill: {
    position: "absolute",
    right: 0,
    height: "100%",
    backgroundColor: "#8B5E3C",
    borderRadius: 10,
  },

  goalCard: {
    backgroundColor: "#EADCD2",
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: "#B07D5B",
  },

  disabledCard: {
    backgroundColor: "#F0F2F4",
    borderColor: "#D3D7DB",
  },

  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  goalTextWrap: {
    alignItems: "flex-end",
    flexShrink: 1,
  },

  goalText: {
    fontSize: 16,
    color: "#2E3A45",
    textAlign: "right",
  },

  goalDays: {
    marginTop: 6,
    fontSize: 14,
    color: "#5E6A73",
    textAlign: "right",
  },
});