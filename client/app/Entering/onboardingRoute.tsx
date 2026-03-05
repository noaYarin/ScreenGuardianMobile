import React from "react";
import { Stack } from "expo-router";
import { OnboardingScreen } from "../../src/screens/EnteringScreens/onboarding/OnboardingScreen";

export default function OnboardingRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "dashboard",
          headerBackVisible: false,   
          headerLeft: () => null,    
          headerRight: () => null,    
        }}
      />
      <OnboardingScreen />
    </>
  );
}