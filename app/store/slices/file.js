import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
};

export const slice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
  },
});

export const { setLoading } = slice.actions;

export const getLoadState = (state) => state.file.loading;

export default slice.reducer;
