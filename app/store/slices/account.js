import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  account: {
    name: "",
    email: "",
    phoneNumber: "",
    avatar: {
      url: "",
    },
    branch: {
      name: "",
    },
    role: {
      name: "",
    },
  },
};

export const slice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (_, { payload }) => payload,
  },
});

export const { setAccount } = slice.actions;

export const getAccount = (state) => state.account.account;

export default slice.reducer;
