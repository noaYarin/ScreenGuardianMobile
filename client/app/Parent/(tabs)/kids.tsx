import React from "react";
import { View } from "react-native";
import KidDetailsScreen from "../../../src/screens/ParentScreens/KidDetailsScreen/KidDetailsScreen";
import { Stack } from "expo-router";

export default function KidsRoute() {
 return (
    <>
    <Stack.Screen
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          
        }}
      />
      <KidDetailsScreen/>
    </>
  );
  
}