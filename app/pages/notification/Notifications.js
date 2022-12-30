import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { ScrollView } from "react-native";
import { Colors, LoaderScreen, TabController, View } from "react-native-ui-lib";
import ContextMenu from "react-native-context-menu-view";

import BasePage from "../../components/Base/BasePage";
import { useStatusBar } from "../../helper/hooks";
import { More } from "../../configs/assets";

import {
  useDeleteNotificationAllMutation,
  useMarkNotificationAsReadAllMutation,
  useGetContractNotificationListQuery,
  useGetCustomerNotificationListQuery,
  useGetTaskNotificationListQuery,
  useGetTestDriveNotificationListQuery,
  useGetNotificationStatsQuery,
} from "../../store/api/notification";

import gStyles from "../../configs/gStyles";

import NotificationTab from "./tabs/NotificationTab";

const tabs = [
  { category: "customer", func: useGetCustomerNotificationListQuery },
  { category: "testdrive", func: useGetTestDriveNotificationListQuery },
  { category: "contract", func: useGetContractNotificationListQuery },
  { category: "task", func: useGetTaskNotificationListQuery },
];

const getNumber = (text, stats) => (stats ? `${text} (${stats})` : `${text}`);

const Notifications = ({ navigation }) => {
  useStatusBar("light-content");

  const [selectedTab, setSelectedTab] = useState(0);

  const { data: stats = {} } = useGetNotificationStatsQuery(
    {},
    { pollingInterval: 10000 }
  );

  const labels = useMemo(
    () => [
      { label: getNumber("Khách hàng", stats.customer) },
      { label: getNumber("Lái thử", stats.testdrive) },
      { label: getNumber("Hợp đồng", stats.contract) },
      { label: getNumber("Công việc", stats.task) },
    ],
    [stats.contract, stats.customer, stats.task, stats.testdrive]
  );

  const [markNotificationAsReadAll] = useMarkNotificationAsReadAllMutation();
  const [deleteNotificationAll] = useDeleteNotificationAllMutation();

  const contextActions = useMemo(
    () => [
      {
        title: "Đánh dấu tất cả đã đọc",
        onPress: () =>
          markNotificationAsReadAll({
            category: tabs[selectedTab].category,
          }),
      },
      {
        title: "Xoá tất cả",
        destructive: true,
        onPress: () =>
          deleteNotificationAll({ category: tabs[selectedTab].category }),
      },
    ],
    [deleteNotificationAll, markNotificationAsReadAll, selectedTab]
  );

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => contextActions[index].onPress(),
    [contextActions]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View row>
          <ContextMenu
            actions={contextActions}
            dropdownMenuMode
            previewBackgroundColor="transparent"
            onPress={handelMenuPressed}
          >
            <View paddingR-16 paddingL-8>
              <More fill={Colors.surface} />
            </View>
          </ContextMenu>
        </View>
      ),
    });
  }, [contextActions, handelMenuPressed, navigation]);

  return (
    <BasePage hasScroll={false}>
      <TabController items={labels} onChangeIndex={setSelectedTab}>
        <ScrollView scrollEnabled={false} style={gStyles.tabBarScroll}>
          <TabController.TabBar faderProps={{ size: 0 }} />
        </ScrollView>
        <View flex style={gStyles.borderT}>
          {tabs.map((tab, index) => (
            <TabController.TabPage
              key={tab.category}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <NotificationTab queryFunc={tab.func} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </BasePage>
  );
};

Notifications.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }),
};

export default Notifications;
