import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 18,
    paddingTop: 8,
  },

  bigHello: {
    fontSize: 44,
    lineHeight: 52,
    textAlign: "center",
    color: "#3F6F9D",
    marginTop: 10,
  },

  overviewLinkWrap: {
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 18,
  },
  overviewLink: {
    fontSize: 18,
    color: "#3F6F9D",
    textDecorationLine: "underline",
  },

  sectionHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#1B2B3A",
  },

  cardsWrap: {
    width: "100%",
    gap: 14,
  },

  card: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CFE2FF",
    flexDirection: "row",
    alignItems: "center",
  },

  cardSelected: {
    borderColor: "#8AB6FF",
  },

  cardLeft: {
    minWidth: 80,
    alignItems: "flex-start",
  },

  timeMain: {
    fontSize: 26,
    lineHeight: 30,
  },
  timeSub: {
    marginTop: 6,
    fontSize: 14,
    color: "#9AA7B3",
  },

  timeGood: { color: "#18A34A" },
  timeWarn: { color: "#D97706" },
  timeBad: { color: "#DC2626" },

  cardCenter: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: "flex-end", // RTL נראה כמו בתמונה
  },

  childName: {
    fontSize: 26,
    lineHeight: 30,
    color: "#1B2B3A",
  },
  childSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#9AA7B3",
  },

  cardRight: {
    width: 62,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarGood: { backgroundColor: "#DFF7E6" },
  avatarWarn: { backgroundColor: "#FFF2CC" },
  avatarBad: { backgroundColor: "#FFE1E1" },

  actionsWrap: {
    width: "100%",
    marginTop: 18,
    gap: 14,
    alignItems: "center",
  },

  primaryBtn: {
    width: "82%",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#5EA7E8",
  },
  primaryBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
  },

  secondaryBtn: {
    width: "82%",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#5EA7E8",
  },
  secondaryBtnText: {
    fontSize: 18,
    color: "#FFFFFF",
  },

  bottomSpacer: {
    height: 24,
  },
});