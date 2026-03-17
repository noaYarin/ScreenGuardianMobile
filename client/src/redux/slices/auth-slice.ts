import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchChildren,
  loginParent,
  registerParent,
  resetPassword,
  forgotPassword,
} from "../thunks/authThunks";


type AuthState = {
  parentId: string | null;
  token: string | null;
  childrenIds: string[];
  activeChildId: string | null;
  isLoading: boolean;
  error: string | null;
};

type FetchChildrenFulfilledPayload = {
  childrenIds: string[];
  activeChildId: string | null;
};

type AuthSuccessPayload = {
  token: string;
  parentId: string;
};

const initialState: AuthState = {
  parentId: null,
  token: null,
  childrenIds: [],
  activeChildId: null,
  isLoading: false,
  error: null,
};

const authPending = isAnyOf(
  loginParent.pending,
  registerParent.pending,
  resetPassword.pending,
  forgotPassword.pending,
);
const authFulfilled = isAnyOf(
  loginParent.fulfilled,
  registerParent.fulfilled,
  resetPassword.fulfilled,
);
const authRejected = isAnyOf(
  loginParent.rejected,
  registerParent.rejected,
  resetPassword.rejected,
  forgotPassword.rejected,
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  // synchronous reducers 
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setAuthFromServer: (state, action: PayloadAction<AuthSuccessPayload>) => {
      state.parentId = action.payload.parentId;
      state.token = action.payload.token;
      state.childrenIds = initialState.childrenIds;
      state.activeChildId = initialState.activeChildId;
    },
    setActiveChild: (state, action: PayloadAction<string>) => {
      state.activeChildId = action.payload;
    },
    setAuthFromToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    exitParentMode: (state) => {
      state.parentId = null;
    },
    logout: () => ({ ...initialState }),
  },
  // extraReducers for async operations - thunks response
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchChildren.fulfilled,
        (state, action: PayloadAction<FetchChildrenFulfilledPayload>) => {
          state.childrenIds = action.payload.childrenIds;
          state.activeChildId = action.payload.activeChildId;
        }
      )
      .addCase(forgotPassword.fulfilled, (state) => {
        // Only clear loading & error; no auth data is set here
        state.isLoading = false;
        state.error = null;
      })
      .addMatcher(authPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authFulfilled,
        (state, action: PayloadAction<AuthSuccessPayload>) => {
          state.isLoading = false;
          state.error = null;
          state.parentId = action.payload.parentId;
          state.token = action.payload.token;
          state.childrenIds = initialState.childrenIds;
          state.activeChildId = initialState.activeChildId;
        }
      )
      .addMatcher(authRejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          null;
      });
  },
});

export const {
  setError,
} = authSlice.actions;

// Export all auth thunks, now the components use it from this slice 
export {
  loginParent,
  registerParent,
  resetPassword,
  forgotPassword,
  fetchChildren,
} from "../thunks/authThunks";

export default authSlice.reducer;