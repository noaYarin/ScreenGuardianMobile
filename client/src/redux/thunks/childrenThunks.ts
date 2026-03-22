import { createAsyncThunk } from "@reduxjs/toolkit";
import * as parentApi from "@/src/api/parent";
import * as childApi from "@/src/api/child";
import type { Child } from "@/src/redux/slices/children-slice";

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

export const fetchCurrentChildProfileThunk = createAsyncThunk<
  Child,
  void,
  { rejectValue: string }
>("children/fetchCurrentChildProfile", async (_, thunkAPI) => {
  try {
    const response = await childApi.fetchCurrentChildProfile();
    if (response?.child == null) {
      return thunkAPI.rejectWithValue("children.profile_failed");
    }
    const raw = response.child;
    const child = {
      ...raw,
      _id: raw._id != null ? String(raw._id) : raw._id,
    };
    return child as Child;
  } catch (error) {
    const message =
      (error as Error)?.message ?? "children.profile_failed";
    return thunkAPI.rejectWithValue(message);
  }
});