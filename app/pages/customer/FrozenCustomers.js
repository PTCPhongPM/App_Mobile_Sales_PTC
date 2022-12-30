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

import { Close, Search, Tune } from "../../configs/assets";

import gStyles from "../../configs/gStyles";

import BasePage from "../../components/Base/BasePage";
import FrozenCustomer from "./tabs/FrozenCustomer";

const tabs = [
  { label: "Tất cả", byRule: undefined },
  { label: "Chủ động", byRule: true },
  { label: "Bị động", byRule: false },
];

const FrozenCustomers = ({ navigation }) => {
  const [isSearchMore, setSearchMode] = useState(false);
  const [filter, setFilter] = useState("");

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
        headerTitle: "Khách hàng đóng băng",
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
              <FrozenCustomer
                key={element.label}
                byRule={element.byRule}
                filter={filter}
              />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </BasePage>
  );
};

FrozenCustomers.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default FrozenCustomers;
