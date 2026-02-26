import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  tabsWrapper: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 6,
    marginBottom: 20,
  },

  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 16,
  },

  activeTab: {
    backgroundColor: "#d1e0f2",
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#6ED48C",
     elevation: 3,
      shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 6,
  },

  coinsBadge: {
    position: "absolute",
    left: 14,
    top: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6E6B4",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },

  coinsText: {
    fontSize: 16,
    color: "#C18400",
  },

  taskTitle: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
  },

  doneBox: {
    backgroundColor: "#BDE7C9",
    padding: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  doneText: {
    color: "#0E7A3E",
  },

  uploadRow: {
    gap: 10,
  },

  notUploaded: {
    color: "#303030",
  },

  uploadBtn: {
    backgroundColor: "#DCE5FF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },

  uploadText: {
    color: "#2E5BFF",
  },

  weekBox: {
    backgroundColor: "#F4E7B7",
    borderRadius: 20,
    padding: 18,
    marginTop: 30,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  weekText: {
    fontSize: 20,
    color: "#9B5B00",
  },
});