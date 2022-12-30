import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: {
    filter: "",
    state: "",
    sortby: "createdAt",
    orderby: "desc",
    from: null,
    to: null,
  },
};

export const slice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setQuery: (state, { payload }) => {
      state.query = {
        ...state.query,
        ...payload,
      };
    },
    resetQuery: (state) => {
      state.query = initialState.query;
    },
  },
});

export const { setQuery, resetQuery } = slice.actions;

export const selectQuery = (state) => state.delivery.query;

export default slice.reducer;
