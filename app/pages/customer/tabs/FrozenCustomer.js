import React, { memo, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { Colors, Text, View } from "react-native-ui-lib";
import { Linking, RefreshControl, SectionList } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import CustomerFrozenLostCard from "../../../components/Card/CustomerFrozenLostCard";
import Headline from "../../../components/Header/Headline";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import {
  useGetCustomerListFrozenQuery,
  useReceiveCustomerMutation,
} from "../../../store/api/customer";

import { PersonAdd, SolidPhone } from "../../../configs/assets";
import { groupCustomers } from "../../../helper/utils";
import { selectQuery } from "../../../store/slices/customer";
import { useNotification } from "../../../providers/NotificationProvider";
import { useStatusBar } from "../../../helper/hooks";

const FrozenCustomerTab = ({ byRule, filter }) => {
  useStatusBar("light-content");
  const navigation = useNavigation();
  const notification = useNotification();

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetCustomerListFrozenQuery({
    byRule,
  });

  const [receiveCustomer, { isLoading, isSuccess }] =
    useReceiveCustomerMutation();

  const loading = isFetching || isLoading;

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Nhận khách thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const { sortby, orderby, scope, ...otherQuery } = useSelector(selectQuery);

  const handleItemPress = useCallback(
    (customer) => {
      navigation.navigate("CustomerDetails", { customer });
    },
    [navigation]
  );

  const list = useMemo(
    () => groupCustomers(data, sortby, orderby, filter, otherQuery),
    [data, filter, orderby, otherQuery, sortby]
  );

  const handleReceiveCustomer = useCallback(
    ({ code }) => receiveCustomer({ code }),
    [receiveCustomer]
  );

  return (
    <SectionList
      sections={list}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={loading}
        />
      }
      keyExtractor={(item) => item.id}
      renderItem={({ item: customer, index }) => (
        <View marginT-5={Boolean(index)}>
          <SwipeWrapper
            rightActions={[
              {
                text: "Gọi",
                color: Colors.stateGreenDefault,
                icon: <SolidPhone fill={Colors.surface} />,
                onPress: () => Linking.openURL(`tel:${customer.phoneNumber}`),
              },
              {
                text: "Nhận khách",
                color: Colors.stateBlueDefault,
                icon: <PersonAdd fill={Colors.surface} />,
                onPress: () => handleReceiveCustomer(customer),
              },
            ]}
          >
            <CustomerFrozenLostCard
              customer={customer}
              onPress={() => handleItemPress(customer)}
            />
          </SwipeWrapper>
        </View>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <View paddingT-12 bg-background>
          <Headline label={title} marginT-0 />
        </View>
      )}
      ListEmptyComponent={() => (
        <View flex center paddingV-16>
          <Text body2>Không có khách hàng đóng băng</Text>
        </View>
      )}
    />
  );
};

FrozenCustomerTab.propTypes = {
  byRule: PropTypes.any,
  filter: PropTypes.string,
};

export default memo(FrozenCustomerTab);
