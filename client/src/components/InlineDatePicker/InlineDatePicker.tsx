import React from "react";
import { View, Pressable, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import AppText from "../AppText/AppText";
import { styles } from "./styles";

export interface InlineDatePickerProps {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onRequestClose: () => void;
  doneLabel: string;
  doneAccessibilityLabel?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function InlineDatePicker({
  visible,
  value,
  onChange,
  onRequestClose,
  doneLabel,
  doneAccessibilityLabel,
  maximumDate = new Date(),
  minimumDate,
}: InlineDatePickerProps) {
  
  if (!visible) return null;

  const onPickerChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android: Dialog closes automatically on selection
    if (Platform.OS === "android") {
      onRequestClose();
    }
    
    // Update date if the user didn't cancel
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.pickerWrap}>
      <View style={styles.pickerWrap}>
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          onChange={onPickerChange}
          textColor="black"
          themeVariant="light"
          
          style={Platform.OS === "ios" ? { height: 216, width: "100%" } : undefined}
        />
      </View>

      {Platform.OS === "ios" && (
        <View style={styles.footer}>
          <Pressable
            onPress={onRequestClose}
            accessibilityRole="button"
            accessibilityLabel={doneAccessibilityLabel}
            style={({ pressed }) => [
              styles.doneButton,
              pressed && styles.pressed,
            ]}
          >
            <AppText weight="bold" style={styles.doneText}>
              {doneLabel}
            </AppText>
          </Pressable>
        </View>
      )}
    </View>
  );
}