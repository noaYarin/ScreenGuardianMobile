import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  home: {
    alignItems: "center",
    marginTop: 0,
  },

  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 14,
    alignItems: "center",
  },

  circleBtn: {
    width: 54,
    height: 54,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  avatarLetter: {
    fontSize: 64,
    color: "#ffffff",
    lineHeight: 64,
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  hello: {
    fontSize: 36,
    color: "#475569",
    marginBottom: 14,
    textAlign: "center",
    writingDirection: "rtl",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  chipsRow: {
    flexDirection: "row",
    alignItems: "center", // ✅ חשוב לשורה
    marginBottom: 12,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",     // ✅ כבר היה נכון
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  chipText: {
    fontSize: 16,
    lineHeight: 20,           // ✅ תואם יותר לפונט
    marginHorizontal: 6,
    textAlign: "center",
    writingDirection: "rtl",

    // ✅ אנדרואיד: מונע “ישיבה נמוכה” של הטקסט
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  chipBlue: {
    backgroundColor: "#dbeafe",
    marginRight: 12,
  },

  chipGold: {
    backgroundColor: "#fef3c7",
  },

  chipMint: {
    backgroundColor: "#dcfce7",
    marginBottom: 14,
    alignSelf: "center",
  },

  timer: {
    width: "100%",
    borderRadius: 22,
    padding: 18,
    alignItems: "center",
    marginBottom: 14,
  },

  timerTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  timerTitleText: {
    marginLeft: 8,
    textAlign: "center",
    writingDirection: "rtl",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  timerValue: {
    fontSize: 56,
    color: "#f97316",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  timerSub: {
    color: "#f97316",
    marginTop: 6,
    textAlign: "center",
    writingDirection: "rtl",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tile: {
    width: "31.5%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    marginBottom: 14,
  },

  tilePressed: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },

  tileIcon: {
    marginBottom: 10,
  },

  tileText: {
    color: "#475569",
    textAlign: "center",
    writingDirection: "rtl",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  panicBtn: {
    width: "100%",
    marginTop: 10,
    backgroundColor: "#e85a68",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  panicPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.995 }],
  },

  panicText: {
    color: "#ffffff",
    fontSize: 22,
    marginLeft: 10,
    lineHeight: 22,
    textAlign: "center",
    writingDirection: "rtl",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
