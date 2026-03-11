import React from "react";
import { Stack } from "expo-router";
import { RoleSelectionScreen } from "../../src/screens/EnteringScreens/roleSelection/RoleSelectionScreen";
import { useTranslation } from "react-i18next";

export default function RoleSelectionRoute() {
  return (
    <>
      <Stack.Screen
        options={{
            headerShown: true,           
            title: "",                   
            headerShadowVisible: false,   
      }}  
      />
      <RoleSelectionScreen />
    </>
  );
}