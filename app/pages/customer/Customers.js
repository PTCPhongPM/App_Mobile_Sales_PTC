import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Colors,
  Incubator,
  LoaderScreen,
  TabController,
  View,
} from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";
import Fab from "../../components/Button/Fab";

import gStyles from "../../configs/gStyles";
import { Close, Search, Tune } from "../../configs/assets";
import { useStatusBar } from "../../helper/hooks";

import CustomerTab from "./tabs/Customer";

const tabs = [
  { label: "Tất cả" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" },
];

const Customers = ({ navigation }) => {
  useStatusBar("light-content");
  const [isSearchMore, setSearchMode] = useState(false);
  const [filter, setFilter] = useState("");

  const toggleSearchMode = useCallback(() => setSearchMode((pre) => !pre), []);

  const handleFilter = useCallback(
    () => navigation.navigate("CustomerFilterSettings"),
    [navigation]
  );

  const handleFabPress = useCallback(
    () => navigation.navigate("CustomerEditor", {}),
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
        headerTitle: "Khách hàng tiềm năng",
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

  return (
    <BasePage hasScroll={false}>
      <TabController items={tabs}>
        <TabController.TabBar />
        <View flex>
          {tabs.map((element, index) => (
            <TabController.TabPage
              key={element.label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <CustomerTab state={element.value} filter={filter} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
      <Fab onPress={handleFabPress} color={Colors.primary900} />
    </BasePage>
  );
};

Customers.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default Customers;
