import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import {
  Button,
  Colors,
  Image,
  Text,
  View,
  TouchableOpacity,
} from "react-native-ui-lib";

import { Checked, DefaultCar } from "../../configs/assets";

import { useGetTestProductListAllQuery } from "../../store/api/testProduct";

const TestDrivePicker = ({ navigation, route: { params } }) => {
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { data, isFetching, refetch } = useGetTestProductListAllQuery();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 disabled={isFetching} onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
    });
  }, [handleBack, isFetching, navigation]);

  const handleItemPressed = useCallback(
    (item) => {
      params.onSelect(item);
      navigation.goBack();
    },
    [navigation, params]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity onPress={() => handleItemPressed(item)}>
        <View
          flex
          row
          spread
          centerV
          padding-16
          bg-surface
          bg-stateGreenLight={item.id === params.selected?.id}
        >
          <View row centerV>
            {item.product?.photo?.url ? (
              <Image
                source={{ uri: item.product?.photo?.url }}
                width={80}
                height={40}
                resizeMode="contain"
              />
            ) : (
              <DefaultCar width={80} height={40} />
            )}
            <Text marginL-8>{item.model?.description} - {item.product?.name}</Text>
          </View>
          {item.id === params.selected?.id && (
            <Checked fill={Colors.stateGreenDark} />
          )}
        </View>
        <View bg-divider height={0.5} />
      </TouchableOpacity>
    ),
    [handleItemPressed, params]
  );

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      }
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

TestDrivePicker.defaultProps = {
  route: {
    params: {
      selected: {},
      onSelect: () => {},
    },
  },
};

TestDrivePicker.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      selected: PropTypes.object,
      onSelect: PropTypes.func,
    }),
  }),
};

export default TestDrivePicker;
