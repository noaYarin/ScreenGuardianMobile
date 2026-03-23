import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  container: {
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },

  containerTablet: {
    maxWidth: 860,
  },

  heroCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: "#F7F9FF",
    borderWidth: 1,
    borderColor: "#E2E8F5",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  heroTopRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  heroTextWrap: {
    flex: 1,
    gap: 6,
  },

  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    color: "#1D2A44",
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "#667085",
  },

  heroIconBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8EEFF",
  },

  sectionCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9EDF5",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    gap: 14,
  },

  sectionHeaderRow: {
    alignItems: "center",
    gap: 12,
  },

  sectionHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF3FF",
  },

  sectionHeaderTextWrap: {
    flex: 1,
    gap: 2,
  },

  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    color: "#1D2A44",
  },

  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7A8599",
  },

  languageButton: {
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E4EAF7",
    padding: 14,
  },

  languageButtonContent: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  languageButtonLeft: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },

  languageActionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#315AEF",
  },

  languageTextWrap: {
    flex: 1,
    gap: 2,
  },

  languageButtonTitle: {
    fontSize: 16,
    lineHeight: 22,
    color: "#22324D",
  },

  languageButtonSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7A8599",
  },

  switchList: {
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E4EAF7",
    paddingHorizontal: 14,
  },

  switchRow: {
    minHeight: 76,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 14,
  },

  switchTextWrap: {
    flex: 1,
    gap: 4,
  },

  switchTextWrapRtl: {
    alignItems: "flex-end",
  },

  switchTitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#22324D",
  },

  switchSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7A8599",
  },

  rowsList: {
    borderRadius: 18,
    backgroundColor: "#F8FAFF",
    borderWidth: 1,
    borderColor: "#E4EAF7",
    overflow: "hidden",
  },

  rowButton: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  rowButtonContent: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  rowMainSide: {
    flex: 1,
    alignItems: "center",
    gap: 12,
  },

  rowIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF0FF",
  },

  rowTexts: {
    flex: 1,
    gap: 2,
  },

  rowTitle: {
    fontSize: 15,
    lineHeight: 21,
    color: "#22324D",
  },

  rowSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7A8599",
  },

  divider: {
    height: 1,
    backgroundColor: "#E7ECF5",
  },

  logoutButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#E45454",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    shadowColor: "#E45454",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  logoutPressed: {
    opacity: 0.85,
  },

  logoutContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#FFFFFF",
  },

  pressed: {
    opacity: 0.7,
  },
});