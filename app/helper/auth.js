import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

import apiConfig from "../configs/api";
import { setToken } from "../store/api";

const secondTicks = 1000;

// Async function
export const getAccessToken = () =>
  AsyncStorage.getItem(apiConfig.accessTokenKey);

export const saveAccessToken = (token) => {
  if (token) {
    AsyncStorage.setItem(apiConfig.accessTokenKey, token);
  } else {
    AsyncStorage.removeItem(apiConfig.accessTokenKey);
  }
  setToken(token);
};

export const getUserLoged= () =>
  AsyncStorage.getItem('code');

export const saveUserLoged = (user) => {
  if (user) {
    AsyncStorage.setItem('code', user.code);
  } else {
    AsyncStorage.removeItem('code');
  }
  
};
export const isAuthTokenValid = (accessToken) => {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / secondTicks;

    return decoded && decoded.exp && decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};
