import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ✅ אין רקע! ScreenLayout אחראי לרקע הקבוע
  container: {
    flex: 1,
  },

  balanceSection: {
    alignItems: "center",
    marginTop: 22,
  },

  balanceLabel: {
    fontSize: 20,
    color: "#333",
    marginBottom: 14,
    textAlign: "center",
  },

  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC107",
    paddingHorizontal: 38,
    paddingVertical: 14,
    borderRadius: 18,
    elevation: 4,
  },

  balanceAmount: {
    fontSize: 42,
    color: "#fff",
    marginRight: 10,
  },

  rewardsContainer: {
    marginTop: 26,
    paddingHorizontal: 18,
  },

  // ✅ טקסט מיושר לימין (RTL) כמו בתמונה
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "right",
    color: "#333",
  },

  rewardCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 16,
    elevation: 3,
      shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 6,

    // ✅ מבנה: מחיר בימין, תוכן+אייקון בשמאל
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // ✅ צד ימין: מחיר
  priceBox: {
    minWidth: 70,
    alignItems: "flex-end",
  },

  rewardPrice: {
    fontSize: 26,
    color: "#A86A00",
  },

  rewardCoins: {
    color: "#A86A00",
  },

  // ✅ צד שמאל: טקסט (RTL) + אייקון בצד שמאל
  contentBox: {
    flex: 1,
    marginRight: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  textBox: {
    flex: 1,
    paddingLeft: 14,
    alignItems: "flex-end",
  },

  rewardTitle: {
    fontSize: 16,
    textAlign: "right",
    color: "#111",
  },

  rewardSub: {
    fontSize: 14,
    color: "#A86A00",
    textAlign: "right",
    marginTop: 2,
  },
  icon: {
  marginLeft: 10, 
  marginRight: 10,
}
});