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
  selectProduct: {},
};

export const slice = createSlice({
  name: "testDrive",
  initialState,
  reducers: {
    setQuery: (state, { payload }) => {
      state.query = {
        ...state.query,
        ...payload,
      };
    },
    setSelectedProduct: (state, { payload }) => {
      state.selectProduct = payload;
    },
    resetQuery: (state) => {
      state.query = initialState.query;
    },
  },
});

export const { setQuery, resetQuery, setSelectedProduct } = slice.actions;

export const selectQuery = (state) => state.testDrive.query;
export const getSelectProduct = (state) => state.testDrive.selectProduct;

export default slice.reducer;
