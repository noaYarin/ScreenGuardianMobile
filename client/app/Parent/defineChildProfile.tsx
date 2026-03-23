import { Stack } from "expo-router";
import { useTranslation } from "../../hooks/use-translation";
import DefineChildProfileScreen from "@/src/screens/ParentScreens/DefineChildProfileScreen/DefineChildProfileScreen";


export default function DefineChildProfileRoute() {
    const { t } = useTranslation();

    return (
    <>
      <Stack.Screen
        options={{
          title: t("defineChildProfile.title"),
          headerTitleAlign: "center",
          headerShadowVisible: false,
        }}
      />
      <DefineChildProfileScreen />
    </>
  );
}