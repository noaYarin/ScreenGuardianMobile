import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  flex1: { flex: 1 },

  container: {
    width: "100%",
    alignItems: "stretch",
    flex: 1,
    paddingTop: 100,
  },

  hero: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginTop: 6,
    marginBottom: 14,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    textAlign: "center",
  },

  card: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  iconWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },

  iconBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 22,
    textAlign: "center",
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 14,
  },

  input: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,

    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },

  // ✅ RTL: הופך את השורה כך שהאייקון יהיה מימין
  inputRTL: {
    flexDirection: "row-reverse",
  },

  inputText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
  },

  // ✅ RTL: זה הדבר הנכון במקום writingDirection כ-prop
  inputTextRTL: {
    textAlign: "right",
    writingDirection: "rtl",
  },

  errorText: {
    color: "#DC2626",
    marginTop: -4,
    marginBottom: 8,
    textAlign: "center",
  },

  // ✅ שכחת סיסמה באמצע (לא צד)
  forgotWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },

  forgotText: {
    color: "#2563EB",
    textDecorationLine: "underline",
  },

  primaryBtn: {
    width: "100%",
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 2,
  },

  primaryBtnDisabled: {
    opacity: 0.55,
  },

  primaryBtnGradient: {
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  },

  dividerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
    marginBottom: 12,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  dividerText: {
    color: "#6B7280",
    fontSize: 12,
  },

  bottomRow: {
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
    flexWrap: "wrap",
  },

  bottomText: {
    color: "#6B7280",
  },

  bottomLink: {
    color: "#2563EB",
    textDecorationLine: "underline",
  },
});