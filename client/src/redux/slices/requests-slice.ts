import { createSlice } from "@reduxjs/toolkit";
import type { ParentExtensionRequest } from "../../api/requests";
import {
  fetchPendingRequestsThunk,
  decideRequestThunk,
} from "../thunks/requestThunks";
import { logout } from "./auth-slice";

type RequestsState = {
  pending: ParentExtensionRequest[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: RequestsState = {
  pending: [],
  status: "idle",
  error: null,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingRequestsThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPendingRequestsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pending = action.payload;
        state.error = null;
      })
      .addCase(fetchPendingRequestsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error.message ?? "api.generic_error";
      })
      .addCase(decideRequestThunk.fulfilled, (state, action) => {
        state.pending = state.pending.filter(
          (req) => String(req._id) !== String(action.payload._id)
        );
      })
      .addCase(logout, (state) => {
        state.pending = [];
        state.status = "idle";
        state.error = null;
      });
  },
});

export default requestsSlice.reducer;