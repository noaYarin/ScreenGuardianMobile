import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#AFC6D9",
  },

  header: {
    backgroundColor: "#4F7FF7",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 22,
  },

  balanceSection: {
    alignItems: "center",
    marginTop: 25,
  },

  balanceLabel: {
    fontSize: 20,
    color: "#333",
    marginBottom: 15,
  },

  balanceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC107",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 20,
    elevation: 4,
  },

  balanceAmount: {
    fontSize: 42,
    color: "#fff",
    marginRight: 10,
  },

  rewardsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "right",
  },

  rewardCard: {
    backgroundColor: "#EDEDED",
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },

  rewardLeft: {
    alignItems: "center",
  },

  rewardPrice: {
    fontSize: 26,
    color: "#A86A00",
  },

  rewardCoins: {
    color: "#A86A00",
  },

  rewardRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 15,
  },

  rewardTitle: {
    fontSize: 16,
    textAlign: "right",
  },

  rewardSub: {
    fontSize: 14,
    color: "#A86A00",
    textAlign: "right",
  },
});