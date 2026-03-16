import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLoginParent,
  apiRegisterParent,
  apiResetPassword,
  apiForgotPassword,
} from "../../api/auth/auth";
import { getMyChild } from "../../api";
import type {
  AuthDataFromServer,
  LoginParentParams,
  RegisterParentParams,
} from "../../api";
import type {
  ChildrenDataFromServer,
  ResetPasswordParams,
} from "../../api/auth/auth.types";

type LoginParentPayload = {
  auth: AuthDataFromServer;
  children: ChildrenDataFromServer;
};

type LoginParentArgs = LoginParentParams;

type RegisterParentArgs = RegisterParentParams;

type ResetPasswordArgs = ResetPasswordParams;


function toLoginParentPayload(auth: { token: string; parentId: string }): LoginParentPayload {
  const children: ChildrenDataFromServer = {
    childrenIds: [],
    activeChildId: "",
  };
  return { auth, children };
}

// Thunk template for auth operations
function createAuthThunk<Args>(
  typePrefix: string,
  request: (args: Args) => Promise<LoginParentPayload>,
  defaultErrorMessage: string
) {
  return createAsyncThunk<LoginParentPayload, Args, { rejectValue: string }>(
    typePrefix,
    async (args, thunkAPI) => {
      try {
        const data = await request(args);
        return data;
      } catch (error) {
        const message =
          (error as Error)?.message ?? defaultErrorMessage;

        return thunkAPI.rejectWithValue(message);
      }
    }
  );
}

export const loginParent = createAuthThunk<LoginParentArgs>(
  "auth/loginParent",
  (credentials) => apiLoginParent(credentials).then(toLoginParentPayload),
  "loginParent.generic_error"
);

export const registerParent = createAuthThunk<RegisterParentArgs>(
  "auth/registerParent",
  (credentials) => apiRegisterParent(credentials).then(toLoginParentPayload),
  "registerParent.generic_error"
);


export const forgotPassword = createAuthThunk<string>(
  "auth/forgotPassword",
  (email) => apiForgotPassword(email).then(toLoginParentPayload),
  "forgotPassword.generic_error"
);

export const resetPassword = createAuthThunk<ResetPasswordArgs>(
  "auth/resetPassword",
  (args) => apiResetPassword(args).then(toLoginParentPayload),
  "resetPassword.generic_error"
);


export const fetchChildren = createAsyncThunk<
  { childrenIds: string[]; activeChildId: string | null },
  void,
  { rejectValue: string }
>("auth/fetchChildren", async (_, thunkAPI) => {
  try {
    const data = await getMyChild();
    const childrenIds = data.children.map((child) => child._id);
    const activeChild = data.children.find((child) => child.isActive);

    return {
      childrenIds,
      activeChildId: activeChild?._id ?? null,
    };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "Failed to fetch children. Please try again.";

    return thunkAPI.rejectWithValue(message);
  }
});

