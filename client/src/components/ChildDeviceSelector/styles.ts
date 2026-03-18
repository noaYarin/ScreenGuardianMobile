import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    gap: 22,
  },

  section: {
    gap: 12,
  },

  sectionTitle: {
    fontSize: 17,
    color: "#1F2A44",
    paddingHorizontal: 2,
  },

  childrenWrap: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },

  childCard: {
    position: "relative",
    minHeight: 150,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E8EEF8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: "#102040",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  childCardSelected: {
    borderWidth: 2.2,
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 5,
  },

  childAvatarWrap: {
    marginBottom: 12,
    padding: 4,
    borderRadius: 999,
    backgroundColor: "#F3F7FD",
  },

  childAvatarWrapSelected: {
    backgroundColor: "#EEF4FF",
  },

  childAvatarCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },

  childAvatarText: {
    fontSize: 30,
    color: "#FFFFFF",
    textAlign: "center",
  },

  childName: {
    fontSize: 17,
    color: "#1F2A44",
    textAlign: "center",
    marginBottom: 4,
  },

  childSubtitle: {
    fontSize: 13,
    color: "#7B879C",
    textAlign: "center",
  },

  selectedBadge: {
    position: "absolute",
    top: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedBadgeLtr: {
    right: 10,
  },

  selectedBadgeRtl: {
    left: 10,
  },

  devicesViewport: {
    width: "100%",
    alignItems: "stretch",
  },

  devicesRow: {
    gap: 12,
    paddingVertical: 2,
    minWidth: "100%",
  },

  devicesRowLtr: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  devicesRowRtl: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },

  deviceChip: {
    minWidth: 174,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E6ECF7",
    alignItems: "center",
    gap: 12,
    shadowColor: "#102040",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },

  deviceChipSelected: {
    backgroundColor: "#EEF4FF",
    borderColor: "#3D6BF2",
  },

  deviceIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  deviceIconWrapSelected: {
    backgroundColor: "#3D6BF2",
  },

  deviceTextWrap: {
    flex: 1,
    gap: 2,
  },

  deviceName: {
    fontSize: 15,
    color: "#20304F",
  },

  deviceType: {
    fontSize: 13,
    color: "#7A879C",
  },

  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.985 }],
  },
});