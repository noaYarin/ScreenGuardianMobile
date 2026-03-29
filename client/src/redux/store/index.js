import { configureStore } from '@reduxjs/toolkit';
import languageReducer from '../../redux/slices/language-slice';
import authReducer from '../../redux/slices/auth-slice';
import childrenReducer from "../slices/children-slice";
import devicesReducer from "../slices/device-slice";
import requestsReducer from "../slices/requests-slice";

import { injectDispatch } from '../../api/request';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer,
    children: childrenReducer,
    devices: devicesReducer,
    requests: requestsReducer,

  },
});

injectDispatch(store.dispatch);
export default store;

