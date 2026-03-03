
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "stretch",
    paddingTop: 24,
  },

  heading: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 6,
  },

  subHeading: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 22,
  },

  cardsContainer: {
    width: "100%",
    flexDirection: "column",
    gap: 16,
  },

  cardsContainerTablet: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});