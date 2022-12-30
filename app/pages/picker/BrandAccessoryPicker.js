import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { removeAccents } from "../../helper/utils";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import ItemPicker from "../../components/Picker/ItemPicker";
import { useListAllBrandAccessoriesQuery } from "../../store/api/accessory";

const { TextField } = Incubator;

const BrandAccessoryPicker = ({ navigation, route: { params } }) => {
  const { selected, onSelect, productCode } = params;
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [filter, setFilter] = useState("");

  const { data, isFetching, refetch } = useListAllBrandAccessoriesQuery();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
    });
  }, [handleBack, navigation]);

  const handleItemPressed = useCallback(
    (item) => {
      onSelect(item);
      navigation.goBack();
    },
    [navigation, onSelect]
  );

  const matched = useMemo(() => {
    return (
      data?.filter((e) => {
        if (!e.productList || !productCode) return true;

        const arr = e.productList.split(",").map((e) => e.trim());
        return arr.includes(productCode);
      }) || []
    );
  }, [data, productCode]);

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());
    return (
      matched?.filter((e) => {
        const search = removeAccents(`${e.name} ${e.code}`.toLowerCase());
        return search.includes(_filter);
      }) || []
    );
  }, [matched, filter]);

  const renderItem = useCallback(
    ({ item }) => (
      <ItemPicker
        title={item.name}
        subtitle={item.code}
        selected={item.id === selected?.id}
        onPress={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, selected?.id]
  );

  return (
    <View flex bg-surface>
      <View padding-16>
        <TextField
          placeholder="Tìm kiếm"
          value={filter}
          onChangeText={setFilter}
          editable={!isFetching}
          containerStyle={gStyles.searchContainer}
          style={gStyles.search}
          leadingAccessory={<Search fill={Colors.textBlackMedium} />}
        />
      </View>

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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

BrandAccessoryPicker.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onSelect: PropTypes.func,
      selected: PropTypes.shape({
        id: PropTypes.number,
      }),
      productCode: PropTypes.string,
    }),
  }),
};

export default BrandAccessoryPicker;
