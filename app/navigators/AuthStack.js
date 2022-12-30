import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { typography } from "../configs/themes";

import ArrowBackButton from "../components/Button/ArrowBackButton";

import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";

import gStyles from "../configs/gStyles";

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Login"
    screenOptions={{
      headerBackTitleVisible: false,
      headerStyle: gStyles.headerStyle,
      headerTitleStyle: typography.headerTitle,
      headerBackImage: ArrowBackButton,
    }}
  >
    <Stack.Screen
      name="Login"
      component={Login}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{
        headerTitle: "Đặt lại mật khẩu",
      }}
    />
  </Stack.Navigator>
);

export default AuthStack;
