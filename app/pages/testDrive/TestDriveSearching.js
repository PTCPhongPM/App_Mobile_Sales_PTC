import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator } from "react-native-ui-lib";

import TestDriveCard from "../../components/Card/TestDriveCard";
import { Close } from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { useGetTestDriveListAllQuery } from "../../store/api/testDrive";
import { getCustomerName, removeAccents } from "../../helper/utils";

const TestDriveSearching = ({ navigation }) => {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => (
        <Incubator.TextField
          autoFocus
          placeholder="Tìm kiếm                                                                                                              "
          selectionColor={Colors.surface}
          style={[gStyles.search, { color: Colors.surface }]}
          placeholderTextColor={Colors.textWhiteMedium}
          value={filter}
          onChangeText={setFilter}
        />
      ),
      headerRight: () => (
        <Button link paddingH-16 onPress={() => setFilter("")}>
          <Close fill={Colors.white} />
        </Button>
      ),
    });
  }, [filter, navigation]);

  const { data = [], isFetching, refetch } = useGetTestDriveListAllQuery({});

  const toTestDriveDetails = useCallback(
    (testDrive) =>
      navigation.navigate("TestDriveDetails", {
        testDrive,
      }),
    [navigation]
  );

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());

    return data.filter((item) =>
      removeAccents(getCustomerName(item.customer).toLowerCase()).includes(
        _filter
      )
    );
  }, [data, filter]);

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      }
      data={list}
      renderItem={({ item }) => (
        <TestDriveCard
          isGeneralMode
          testDrive={item}
          onPress={() => toTestDriveDetails(item)}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

TestDriveSearching.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default TestDriveSearching;
