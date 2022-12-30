import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "vi",
  isDarkTheme: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setDarkTheme: (state, action) => {
      state.isDarkTheme = action.payload;
    },
  },
});

export const { setLanguage, setDarkTheme } = settingsSlice.actions;

export const selectLanguage = (state) => state.settings.language;

export const selectIsDarkTheme = (state) => state.settings.isDarkTheme;

export default settingsSlice.reducer;
