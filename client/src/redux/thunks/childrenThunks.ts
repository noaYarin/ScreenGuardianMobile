import { createAsyncThunk } from "@reduxjs/toolkit";
import * as parentApi from "@/src/api/parent";

type AddChildPayload = {
  name: string;
  birthDate: string;
  gender?: string;
};

export const addChildThunk = createAsyncThunk<
  any,
  AddChildPayload,
  { rejectValue: string }
>("children/addChild", async (payload, thunkAPI) => {
  try {
    const response = await parentApi.addChild(payload);
    if (response?.child == null) {
      return thunkAPI.rejectWithValue("children.add_failed");
    }
    return response.child;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.add_failed";

    return thunkAPI.rejectWithValue(message);
  }
});

export const getMyChildrenThunk = createAsyncThunk<
  any[],
  void,
  { rejectValue: string }
>("children/getMyChildren", async (_, thunkAPI) => {
  try {
    const response = await parentApi.getMyChildren();
    const list = response?.children;
    return Array.isArray(list) ? list : [];
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.fetch_failed";

    return thunkAPI.rejectWithValue(message);
  }
});