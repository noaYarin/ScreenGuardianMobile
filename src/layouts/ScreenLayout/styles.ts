import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#cfe9ff",
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40, // ✅ שיהיה נוח לגלול עד הסוף
  },

  inner: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
});
