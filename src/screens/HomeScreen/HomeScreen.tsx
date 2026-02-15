import React from "react";
import { View, Pressable } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import ScreenLayout from "../../layouts/ScreenLayout/ScreenLayout";
import ImgIcon from "../../components/ImgIcon/ImgIcon";
import AppText from "../../components/AppText/AppText";
import { icons } from "../../icons";
import { styles } from "./styles";

export default function HomeScreen() {
  return (
    <ScreenLayout title="בית">
      <View style={styles.home}>
        {/* top icons */}
        <View style={styles.topRow}>
          {/* שמאל: נגישות */}
          <Pressable style={styles.circleBtn} accessibilityLabel="נגישות" onPress={() => {}}>
            <ImgIcon source={icons.accessibility} size={26} />
          </Pressable>

          {/* ימין: הגדרות */}
          <Pressable style={styles.circleBtn} accessibilityLabel="הגדרות" onPress={() => {}}>
            <ImgIcon source={icons.settings} size={26} />
          </Pressable>
        </View>

        {/* avatar */}
        <LinearGradient
          colors={["#ff7ac8", "#c084fc"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <AppText weight="extraBold" style={styles.avatarLetter}>
            נ
          </AppText>
        </LinearGradient>

        <AppText weight="bold" style={styles.hello}>
          שלום, נועה
        </AppText>

        {/* chips row */}
        <View style={styles.chipsRow}>
          <View style={[styles.chip, styles.chipBlue]}>
            <ImgIcon source={icons.points} size={22} />
            <AppText weight="extraBold" style={styles.chipText}>
              1,250 נק׳
            </AppText>
          </View>

          <View style={[styles.chip, styles.chipGold]}>
            <AppText weight="extraBold" style={styles.chipText}>
              Level 4
            </AppText>
            <ImgIcon source={icons.level} size={22} />
          </View>
        </View>

        {/* coins chip */}
        <View style={[styles.chip, styles.chipMint]}>
          <AppText weight="extraBold" style={styles.chipText}>
            38 מטבעות
          </AppText>
          <ImgIcon source={icons.coins} size={20} />
        </View>

        {/* timer */}
        <LinearGradient
          colors={["#fde2f3", "#dbeafe"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.timer}
        >
          <View style={styles.timerTitle}>
            <ImgIcon source={icons.time} size={24} />
            <AppText weight="bold" style={styles.timerTitleText}>
              זמן מסך שנותר
            </AppText>
          </View>

          <AppText weight="extraBold" style={styles.timerValue}>
            00:12:45
          </AppText>

          <AppText weight="bold" style={styles.timerSub}>
            עוד מעט נגמר הזמן שלך
          </AppText>
        </LinearGradient>

        {/* grid */}
        <View style={styles.grid}>
          <Tile icon={icons.apps} label="אפליקציות" onPress={() => {}} />
          <Tile icon={icons.extend} label="בקשת הארכה" onPress={() => {}} />
          <Tile icon={icons.shop} label="חנות" onPress={() => {}} />

          <Tile icon={icons.tasks} label="מטלות" onPress={() => {}} />
          <Tile icon={icons.achievements} label="הישגים" onPress={() => {}} />
          <Tile icon={icons.goals} label="מטרות" onPress={() => {}} />

          <Tile icon={icons.heart} label="עידוד" onPress={() => {}} />
          <Tile icon={icons.bulb} label="רעיונות" onPress={() => {}} />
          <Tile icon={icons.help} label="עזרה" onPress={() => {}} />
        </View>

        {/* panic */}
        <Pressable
          style={({ pressed }) => [styles.panicBtn, pressed && styles.panicPressed]}
          onPress={() => router.push("/distress")}
          accessibilityRole="button"
          accessibilityLabel="מצוקה"
        >
          <ImgIcon source={icons.panic} size={22} />
          <AppText weight="extraBold" style={styles.panicText}>
            מצוקה
          </AppText>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

type TileProps = {
  icon: any; // PNG require()
  label: string;
  onPress?: () => void;
};

function Tile({ icon, label, onPress }: TileProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.tileIcon}>
        <ImgIcon source={icon} size={26} />
      </View>

      <AppText weight="bold" style={styles.tileText}>
        {label}
      </AppText>
    </Pressable>
  );
}
