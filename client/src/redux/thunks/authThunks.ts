import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiLoginParent,
  apiRegisterParent,
  apiGoogleAuthParent,
} from "../../api/auth";
import { getMyChild } from "../../api";
import type {
  LoginParentArgs,
  LoginParentPayload,
  RegisterParentArgs,
  GoogleAuthParentArgs,
} from "../slices/types";
import type { ChildrenDataFromServer } from "../../api/auth.types";


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
  "Failed to login. Please try again."
);

export const registerParent = createAuthThunk<RegisterParentArgs>(
  "auth/registerParent",
  (credentials) => apiRegisterParent(credentials).then(toLoginParentPayload),
  "Failed to register. Please try again."
);

export const googleAuthParent = createAuthThunk<GoogleAuthParentArgs>(
  "auth/googleAuthParent",
  ({ idToken }) => apiGoogleAuthParent(idToken).then(toLoginParentPayload),
  "Failed to authenticate with Google. Please try again."
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

