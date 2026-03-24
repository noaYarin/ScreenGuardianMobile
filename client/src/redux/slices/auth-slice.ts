import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import {
  loginParent,
  registerParent,
  resetPassword,
  forgotPassword,
  linkDevice,
  generateCodeForPairingChild, 
} from "../thunks/authThunks";

// Auth for parent and children
type AuthState = {
  // Parent data
  parentId: string | null;
  token: string | null;

  // Child data
  activeChildId: string | null;
  childToken: string | null;
  deviceId: string | null;

  // Loading and error
  isLoading: boolean;
  error: string | null;
};

type AuthSuccessPayload = {
  token: string;
  parentId: string;
};

const initialState: AuthState = {
  parentId: null,
  token: null,
  activeChildId: null,
  childToken: null,
  deviceId: null,
  isLoading: false,
  error: null,
};

const authPending = isAnyOf(
  loginParent.pending,
  registerParent.pending,
  resetPassword.pending,
  forgotPassword.pending,
  generateCodeForPairingChild.pending,
  linkDevice.pending,
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
  generateCodeForPairingChild.rejected,
  linkDevice.rejected,
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  // synchronous reducers 
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    hydrateParentSession: (
      state,
      action: PayloadAction<{ token: string; parentId: string }>
    ) => {
      const p = action.payload;
      state.token = p.token;
      state.parentId = p.parentId;
      state.activeChildId = null;
      state.childToken = null;
      state.deviceId = null;
    },
    hydrateChildSession: (
      state,
      action: PayloadAction<{
        token: string;
        parentId: string;
        childId: string;
        deviceId: string;
      }>
    ) => {
      const p = action.payload;
      state.token = null;
      state.childToken = p.token;
      state.parentId = p.parentId;
      state.activeChildId = p.childId;
      state.deviceId = p.deviceId;
    },
    logout: (state) => {
      state.parentId = null;
      state.token = null;
      state.activeChildId = null;
      state.childToken = null;
      state.deviceId = null;
    },
  },
  // extraReducers for async operations - thunks response
  extraReducers: (builder) => {
    builder
      .addCase(linkDevice.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.parentId = action.payload.parentId; 
        state.activeChildId = action.payload.childId;
        state.childToken = action.payload.token;
        state.deviceId = action.payload.deviceId;
      
      })
      .addCase(generateCodeForPairingChild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        // Only clear loading & error; no auth data is set here
        state.isLoading = false;
        state.error = null;
      })
      // Matchers for pending, rejected, and fulfilled states
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

export const { setError, hydrateParentSession, hydrateChildSession } =
  authSlice.actions;

// Export all auth thunks, now the components use it from this slice 
export {
  loginParent,
  registerParent,
  resetPassword,
  forgotPassword,
  generateCodeForPairingChild,
  linkDevice,
} from "../thunks/authThunks";

export default authSlice.reducer;