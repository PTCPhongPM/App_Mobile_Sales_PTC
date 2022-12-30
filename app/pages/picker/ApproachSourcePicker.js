import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { removeAccents } from "../../helper/utils";
import { CustomerApproachSources } from "../../helper/constants";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import ItemPicker from "../../components/Picker/ItemPicker";

const ApproachSourcePicker = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [filter, setFilter] = useState("");

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
    return CustomerApproachSources.filter((e) =>
      removeAccents(e.toLowerCase()).includes(_filter)
    );
  }, [filter]);

  const renderItem = useCallback(
    ({ item }) => (
      <ItemPicker
        title={item}
        selected={item === params.selected}
        onPress={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, params.selected]
  );

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

export default ApproachSourcePicker;
