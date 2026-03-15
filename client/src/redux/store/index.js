import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../../redux/slices/language-slice';
import authReducer from '../../redux/slices/auth-slice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
  },
});

export default store;

