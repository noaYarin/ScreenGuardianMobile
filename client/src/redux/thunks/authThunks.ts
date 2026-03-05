import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";
import { getMyChild } from "../../api";
import type {
  LoginParentArgs,
  LoginParentPayload,
  RegisterParentArgs,
  GoogleAuthParentArgs,
} from "../slices/types";

type ThunkConfig = { rejectValue: string };

function createAuthThunk<Args>(
  typePrefix: string,
  request: (args: Args) => Promise<LoginParentPayload>,
  defaultErrorMessage: string
) {
  return createAsyncThunk<LoginParentPayload, Args, ThunkConfig>(
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
  (credentials) =>
    api.post<LoginParentPayload>("/api/v1/auth/login-parent", credentials),
  "Failed to login. Please try again."
);

export const registerParent = createAuthThunk<RegisterParentArgs>(
  "auth/registerParent",
  (credentials) =>
    api.post<LoginParentPayload>("/api/v1/auth/register-parent", credentials),
  "Failed to register. Please try again."
);

export const googleAuthParent = createAuthThunk<GoogleAuthParentArgs>(
  "auth/googleAuthParent",
  ({ idToken }) =>
    api.post<LoginParentPayload>("/api/v1/auth/google-auth-parent", {
      idToken,
    }),
  "Failed to authenticate with Google. Please try again."
);

export const fetchChildren = createAsyncThunk<
  { childrenIds: string[]; activeChildId: string | null },
  void,
  ThunkConfig
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

