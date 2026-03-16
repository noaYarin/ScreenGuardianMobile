import { createSlice, isAnyOf, PayloadAction } from "@reduxjs/toolkit";
import type {
  AuthState,
  FetchChildrenFulfilledPayload,
  LoginParentPayload,
} from "./types";
import {
  fetchChildren,
  loginParent,
  registerParent,
} from "../thunks/authThunks";

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
);
const authFulfilled = isAnyOf(
  loginParent.fulfilled,
  registerParent.fulfilled,
);
const authRejected = isAnyOf(
  loginParent.rejected,
  registerParent.rejected,
);

function applyAuthFromServer(
  state: AuthState,
  payload: LoginParentPayload
): void {
  state.parentId = payload.auth.parentId;
  state.token = payload.auth.token;
  if (payload.children) {
    state.childrenIds = payload.children.childrenIds;
    state.activeChildId = payload.children.activeChildId;
  } else {
    state.childrenIds = initialState.childrenIds;
    state.activeChildId = initialState.activeChildId;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  // synchronous reducers 
  reducers: {
    setAuthFromServer: (state, action: PayloadAction<LoginParentPayload>) => {
      applyAuthFromServer(state, action.payload);
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
  // extraReducers for async operations - thunks
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchChildren.fulfilled,
        (state, action: PayloadAction<FetchChildrenFulfilledPayload>) => {
          state.childrenIds = action.payload.childrenIds;
          state.activeChildId = action.payload.activeChildId;
        }
      )
      .addMatcher(authPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authFulfilled,
        (state, action: PayloadAction<LoginParentPayload>) => {
          state.isLoading = false;
          state.error = null;
          applyAuthFromServer(state, action.payload);
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
  setAuthFromServer,
  setAuthFromToken,
  setActiveChild,
  exitParentMode,
  logout,
} = authSlice.actions;

export {
  loginParent,
  registerParent,
  fetchChildren,
} from "../thunks/authThunks";
export default authSlice.reducer;