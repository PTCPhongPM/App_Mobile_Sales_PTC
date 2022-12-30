import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Text } from "react-native-ui-lib";

import AllocationProductCard from "../../components/Card/AllocationProductCard";

import { AllocationStates } from "../../helper/constants";

import { useGetAllocationProductsQuery } from "../../store/api/allocation";

const AllocationProductPicker = ({ navigation, route }) => {
  const { contract, selected } = route.params;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { data, isFetching, refetch } = useGetAllocationProductsQuery({
    contractId: contract.id,
    state: AllocationStates[2], // ready
  });

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
      route.params.onSelect(item);
      navigation.goBack();
    },
    [navigation, route.params]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <AllocationProductCard
        item={item}
        canSelect
        selected={item.id === selected?.id}
        onSelect={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, selected?.id]
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

AllocationProductPicker.defaultProps = {
  route: {
    params: {
      selected: {},
      onSelect: () => {},
    },
  },
};

AllocationProductPicker.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  onSelect: PropTypes.func,
  params: PropTypes.shape({
    selected: PropTypes.object,
    onSelect: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      contract: PropTypes.shape({
        id: PropTypes.any,
      }),
      onSelect: PropTypes.func,
      selected: PropTypes.object,
    }),
  }),
  selected: PropTypes.object,
};

export default AllocationProductPicker;
