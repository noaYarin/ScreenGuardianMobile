import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex: { flex: 1 },

  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },

  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },
  subTitle: {
    fontSize: 18,
    color: "#2A6CFF",
  },

  question: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 28,
    color: "#1E2A39",
  },

  /* ✅ 2x2 Grid */
  grid: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardBase: {
    flex: 1,
    backgroundColor: "#F6FBFF",
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    marginHorizontal: 6,
    position: "relative",
    overflow: "hidden",
  },

  /* overlay pressable (fix nested buttons on web) */
  cardOverlayPressable: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },

  cardPressed: { opacity: 0.82 },
  cardActive: { backgroundColor: "#ECF7FF" },

  cardBorderBlue: { borderColor: "#86B6FF" },
  cardBorderPurple: { borderColor: "#D8B4FF" },
  cardBorderGreen: { borderColor: "#22C55E" },
  cardBorderOrange: { borderColor: "#F59E0B", backgroundColor: "#FFF7ED" },

  minutesValue: {
    marginTop: 10,
    fontSize: 28,
    color: "#1E2A39",
  },
  minutesLabel: {
    marginTop: 2,
    fontSize: 14,
    color: "#1E2A39",
    opacity: 0.75,
  },

  customTopRow: { marginBottom: 6 },
  customLabel: { fontSize: 22, color: "#E4572E" },

  customValueRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  customControlBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FCD34D",
    zIndex: 2,
  },

  pressedOpacity: { opacity: 0.7 },

  customValue: {
    fontSize: 34,
    color: "#E4572E",
    minWidth: 34,
    textAlign: "center",
    zIndex: 2,
  },

  customUnit: {
    marginTop: 2,
    fontSize: 14,
    color: "#1E2A39",
    opacity: 0.75,
    zIndex: 2,
  },

  summaryBar: {
    marginTop: 18,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#EAF7EE",
    borderWidth: 2,
    borderColor: "#BFE7C9",
    alignItems: "center",
  },
  summaryText: { fontSize: 18, color: "#0F5132" },

  messageBlock: { marginTop: 18 },
  messageLabel: {
    fontSize: 14,
    color: "#1E2A39",
    opacity: 0.8,
    marginBottom: 8,
  },
  messageInput: {
    minHeight: 88,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6E8FF",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1E2A39",
  },

  sendBtn: {
    marginTop: 18,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  sendBtnPressed: { opacity: 0.85 },
  sendBtnText: { fontSize: 18, color: "#FFFFFF" },
});