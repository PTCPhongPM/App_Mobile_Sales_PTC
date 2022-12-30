import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import { useSelector } from "react-redux";

import {
  Assets,
  Avatar,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import {
  ImageBackground,
  NativeModules,
  Platform,
  ScrollView,
} from "react-native";

import { SolidNotification } from "../../configs/assets";

import { useStatusBar } from "../../helper/hooks";
import { useGetNotificationStatsQuery } from "../../store/api/notification";
import { useGetMyRankQuery } from "../../store/api/summary";
import { getAccount } from "../../store/slices/account";

import DashboardGlorySection from "./DashboardGlorySection";
import DashboardMenuSection from "./DashboardMenuSection";
import DashboardRankSection from "./DashboardRankSection";
import DashboardStatsSection from "./DashboardStatsSection";
import DashboardTargetSection from "./DashboardTargetSection";

const StatusBarHeight = Platform.select({
  ios: NativeModules.StatusBarManager.HEIGHT,
  android: 0,
});

const statusBar = Platform.select({
  ios: "dark-content",
  android: "light-content",
});

const Dashboard = ({ navigation }) => {
  useStatusBar(statusBar);

  const { data: stats = {} } = useGetNotificationStatsQuery(
    {},
    { pollingInterval: 10000 }
  );

  const { data: myRank = {} } = useGetMyRankQuery({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });

  const hasNotification = useMemo(
    () => Object.keys(stats).some((key) => stats[key] > 0),
    [stats]
  );

  const account = useSelector(getAccount);

  const handleNotificationPress = useCallback(
    () => navigation.navigate("Notifications"),
    [navigation]
  );

  return (
    <View flex bg-surface>
      <ImageBackground
        source={Assets.images.background.dashboardHeader}
        resizeMode="stretch"
      >
        <View height={StatusBarHeight} />
      </ImageBackground>

      <ScrollView bounces={false}>
        <ImageBackground source={Assets.images.background.dashboard}>
          <View paddingV-3 paddingH-16 row centerV>
            <Avatar
              name={account.name}
              source={{ uri: account.avatar?.url }}
              size={40}
              resizeMode="cover"
            />
            <View flex marginL-8>
              <Text subtitle1>Xin chào 👋🏻</Text>
              <Text subtitle1 uppercase>
                {account.name}
              </Text>
            </View>
            <TouchableOpacity paddingH-6 onPress={handleNotificationPress}>
              <SolidNotification
                fill={
                  hasNotification ? Colors.primary900 : Colors.textBlackHigh
                }
              />
            </TouchableOpacity>
          </View>

          <DashboardStatsSection />
        </ImageBackground>

        <DashboardMenuSection />
        <DashboardTargetSection myRank={myRank} />

        <DashboardGlorySection />

        <DashboardRankSection myRank={myRank} />

        <Text body2 textBlackMedium center marginT-12 marginB-60>
          Chúc bạn một ngày làm việc hiệu quả!
        </Text>
      </ScrollView>
    </View>
  );
};

Dashboard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default Dashboard;
