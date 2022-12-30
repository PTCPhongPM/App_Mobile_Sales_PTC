import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Splash from "../pages/auth/Splash";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

const Stack = createStackNavigator();

const RootStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="MainStack" component={MainStack} />
    <Stack.Screen name="AuthStack" component={AuthStack} />
  </Stack.Navigator>
);

export default RootStack;
