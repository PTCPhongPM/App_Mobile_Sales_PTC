import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { useSelector } from "react-redux";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";
import { Linking, RefreshControl, SectionList } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import { useNotification } from "../../providers/NotificationProvider";
import BasePage from "../../components/Base/BasePage";
import CustomerFrozenLostCard from "../../components/Card/CustomerFrozenLostCard";
import Headline from "../../components/Header/Headline";
import SwipeWrapper from "../../components/Swipe/SwipeWrapper";

import {
  Close,
  PersonAdd,
  Search,
  SolidPhone,
  Tune,
} from "../../configs/assets";

import { groupCustomers } from "../../helper/utils";
import {
  useGetCustomerListLostQuery,
  useReceiveCustomerMutation,
} from "../../store/api/customer";

import { selectQuery } from "../../store/slices/customer";
import { useStatusBar } from "../../helper/hooks";

import gStyles from "../../configs/gStyles";

const LostCustomers = ({ navigation }) => {
  useStatusBar("light-content");
  const notification = useNotification();

  const [filter, setFilter] = useState("");

  const { data = [], isFetching, refetch } = useGetCustomerListLostQuery();

  const [receiveCustomer, { isLoading, isSuccess }] =
    useReceiveCustomerMutation();

  const loading = isFetching || isLoading;

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Nhận khách thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  // todo need handle filter by scope
  const { sortby, scope, orderby, ...otherQuery } = useSelector(selectQuery);

  const [isSearchMore, setSearchMode] = useState(false);
  const toggleSearchMode = useCallback(() => setSearchMode((pre) => !pre), []);

  const handleFilter = useCallback(
    () => navigation.navigate("CustomerFilterSettings"),
    [navigation]
  );

  useEffect(() => {
    if (isSearchMore) {
      navigation.setOptions({
        headerTitleAlign: "left",
        headerLeft: null,
        headerTitle: () => (
          <Incubator.TextField
            autoFocus
            placeholder="Tìm kiếm                                                                                                              "
            selectionColor={Colors.surface}
            style={[gStyles.search, { color: Colors.surface }]}
            leadingAccessory={<Search fill={Colors.surface} />}
            placeholderTextColor={Colors.textWhiteMedium}
            value={filter}
            onChangeText={setFilter}
          />
        ),
        headerRight: () => (
          <Button
            link
            paddingH-16
            onPress={() => {
              toggleSearchMode();
              setFilter("");
            }}
          >
            <Close fill={Colors.white} />
          </Button>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: "Khách hàng mất",
        headerTitleAlign: "center",
        headerLeft: () => (
          <Button link paddingH-16 onPress={handleFilter}>
            <Tune fill={Colors.white} />
          </Button>
        ),
        headerRight: () => (
          <Button link paddingH-16 onPress={toggleSearchMode}>
            <Search fill={Colors.white} />
          </Button>
        ),
      });
    }
  }, [filter, handleFilter, isSearchMore, navigation, toggleSearchMode]);

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

  // const handleReceiveCustomer = useCallback(
  //   ({ code }) => receiveCustomer({ code }),
  //   [receiveCustomer]
  // );
  const handleReceiveCustomer = useCallback(
    async ({ code }) => {
      const result = await receiveCustomer({ code });
      // Now you can use the 'result' for further processing
      navigation.navigate('CustomerDetails', {
        selectedTabIndex: 2, // Specify the tab screen name
        customer: result.data , // Pass additional parameters if needed
      });
    },
    [receiveCustomer]
  );
  return (
    <BasePage hasScroll={false}>
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
            <Text body2>Không có khách hàng</Text>
          </View>
        )}
      />
    </BasePage>
  );
};

LostCustomers.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default LostCustomers;
