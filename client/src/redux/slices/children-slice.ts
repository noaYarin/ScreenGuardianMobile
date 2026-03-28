import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addChildThunk,
  getMyChildrenThunk,
  fetchCurrentChildProfileThunk,
  updateCurrentChildProfileThunk,
} from "../thunks/childrenThunks";
import { logout } from "./auth-slice"; 

export type ChildGender = "boy" | "girl" | "other";

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
      })

      // Fetch current child profile for child home screen 
      .addCase(fetchCurrentChildProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentChildProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const child = action.payload;
        const idx = state.childrenList.findIndex(
          (c) => String(c._id) === String(child._id)
        );
        if (idx >= 0) {
          state.childrenList[idx] = child as Child;
        } else {
          state.childrenList.push(child as Child);
        }
      })
      .addCase(fetchCurrentChildProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "children.profile_failed";
      })
      .addCase(logout, (state) => {
        state.childrenList = [];
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateCurrentChildProfileThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrentChildProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedChild = action.payload; 

        state.childrenList = state.childrenList.map((child) =>
          child._id === updatedChild._id ? updatedChild : child
        );

      })
      .addCase(updateCurrentChildProfileThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = state.error = (action.payload as string) || action.error.message || "Update failed";
      })
  },
});

export const { setChildrenError, clearChildrenError } = childrenSlice.actions;
export default childrenSlice.reducer;