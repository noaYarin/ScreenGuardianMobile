import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../../redux/slices/language-slice';
import authReducer from '../../redux/slices/auth-slice';
import childrenReducer from "../slices/children-slice";
import devicesReducer from "../slices/device-slice";
import notificationsReducer from "../slices/notification-slice";

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
    children: childrenReducer,
    devices: devicesReducer,
    notifications: notificationsReducer,
  },
});

export default store;

