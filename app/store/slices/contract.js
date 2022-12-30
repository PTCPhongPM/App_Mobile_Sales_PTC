import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: {
    filter: "",
    state: "",
    orderby: "desc",
    paymentMethod: "",
    product: "",
    sortby: "createdAt",
    from: null,
    to: null,
  },
};

export const slice = createSlice({
  name: "contract",
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

export const selectQuery = (state) => state.contract.query;

export default slice.reducer;
