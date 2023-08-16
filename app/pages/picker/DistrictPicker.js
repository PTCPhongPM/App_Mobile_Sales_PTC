import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl,ActivityIndicator } from "react-native";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { removeAccents } from "../../helper/utils";

import { useGetDistrictsQuery } from "../../store/api/district";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import ItemPicker from "../../components/Picker/ItemPicker";

const DistrictPicker = ({ navigation, route: { params } }) => {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [filter, setFilter] = useState("");

  const { data,isLoading,isError, isFetching, refetch } = useGetDistrictsQuery({
    provinceId: params.selected.province.id,
  });

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
        selected={item.id === params.selected.district?.id}
        onPress={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, params.selected.district?.id]
  );
  if (isLoading && list.length === 0) {
    return (
      <View flex center>
        <ActivityIndicator size="large" color={Colors.primary900} />
      </View>
    );
  }
  if (isError) {
    // Handle error state
    return (
      <View flex center>
        <Text>Error occurred while fetching data.</Text>
      </View>
    );
  }
  return (
    <View flex bg-surface>
      <View padding-16>
        <Incubator.TextField
          placeholder="Tìm kiếm"
          value={filter}
          onChangeText={setFilter}
          editable={!isLoading}
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
            refreshing={isLoading}
          />
        }
      />
    </View>
  );
};

DistrictPicker.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onSelect: PropTypes.func,
      selected: PropTypes.shape({
        district: PropTypes.shape({
          id: PropTypes.number,
        }),
        province: PropTypes.shape({
          id: PropTypes.number,
        }),
      }),
    }),
  }),
};

export default DistrictPicker;
