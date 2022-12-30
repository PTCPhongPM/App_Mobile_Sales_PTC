import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";
import { Linking, RefreshControl, SectionList } from "react-native";
import { useSelector } from "react-redux";

import BasePage from "../../components/Base/BasePage";
import CustomerBoughtCard from "../../components/Card/CustomerBoughtCard";
import Headline from "../../components/Header/Headline";
import SwipeWrapper from "../../components/Swipe/SwipeWrapper";

import {
  Close,
  DirectionsCar,
  Search,
  SolidPhone,
  Tune,
} from "../../configs/assets";

import { checkSaleDone, groupCustomers } from "../../helper/utils";
import { useGetCustomerListBoughtQuery } from "../../store/api/customer";
import { selectQuery } from "../../store/slices/customer";
import { useStatusBar } from "../../helper/hooks";

import gStyles from "../../configs/gStyles";

const BoughtCustomers = ({ navigation }) => {
  useStatusBar("light-content");
  const [isSearchMore, setSearchMode] = useState(false);
  const [filter, setFilter] = useState("");

  // todo need handle filter by scope
  const { sortby, scope, orderby, ...otherQuery } = useSelector(selectQuery);

  const { data = [], isFetching, refetch } = useGetCustomerListBoughtQuery();

  const toggleSearchMode = useCallback(() => setSearchMode((pre) => !pre), []);
  const handleFilter = useCallback(
    () =>
      navigation.navigate("CustomerFilterSettings", {
        isBoughtCustomer: true,
      }),
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
        headerTitle: "Khách hàng đã mua",
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

  return (
    <BasePage hasScroll={false}>
      <SectionList
        sections={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={isFetching}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item: customer, index }) => (
          <View marginT-5={Boolean(index)}>
            <SwipeWrapper
              rightActions={
                checkSaleDone(customer)
                  ? [
                      {
                        text: "Gọi",
                        color: Colors.stateGreenDefault,
                        icon: <SolidPhone fill={Colors.surface} />,
                        onPress: () =>
                          Linking.openURL(`tel:${customer.phoneNumber}`),
                      },
                      {
                        text: "Mua thêm",
                        color: Colors.stateBlueDefault,
                        icon: <DirectionsCar fill={Colors.surface} />,
                        //todo
                        onPress: () => {},
                      },
                    ]
                  : [
                      {
                        text: "Gọi",
                        color: Colors.stateGreenDefault,
                        icon: <SolidPhone fill={Colors.surface} />,
                        onPress: () =>
                          Linking.openURL(`tel:${customer.phoneNumber}`),
                      },
                    ]
              }
            >
              <CustomerBoughtCard
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

BoughtCustomers.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default BoughtCustomers;
