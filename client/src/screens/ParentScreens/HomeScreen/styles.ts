import { StyleSheet } from "react-native";
import { APP_COLORS, COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.light.background,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },

  headerMenuButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },

  headerMenuButtonPressed: {
    opacity: 0.72,
  },

  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  bigHello: {
    fontSize: 28,
    lineHeight: 34,
    color: "#0F172A",
    marginTop: 8,
  },

  overviewLink: {
    marginTop: 10,
    fontSize: 14,
    color: APP_COLORS.primaryBlue,
  },

  overviewLinkLtr: {
    alignSelf: "flex-start",
  },

  overviewLinkRtl: {
    alignSelf: "flex-end",
  },

  summaryCard: {
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#F8FAFC",
    padding: 14,
  },

  summaryRow: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  summaryChip: {
    minWidth: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  summaryChipText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  summaryTextWrap: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 16,
    color: "#0F172A",
  },

  sectionSub: {
    marginTop: 4,
    fontSize: 13,
    color: "#334155",
    opacity: 0.75,
  },

  loaderWrap: {
    paddingVertical: 16,
  },

  emptyState: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },

  cardsWrap: {
    width: "100%",
    marginTop: 14,
    gap: 12,
  },

  card: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E7EFFA",
    backgroundColor: "#FFFFFF",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },

  cardPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }],
  },

  cardInner: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarGood: {
    backgroundColor: "#ECFDF5",
  },

  avatarWarn: {
    backgroundColor: "#FFFBEB",
  },

  avatarBad: {
    backgroundColor: "#FEF2F2",
  },

  cardCenter: {
    flex: 1,
  },

  childName: {
    fontSize: 18,
    lineHeight: 22,
    color: "#0F172A",
  },

  childSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#334155",
    opacity: 0.75,
  },

  cardEdge: {
    minWidth: 88,
  },

  cardEdgeLtr: {
    alignItems: "flex-start",
  },

  cardEdgeRtl: {
    alignItems: "flex-end",
  },

  timeMain: {
    fontSize: 18,
    lineHeight: 22,
  },

  timeSub: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },

  timeGood: {
    color: "#047857",
  },

  timeWarn: {
    color: "#B45309",
  },

  timeBad: {
    color: "#B91C1C",
  },

  actionsWrap: {
    width: "100%",
    marginTop: 18,
    gap: 12,
  },

  btnPrimary: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: APP_COLORS.primaryBlue,
  },

  btnPrimaryText: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  btnSecondary: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#D6E6FF",
  },

  btnSecondaryText: {
    fontSize: 16,
    color: "#1D4ED8",
  },

  buttonPressed: {
    opacity: 0.8,
  },

  bottomSpacer: {
    height: 18,
  },
});