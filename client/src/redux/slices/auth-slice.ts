import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type AuthDataFromServer } from "../../api/auth";

export interface AuthState {
  parentId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  parentId: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthFromServer: (state, action: PayloadAction<AuthDataFromServer>) => {
      state.parentId = action.payload.parentId;
      state.token = action.payload.token;
    },
    setAuthFromToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.parentId = null;
      state.token = null;
    },
  },
});

export const { setAuthFromServer, setAuthFromToken, logout } = authSlice.actions;
export default authSlice.reducer;