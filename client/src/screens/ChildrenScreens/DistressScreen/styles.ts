import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    alignItems: "center",
    paddingTop: 6,
  },

  sosArea: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },

  ringOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: "rgba(187, 190, 205, 0.35)",
  },

  ringInner: {
    position: "absolute",
    borderRadius: 9999,
    borderWidth: 10,
    borderColor: "rgba(187, 190, 205, 0.25)",
  },

  sosButton: {
    backgroundColor: "#ff1e1e",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 8,
  },

  sosButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },

  exMarkCircle: {
    width: 86,
    height: 86,
    borderRadius: 9999,
    borderWidth: 7,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  exMark: {
    color: "#ffffff",
    fontSize: 44,
    lineHeight: 44,
  },

  sosText: {
    color: "#ffffff",
    fontSize: 44,
    lineHeight: 44,
    letterSpacing: 0.5,
  },

  textBlock: {
    marginTop: 18,
    alignItems: "center",
  },

  titleText: {
    fontSize: 30,
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
    writingDirection: "rtl",
  },

  subtitle: {
    fontSize: 18,
    color: "rgba(31, 41, 55, 0.75)",
    textAlign: "center",
    writingDirection: "rtl",
  },

  sendCard: {
    width: "100%",
    marginTop: 18,
    backgroundColor: "rgba(255, 255, 255, 0.62)",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sendCardRight: {
    flex: 1,
    alignItems: "flex-end",
  },

  sendToLabel: {
    fontSize: 18,
    color: "rgba(31, 41, 55, 0.7)",
    marginBottom: 6,
    textAlign: "right",
    writingDirection: "rtl",
  },

  sendToValue: {
    fontSize: 26,
    color: "#1d4ed8",
    textAlign: "right",
    writingDirection: "rtl",
  },

  peopleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    color: "#1d4ed8",
    marginLeft: 14,
  },

  warningBox: {
    width: "100%",
    marginTop: 18,
    backgroundColor: "rgba(255, 243, 204, 0.95)",
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.45)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  warningText: {
    fontSize: 16,
    color: "#b45309",
    textAlign: "center",
    writingDirection: "rtl",
  },
});
