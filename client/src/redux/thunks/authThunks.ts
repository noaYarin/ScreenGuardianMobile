import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLoginParent,
  apiRegisterParent,
  apiResetPassword,
  apiForgotPassword,
} from "../../api/auth";
import { getMyChildren } from "../../api";

// Payload when auth succeeds (login, register, reset password)
type AuthSuccessPayload = {
  token: string;
  parentId: string;
};

// Reset password args are defined inline so it's clear what the thunk expects
type ResetPasswordArgs = {
  email: string;
  otpCode: string;
  password: string;
};

// Forgot password returns only a success message
type ForgotPasswordSuccessPayload = {
  message: string;
};

export const loginParent = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginParent", async (credentials, thunkAPI) => {
  try {
    const data = await apiLoginParent(credentials);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    const message =
      (error as Error)?.message ?? "loginParent.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

export const registerParent = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>("auth/registerParent", async (credentials, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiRegisterParent(credentials);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    // Go to rejected state
    const message =
      (error as Error)?.message ?? "registerParent.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordSuccessPayload,
  string,
  { rejectValue: string }
>("auth/forgotPassword", async (email, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiForgotPassword(email); 
    return data;
  } catch (error) {
    // Go to rejected state
    const message =
    (error as Error)?.message ?? "forgotPassword.generic_error";

  return thunkAPI.rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk<
  AuthSuccessPayload,
  ResetPasswordArgs,
  { rejectValue: string }
>("auth/resetPassword", async (args, thunkAPI) => {
  try {
    // Go to fulfilled state
    const data = await apiResetPassword(args);
    return {
      token: data.token,
      parentId: data.parentId,
    };
  } catch (error) {
    // Go to rejected state
    const message =
      (error as Error)?.message ?? "resetPassword.generic_error";

    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchChildren = createAsyncThunk<
  { childrenIds: string[]; activeChildId: string | null },
  void,
  { rejectValue: string }
>("auth/fetchChildren", async (_, thunkAPI) => {
  try {
    const data = await getMyChildren();
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

