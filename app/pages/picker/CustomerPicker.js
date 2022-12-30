import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";
import ItemPicker from "../../components/Picker/ItemPicker";

import gStyles from "../../configs/gStyles";
import { Search } from "../../configs/assets";
import { getCustomerName, removeAccents } from "../../helper/utils";

import { useGetLeadsQuery } from "../../store/api/customer";

const { TextField } = Incubator;

const CustomerPicker = ({ navigation, route: { params } }) => {
  const { selected, onSelect } = params;
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { data, refetch, isFetching } = useGetLeadsQuery({});

  const [filter, setFilter] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
    });
  }, [handleBack, isFetching, navigation]);

  const handleItemPressed = useCallback(
    (item) => {
      onSelect(item);
      navigation.goBack();
    },
    [navigation, onSelect]
  );

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());

    return data
      ? data.filter((e) =>
          removeAccents(getCustomerName(e).toLowerCase()).includes(_filter)
        )
      : [];
  }, [data, filter]);

  const renderItem = useCallback(
    ({ item }) => (
      <ItemPicker
        title={getCustomerName(item)}
        subtitle={item.code}
        selected={item.id === selected?.id}
        onPress={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, selected?.id]
  );

  return (
    <View useSafeArea flex bg-surface>
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

CustomerPicker.propTypes = {
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

export default CustomerPicker;
