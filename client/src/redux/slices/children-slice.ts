import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addChildThunk, getMyChildrenThunk } from "../thunks/childrenThunks";

export type ChildGender = "BOY" | "GIRL" | "OTHER";

export type ChildRole = "CHILD" | "PARENT";

export type ChildAvatar = {
  level?: number;
  img?: string;
  currentXp?: number;
  nextLevelXp?: number;
};

export type Child = {
  _id: string;
  name: string;
  birthDate?: string;
  gender?: ChildGender;
  interests?: string[];
  coins: number;
  isActive: boolean;
  role: ChildRole;
  achievementIds?: string[];
  avatar?: ChildAvatar;
};

type ChildrenState = {
  childrenList: Child[];
  isLoading: boolean;
  error: string | null;
};

const initialState: ChildrenState = {
  childrenList: [],
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
        state.childrenList.push(action.payload);
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
        state.childrenList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getMyChildrenThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "children.fetch_failed";
      });


  },
});

export const { setChildrenError, clearChildrenError } = childrenSlice.actions;
export default childrenSlice.reducer;