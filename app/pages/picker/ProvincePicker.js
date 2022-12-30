import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { removeAccents } from "../../helper/utils";
import { useGetProvincesQuery } from "../../store/api/province";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import ItemPicker from "../../components/Picker/ItemPicker";

const { TextField } = Incubator;

const ProvincePicker = ({ navigation, route: { params } }) => {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [filter, setFilter] = useState("");

  const { data, isFetching, refetch } = useGetProvincesQuery();

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
      params.onSelect(item);
      navigation.goBack();
    },
    [navigation, params]
  );

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());
    return data
      ? data.filter((e) =>
          removeAccents(e.name.toLowerCase()).includes(_filter)
        )
      : [];
  }, [data, filter]);

  const renderItem = useCallback(
    ({ item }) => (
      <ItemPicker
        title={item.name}
        selected={item.id === params.selected?.id}
        onPress={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, params.selected?.id]
  );

  return (
    <View bg-surface flex>
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
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={isFetching}
          />
        }
      />
    </View>
  );
};

ProvincePicker.propTypes = {
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
    }),
  }),
};

export default ProvincePicker;
