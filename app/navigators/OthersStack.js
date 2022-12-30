import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Others from "../pages/home/tabs/Others";

import BoughtCustomers from "../pages/customer/BoughtCustomers";
import FromCompanyCustomers from "../pages/customer/FromCompanyCustomers";
import FrozenCustomers from "../pages/customer/FrozenCustomers";
import LostCustomers from "../pages/customer/LostCustomers";
import ModelList from "../pages/product/ModelList";
import Inventory from "../pages/product/Inventory";

import TestDriveFilterSettings from "../pages/testDrive/modals/TestDriveFilterSettings";
import TestDriveManagement from "../pages/testDrive/TestDriveManagement";

import Approval from "../pages/approval/Approval";

import DeliverySchedule from "../pages/deliverySchedule/DeliverySchedule";

import ArrowBackButton from "../components/Button/ArrowBackButton";

import { typography } from "../configs/themes";
import gStyles from "../configs/gStyles";

const Stack = createStackNavigator();

const OthersStack = () => (
  <Stack.Navigator
    initialRouteName="Others"
    screenOptions={{
      headerBackTitleVisible: false,
      headerTitleAlign: "center",
      headerStyle: gStyles.headerStyle,
      headerTitleStyle: typography.headerTitle,
      headerBackImage: ArrowBackButton,
    }}
  >
    <Stack.Screen
      name="Others"
      component={Others}
      options={{
        headerTitle: "Khác",
      }}
    />
    <Stack.Screen
      name="ModelList"
      component={ModelList}
      options={{
        headerTitle: "Sản phẩm",
        headerLeft: null,
      }}
    />
    <Stack.Screen
      name="Inventory"
      component={Inventory}
      options={{
        headerTitle: "Tồn kho",
        headerLeft: null,
      }}
    />
    <Stack.Screen name="FrozenCustomers" component={FrozenCustomers} />
    <Stack.Screen name="LostCustomers" component={LostCustomers} />
    <Stack.Screen name="BoughtCustomers" component={BoughtCustomers} />
    <Stack.Screen
      name="FromCompanyCustomers"
      component={FromCompanyCustomers}
    />

    <Stack.Screen name="TestDriveManagement" component={TestDriveManagement} />
    <Stack.Screen
      name="TestDriveFilterSettings"
      component={TestDriveFilterSettings}
      options={{
        gestureEnabled: false,
        headerTitle: "Cài đặt bộ lọc",
        presentation: "modal",
      }}
    />

    <Stack.Screen
      name="Approval"
      component={Approval}
      options={{
        headerTitle: "Phê duyệt",
      }}
    />

    <Stack.Screen name="DeliverySchedule" component={DeliverySchedule} />
  </Stack.Navigator>
);

export default OthersStack;
