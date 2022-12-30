import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { FlatList, RefreshControl } from "react-native";

import BasePage from "../../components/Base/BasePage";
import ModelCard from "../../components/Card/ModelCard";

import { Close, Search } from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { removeAccents } from "../../helper/utils";
import { useGetAllModelListQuery } from "../../store/api/model";

const { TextField } = Incubator;

const ModelList = ({ navigation }) => {
  const { data, isFetching, refetch } = useGetAllModelListQuery();

  const [mode, setMode] = useState("view");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (mode === "view") {
      navigation.setOptions({
        headerTitle: "Sản phẩm",
        headerTitleAlign: "center",
        headerRight: () => (
          <Button link paddingH-16 onPress={() => setMode("search")}>
            <Search fill={Colors.white} />
          </Button>
        ),
      });
    } else if (mode === "search") {
      navigation.setOptions({
        headerTitleAlign: "left",
        headerTitle: () => (
          <TextField
            autoFocus
            placeholder="Tìm kiếm                                                                                                              "
            value={filter}
            onChangeText={setFilter}
            style={[gStyles.search, { color: Colors.surface }]}
            leadingAccessory={<Search fill={Colors.surface} />}
            placeholderTextColor={Colors.textWhiteMedium}
          />
        ),
        headerRight: () => (
          <Button
            link
            paddingH-16
            onPress={() => {
              setMode("view");
              setFilter("");
            }}
          >
            <Close fill={Colors.white} />
          </Button>
        ),
      });
    }
  }, [filter, mode, navigation]);

  const handleItemPress = useCallback(
    (model) => navigation.navigate("ModelDetails", { model }),
    [navigation]
  );

  const list = useMemo(() => {
    if (!data) return [];

    const _filter = removeAccents(filter.toLowerCase());
    return data.filter(
      (e) =>
        removeAccents(e.code.toLowerCase()).includes(_filter) ||
        removeAccents(e.brand.code.toLowerCase()).includes(_filter)
    );
  }, [data, filter]);

  const renderItem = useCallback(
    ({ item }) => (
      <ModelCard
        key={item.id}
        onPress={() => handleItemPress(item)}
        item={item}
      />
    ),
    [handleItemPress]
  );

  return (
    <BasePage hasScroll={false}>
      <FlatList
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            refreshing={isFetching}
            onRefresh={refetch}
          />
        }
        windowSize={13}
        removeClippedSubviews
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có sản phẩm</Text>
          </View>
        )}
      />
    </BasePage>
  );
};

ModelList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default ModelList;
