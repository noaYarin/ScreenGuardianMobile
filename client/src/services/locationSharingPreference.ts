import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCATION_SHARING_KEY = '@location_sharing_enabled';

export const getLocationSharingEnabled = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(LOCATION_SHARING_KEY);
    return value !== null ? JSON.parse(value) : true;
  } catch (error) {
    console.error("Error reading location preference:", error);
    return true; 
  }
};


export const setLocationSharingEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOCATION_SHARING_KEY, JSON.stringify(enabled));
  } catch (error) {
    console.error("Error saving location preference:", error);
  }
};