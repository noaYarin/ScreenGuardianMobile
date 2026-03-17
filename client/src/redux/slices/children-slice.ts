import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addChildThunk, getMyChildrenThunk } from "../thunks/childrenThunks";

export type Child = {
  _id: string;
  name: string;
  birthDate?: string;
  gender?: string;
  interests?: string[];
};

type AddChildPayload = {
  name: string;
  birthDate: string;
  gender?: string;
};

type ChildrenState = {
  children: Child[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ChildrenState = {
  children: [],
  isLoading: false,
  error: null,
};


const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {
    setChildrenError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearChildrenError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChildThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addChildThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.children.push(action.payload);
      })
      .addCase(addChildThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "children.add_failed";
      })

      .addCase(getMyChildrenThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyChildrenThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.children = action.payload;
      })
      .addCase(getMyChildrenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "children.fetch_failed";
      });


  },
});

export const { setChildrenError, clearChildrenError } = childrenSlice.actions;
export default childrenSlice.reducer;