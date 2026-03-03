// client/src/layouts/ScreenLayout/styles.ts
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
  },

  content: {
    flexGrow: 1, // הכי חשוב עם ScrollView
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },

  inner: {
    flex: 1,
    width: "100%", // שלא “יישב” על רוחב קטן
    alignItems: "stretch", // ילדים יתפסו רוחב מלא אם הם רוצים
  },

  // ✅ רק במחשב (web): כדי שלא יימתח ענק
  // זה יופעל מתוך ScreenLayout.tsx עם Platform.OS === "web"
  webFrame: {
    maxWidth: 430, // "מובייל" נוח לפיתוח בדפדפן
    width: "100%",
    alignSelf: "center",
  },
});