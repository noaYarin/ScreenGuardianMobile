import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetPendingRequests,
  apiDecideRequest,
  type ParentExtensionRequest,
} from "../../api/requests";

export const fetchPendingRequestsThunk = createAsyncThunk<
  ParentExtensionRequest[],
  { childId?: string },
  { rejectValue: string }
>("requests/fetchPending", async ({ childId }, thunkAPI) => {
  try {
    return await apiGetPendingRequests(childId);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});

export const decideRequestThunk = createAsyncThunk<
  ParentExtensionRequest,
  { requestId: string; decision: "APPROVED" | "REJECTED" },
  { rejectValue: string }
>("requests/decide", async ({ requestId, decision }, thunkAPI) => {
  try {
    return await apiDecideRequest(requestId, decision);
  } catch (error) {
    return thunkAPI.rejectWithValue(
      (error as Error)?.message ?? "api.generic_error"
    );
  }
});