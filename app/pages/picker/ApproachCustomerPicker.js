import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { removeAccents } from "../../helper/utils";
import { CustomerApproachSourcesSCA } from "../../helper/constants";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import ItemPicker from "../../components/Picker/ItemPicker";

const ApproachCustomerPicker= () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [filter, setFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState(params.selected || []);

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
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item));
      } else {
        setSelectedItems([...selectedItems, item]);
      }
    },
    [selectedItems]
  );

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());
    return CustomerApproachSourcesSCA.filter((e) =>
      removeAccents(e.toLowerCase()).includes(_filter)
    );
  }, [filter]);

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedItems.includes(item);
      return (
        <ItemPicker
          title={
            isSelected
              ? item
              : item.length > 50
              ? `${item.slice(0, 50)}...`
              : item
          }
          selected={isSelected}
          onPress={() => handleItemPressed(item)}
        />
      );
    },
    [handleItemPressed, selectedItems]
  );

  const handleSave = useCallback(() => {
    params.onSelect(selectedItems);
    navigation.goBack();
  }, [navigation, params, selectedItems]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        selectedItems.length > 0 && (
          <Button link paddingH-16 onPress={handleSave}>
            <Text headerAction>Lưu</Text>
          </Button>
        ),
    });
  }, [handleSave, navigation, selectedItems]);

  return (
    <View useSafeArea flex bg-surface>
      <View padding-16>
        <Incubator.TextField
          placeholder="Tìm kiếm"
          value={filter}
          onChangeText={setFilter}
          containerStyle={gStyles.searchContainer}
          style={gStyles.search}
          leadingAccessory={<Search fill={Colors.textBlackMedium} />}
        />
      </View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default ApproachCustomerPicker;
