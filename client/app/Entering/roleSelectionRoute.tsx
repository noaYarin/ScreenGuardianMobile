import React from "react";
import { Stack } from "expo-router";
import { RoleSelectionScreen } from "../../src/screens/EnteringScreens/roleSelection/RoleSelectionScreen";

export default function RoleSelectionRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RoleSelectionScreen />
    </>
  );
}