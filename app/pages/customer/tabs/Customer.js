import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { ActionSheet, Colors, Text, View } from "react-native-ui-lib";
import { Linking, RefreshControl, SectionList } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import CustomerCard from "../../../components/Card/CustomerCard";
import Headline from "../../../components/Header/Headline";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import {
  useDeleteCustomerMutation,
  useGetLeadsQuery,
  useUpdateCustomerMutation,
} from "../../../store/api/customer";

import { More, SolidPhone } from "../../../configs/assets";
import { selectQuery } from "../../../store/slices/customer";
import { groupCustomers } from "../../../helper/utils";
import { showDeleteAlert } from "../../../helper/alert";
import { useNotification } from "../../../providers/NotificationProvider";
import { CustomerStates } from "../../../helper/constants";

const CustomerTab = ({ state, filter }) => {
  const navigation = useNavigation();
  const notification = useNotification();

  const [selectedCustomer, setSelectedCustomer] = useState({});

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  // todo need handle filter by scope
  const { sortby, scope, orderby, ...otherQuery } = useSelector(selectQuery);

  const { data = [], isFetching, refetch } = useGetLeadsQuery({ state, scope });

  const [
    updateCustomer,
    { isSuccess: isUpdateSuccess, isLoading: isUpdating },
  ] = useUpdateCustomerMutation();

  const [
    deleteCustomer,
    { isSuccess: isDeleteSuccess, isLoading: isDeleting },
  ] = useDeleteCustomerMutation();

  const loading = isFetching || isUpdating || isDeleting;

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const list = useMemo(
    () => groupCustomers(data, sortby, orderby, filter, otherQuery),
    [data, filter, orderby, otherQuery, sortby]
  );

  const handleItemPress = useCallback(
    (customer) => {
      navigation.navigate("CustomerDetails", { customer });
    },
    [navigation]
  );

  const handleUpdateCustomerState = useCallback(
    (state) => {
      updateCustomer({
        code: selectedCustomer.code,
        state,
      });
    },
    [selectedCustomer.code, updateCustomer]
  );

  const actionSheetOptions = useMemo(
    () => [
      {
        label: "Xoá khách hàng",
        onPress: () =>
          showDeleteAlert(
            "Xoá khách hàng?",
            "Hành động này không thể hoàn tác",
            () => deleteCustomer({ code: selectedCustomer.code })
          ),
      },
      ...Object.keys(CustomerStates)
        .filter((state) => state !== selectedCustomer.state)
        .map((state) => ({
          label: `Chuyển ${CustomerStates[state]}`,
          onPress: () => handleUpdateCustomerState(state),
        })),

      { label: "Trở lại" },
    ],
    [
      deleteCustomer,
      handleUpdateCustomerState,
      selectedCustomer.code,
      selectedCustomer.state,
    ]
  );

  return (
    <>
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
                  text: "Khác",
                  color: Colors.neutral300,
                  icon: <More fill={Colors.surface} />,
                  onPress: () => {
                    setSelectedCustomer(customer);
                    handleActionSheetShow();
                  },
                },
              ]}
            >
              <CustomerCard
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
            <Text body2>Không có khách hàng</Text>
          </View>
        )}
      />

      <ActionSheet
        useNativeIOS
        useSafeArea
        destructiveButtonIndex={0}
        cancelButtonIndex={3}
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </>
  );
};

CustomerTab.propTypes = {
  filter: PropTypes.string,
  index: PropTypes.number,
  state: PropTypes.oneOf(["cold", "warm", "hot", undefined]),
};

export default memo(CustomerTab);
