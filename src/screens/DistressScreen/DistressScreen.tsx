import React from "react";
import { View, Pressable, Alert, useWindowDimensions } from "react-native";
import { router } from "expo-router";

import ScreenLayout from "../../layouts/ScreenLayout/ScreenLayout";
import IconButton from "../../components/IconButton/IconButton";
import ImgIcon from "../../components/ImgIcon/ImgIcon";
import AppText from "../../components/AppText/AppText";
import { icons } from "../../icons";

import { styles } from "./styles";

export default function DistressScreen() {
  const { width } = useWindowDimensions();

  // Responsive sizing כמו ה-Web
  const areaSize = Math.min(320, Math.max(240, width - 32));
  const ringInset = Math.round(areaSize * (18 / 320));
  const buttonSize = Math.round(areaSize * (230 / 320));

  const onSOSPress = () => {
    Alert.alert("נשלחה התראת מצוקה", "בלחיצה תישלח התראה מיידית להורה.");
  };

  return (
    <ScreenLayout
      title="לחצן מצוקה"
      // החלפה: Back בצד ימין, Hamburger בצד שמאל (כמו שביקשת)
      headerRight={
        <IconButton ariaLabel="חזרה" onPress={() => router.back()}>
          <ImgIcon source={icons.back} size={22} />
        </IconButton>
      }
      headerLeft={
        <IconButton ariaLabel="תפריט" onPress={() => {}}>
          <ImgIcon source={icons.hamburger} size={22} />
        </IconButton>
      }
    >
      <View style={styles.page}>
        {/* SOS circle area */}
        <View style={[styles.sosArea, { width: areaSize, height: areaSize }]}>
          <View style={styles.ringOuter} />
          <View
            style={[
              styles.ringInner,
              { top: ringInset, left: ringInset, right: ringInset, bottom: ringInset },
            ]}
          />

          <Pressable
            onPress={onSOSPress}
            accessibilityRole="button"
            accessibilityLabel="SOS"
            style={({ pressed }) => [
              styles.sosButton,
              {
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2,
              },
              pressed && styles.sosButtonPressed,
            ]}
          >
            <View style={styles.exMarkCircle}>
              <AppText weight="extraBold" style={styles.exMark}>
                !
              </AppText>
            </View>

            <AppText weight="extraBold" style={styles.sosText}>
              SOS
            </AppText>
          </Pressable>
        </View>

        {/* Texts */}
        <View style={styles.textBlock}>
          <AppText weight="extraBold" style={styles.titleText}>
            צריך/ה עזרה דחופה?
          </AppText>
          <AppText weight="medium" style={styles.subtitle}>
            בלחיצה תישלח התראה מיידית להורה
          </AppText>
        </View>

        {/* Send-to card */}
        <View style={styles.sendCard}>
          <View style={styles.sendCardRight}>
            <AppText weight="medium" style={styles.sendToLabel}>
              ישלח ל:
            </AppText>
            <AppText weight="extraBold" style={styles.sendToValue}>
              אמא/אבא
            </AppText>
          </View>

          {/* placeholder לאייקון אנשים */}
          <View style={styles.peopleIcon} accessibilityElementsHidden importantForAccessibility="no">
            <AppText style={{ fontSize: 20 }}>👥</AppText>
          </View>
        </View>

        {/* warning box */}
        <View style={styles.warningBox}>
          <AppText weight="medium" style={styles.warningText}>
            השימוש בכפתור רק במצבי חירום אמיתיים
          </AppText>
        </View>
      </View>
    </ScreenLayout>
  );
}
