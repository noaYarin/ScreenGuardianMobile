import React from "react";
import { View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTranslation } from "../../../hooks/use-translation";

export default function SettingsRoute() {
  const { t, currentLanguage, changeLanguage } = useTranslation();

  const onToggleLanguage = async () => {
    const next = currentLanguage === "he" ? "en" : "he";
    await changeLanguage(next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
      
      <Pressable
        onPress={onToggleLanguage}
        accessibilityRole="button"
        accessibilityLabel={t("common.change_language", "Change language")}
        style={({ pressed }) => [
          {
            padding: 12,
            borderRadius: 50,
            backgroundColor: "#eee",
          },
          pressed && { opacity: 0.6 },
        ]}
      >
        <MaterialCommunityIcons name="translate" size={26} color="#000" />
      </Pressable>

    </View>
  );
}