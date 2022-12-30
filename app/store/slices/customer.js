import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: {
    sortby: "firstLetter",
    orderby: "asc",
    scope: "mine",
    process: null,
    paymentMethod: null,
    source: null,
    from: null,
    to: null,
  },
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    resetQuery: (state) => {
      state.query = initialState.query;
    },
  },
});

export const { setQuery, resetQuery } = customerSlice.actions;

export const selectQuery = (state) => state.customer.query;

export default customerSlice.reducer;
