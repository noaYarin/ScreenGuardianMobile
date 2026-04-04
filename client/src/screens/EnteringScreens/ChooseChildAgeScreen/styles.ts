import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
  },

  container: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    flex: 1,
    justifyContent: "space-between",
    gap: 18,
  },

  containerTablet: {
    paddingTop: 10,
  },

  heroCard: {
    width: "100%",
    backgroundColor: "#F8FBFF",
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#E2ECF7",
    shadowColor: "#16324F",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },



  title: {
    marginTop: 4,
    fontSize: 28,
    lineHeight: 34,
    color: "#1C2B3A",
    marginBottom: 10,
    textAlign: "center",
  },

  selectorCard: {
    marginTop: 12,
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: "#E8EEF6",
  },

  selectorCardWide: {
    paddingHorizontal: 18,
    paddingVertical: 22,
  },

  controlsRow: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  stepButton: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#F2F7FC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCE7F3",
  },

  stepButtonDisabled: {
    backgroundColor: "#F7F9FC",
    borderColor: "#E7EDF5",
  },

  ageCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  ageCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#365486",
    shadowColor: "#365486",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    marginBottom: 12,
  },

  ageNumber: {
    fontSize: 42,
    lineHeight: 46,
    color: "#FFFFFF",
  },

  ageLabel: {
    marginTop: 7,
    fontSize: 16,
    color: "#1C2B3A",
  },

  ageHint: {
    fontSize: 14,
    color: "#6A7C92",
  },

  rangeCard: {
    marginTop: 22,
    backgroundColor: "#F8FBFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2ECF7",
  },

  rangeHeaderRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  rangeTitle: {
    fontSize: 14,
    color: "#2B3F55",
  },

  rangeValue: {
    fontSize: 13,
    color: "#5F738A",
  },

  track: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#DCE8F5",
    overflow: "hidden",
    position: "relative",
  },

  trackFill: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: "#6FA8DC",
  },

  trackLabelsRow: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },

  trackEdgeLabel: {
    fontSize: 13,
    color: "#6A7C92",
  },

  continueButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#243447",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#243447",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  continueButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});