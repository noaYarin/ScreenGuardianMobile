import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../redux/slices/language-slice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});

export default store;

