import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { useSelector } from "react-redux";

import { StatusBar } from "react-native";

import { getAccount } from "../store/slices/account";

export const useStatusBar = (style, animated = true) => {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, animated);
    }, [animated, style])
  );
};

export const useDirectorRole = () => {
  const account = useSelector(getAccount);
  return account.role.id === 2;
};
export const useSaleAdminRole = () => {
  const account = useSelector(getAccount);
  return account.role.id === 4;
};
