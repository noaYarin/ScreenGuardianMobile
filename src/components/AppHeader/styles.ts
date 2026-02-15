import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    height: 108,
    backgroundColor: "#3b63ff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  sideLeft: {
    width: 56,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  sideRight: {
    width: 56,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 32,
    textAlign: "center",
    writingDirection: "rtl",
  },
});
