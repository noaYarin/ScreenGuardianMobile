export const tokens = {
  fonts: {
    primary: "Heebo",
    family: "Inter",
  },

  colors: {
    appBg: "#cfe9ff",
    headerBg: "#3b63ff",
    headerTitle: "#ffffff",
    textPrimary: "#1f2937",
    textSecondary: "#6b7280",
  },

  header: {
    height: 108,
    titleSize: 32,
    titleWeight: "800" as const,
  },

  content: {
    maxWidth: 520,
    paddingX: 20,
    paddingY: 24,
  },
} as const;
