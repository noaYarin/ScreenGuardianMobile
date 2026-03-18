import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 28,
    backgroundColor: "#F8FBFF",
  },

  inner: {
    width: "100%",
    alignSelf: "center",
  },

  heroCard: {
    width: "100%",
    backgroundColor: "#BDE0FE",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E7EFF7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 18,
    elevation: 3,
  },

  avatarCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: "#EEF7FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DDECF9",
  },

  childName: {
    fontSize: 28,
    color: "#223548",
    marginBottom: 6,
  },

  childMeta: {
    fontSize: 17,
    color: "#6B7A8C",
    marginBottom: 16,
  },

  editButton: {
    minWidth: 170,
    backgroundColor: "#F3F8FD",
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#DCEAF7",
  },

  editButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  editButtonText: {
    fontSize: 15,
    color: "#3B5B7A",
  },

  cardsGrid: {
    width: "100%",
    gap: 14,
  },

  cardsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "100%",
    minHeight: 112,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9F0F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
  },

  actionCardTablet: {
    width: "48.8%",
  },

  actionContent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  actionContentLtr: {
    flexDirection: "row",
  },

  actionContentRtl: {
    flexDirection: "row-reverse",
  },

  actionTextWrap: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 19,
    color: "#243447",
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 14,
    color: "#7A8796",
    lineHeight: 20,
  },

  iconBubble: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EEF7FF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: "#DCEBFA",
  },

  chevronWrap: {
    width: 26,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  pressed: {
    opacity: 0.72,
  },

  pressedSoft: {
    opacity: 0.82,
  },

  pressedCard: {
    opacity: 0.9,
    backgroundColor: "#F8FBFF",
  },
});