import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useMemo } from "react";

import ArrowBackButton from "../components/Button/ArrowBackButton";
import {
  Bell,
  Description,
  Home,
  Personal,
  SolidBell,
  SolidDescription,
  SolidHome,
  SolidPersonal,
  SolidWidget,
  Widget,
} from "../configs/assets";
import gStyles from "../configs/gStyles";
import { colors, typography } from "../configs/themes";

import Contracts from "../pages/contract/Contracts";
import Dashboard from "../pages/dashboard/Dashboard";

import Customers from "../pages/customer/Customers";

import Notifications from "../pages/notification/Notifications";
import { useGetNotificationStatsQuery } from "../store/api/notification";
import OthersStack from "./OthersStack";

const Tab = createBottomTabNavigator();
const tabs = [
  {
    name: "Dashboard",
    title: "Trang chủ",
    component: Dashboard,
    icon: Home,
    focusedIcon: SolidHome,
    headerShown: false,
  },
  {
    name: "Customers",
    title: "Khách hàng",
    component: Customers,
    icon: Personal,
    focusedIcon: SolidPersonal,
  },
  {
    name: "Contracts",
    title: "Hợp đồng",
    component: Contracts,
    icon: Description,
    focusedIcon: SolidDescription,
  },
  {
    name: "Notifications",
    title: "Thông báo",
    component: Notifications,
    icon: Bell,
    focusedIcon: SolidBell,
  },
  {
    name: "OthersStack",
    title: "Khác",
    component: OthersStack,
    icon: Widget,
    focusedIcon: SolidWidget,
    headerShown: false,
  },
];

const tabBarStyle = [
  {
    backgroundColor: colors.surface,
    paddingTop: 4,
  },
  gStyles.borderT,
  gStyles.shadowUp,
];

const HomeTabs = () => {
  const { data: stats = {} } = useGetNotificationStatsQuery(
    {},
    { pollingInterval: 10000 }
  );

  const tabBarBadge = useMemo(() => {
    const count = Object.values(stats).reduce(
      (previous, current) => previous + current,
      0
    );

    if (!count) return null;

    return count && count > 99 ? `${count}+` : count;
  }, [stats]);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        lazy: true,
        tabBarActiveTintColor: colors.primary900,
        tabBarInactiveTintColor: colors.textBlackHigh,
        tabBarHideOnKeyboard: true,
        tabBarStyle,
        tabBarLabelStyle: typography.tabBarLabel,
        headerTitleAlign: "center",
        headerTitleStyle: typography.headerTitle,
        headerStyle: gStyles.headerStyle,
        headerBackImage: ArrowBackButton,
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();

              if (tab.name === "OthersStack") {
                navigation.navigate("OthersStack", {
                  screen: "Others",
                });
              } else {
                navigation.navigate(tab.name);
              }
            },
          })}
          options={{
            headerShown: tab.headerShown,
            title: tab.title,
            tabBarLabel: tab.title,
            tabBarBadge: tab.name === "Notifications" ? tabBarBadge : null,
            tabBarIcon: ({ color, focused }) => {
              const Icon = focused ? tab.focusedIcon : tab.icon;

              return <Icon fill={color} />;
            },
            tabBarBadgeStyle: typography.tabBarBadge,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default HomeTabs;
