import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";
import { FlatList, RefreshControl } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";

import NotificationCard from "../../../components/Card/NotificationCard";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import {
  SolidDelete,
  SolidMarkRead,
  SolidMarkUnread,
} from "../../../configs/assets";

import {
  useDeleteNotificationMutation,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsUnreadMutation,
} from "../../../store/api/notification";

const NotificationTab = ({ queryFunc }) => {
  const navigation = useNavigation();
  const { data = [], isFetching, refetch } = queryFunc();

  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [markNotificationAsUnread] = useMarkNotificationAsUnreadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleItemPressed = useCallback(
    (notification) => {
      switch (notification.category) {
        case "customer":
          navigation.navigate("CustomerDetails", {
            customer: { code: notification.data.customer },
          });
          break;
        case "testdrive":
          navigation.navigate("TestDriveDetails", {
            testDrive: { id: notification.data.testdrive },
          });
          break;
        case "contract":
          if (notification.data.request) {
            navigation.navigate("RequestDetails", {
              request: { id: notification.data.request },
            });
          } 
          else if (notification.data.deliverySchedule) {
            navigation.navigate("DeliveryScheduleDetails", {
              deliverySchedule: { id: notification.data.deliverySchedule },canRedirect: true,
            });
          } 
          else {
            navigation.navigate("ContractDetails", {
              contract: { id: notification.data.contract },
            });
          }

          break;
        case "task":
          navigation.navigate("TaskDetails", {
            task: { id: notification.data.task },
          });
      }

      if (!notification.isRead) {
        markNotificationAsRead({ id: notification.id });
      }
    },
    [markNotificationAsRead, navigation]
  );

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      }
      keyExtractor={(item) => item.id}
      renderItem={({ item: notification }) => (
        <SwipeWrapper
          leftActions={[
            {
              text: "Xoá",
              color: Colors.stateRedDefault,
              icon: <SolidDelete fill={Colors.surface} />,
              onPress: () => deleteNotification({ id: notification.id }),
            },
          ]}
          rightActions={
            notification.isRead
              ? [
                  {
                    text: "Chưa đọc",
                    color: Colors.neutral300,
                    icon: <SolidMarkUnread fill={Colors.surface} />,
                    onPress: () =>
                      markNotificationAsUnread({ id: notification.id }),
                  },
                ]
              : [
                  {
                    text: "Đã đọc",
                    color: Colors.stateBlueDefault,
                    icon: <SolidMarkRead fill={Colors.surface} />,
                    onPress: () =>
                      markNotificationAsRead({ id: notification.id }),
                  },
                ]
          }
        >
          <NotificationCard
            notification={notification}
            onPress={() => handleItemPressed(notification)}
          />
        </SwipeWrapper>
      )}
      ListEmptyComponent={() => (
        <View flex center paddingV-16>
          <Text body2>Không có thông báo</Text>
        </View>
      )}
    />
  );
};

NotificationTab.propTypes = {
  queryFunc: PropTypes.func,
};

export default memo(NotificationTab);
