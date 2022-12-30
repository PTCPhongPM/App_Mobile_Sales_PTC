import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";

import { Button, Colors, Text } from "react-native-ui-lib";
import CarCard from "../../components/Card/CarCard";
import Headline from "../../components/Header/Headline";

import { useGetFavoriteProductsQuery } from "../../store/api/sale";

const FavoriteProductPicker = ({ navigation, route: { params } }) => {
  const { customer, selected } = params;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetFavoriteProductsQuery({
    saleId: customer.sales[0].id,
    isOther: false,
    grouped: false,
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
      params.onSelect(item);
      navigation.goBack();
    },
    [navigation, params]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <CarCard
        model={item.product.name}
        type={item.favoriteModel.model.description}
        color={item.exteriorColor.name}
        inside={item.interiorColor?.name}
        image={item.product.photo?.url}
        canSelect
        selected={item.id === selected?.id}
        onSelect={() => handleItemPressed(item)}
      />
    ),
    [handleItemPressed, selected?.id]
  );

  const handleAddFavoriteProduct = useCallback(
    () =>
      navigation.navigate("FavoriteProductEditor", {
        otherBrand: false,
        sale: customer.sales[0],
      }),
    [customer.sales, navigation]
  );

  return (
    <>
      <Headline
        label="Xe quan tâm"
        onPress={handleAddFavoriteProduct}
        marginT-8
      />

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
    </>
  );
};

FavoriteProductPicker.defaultProps = {
  route: {
    params: {
      selected: {},
      onSelect: () => {},
    },
  },
};

FavoriteProductPicker.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.shape({
        sales: PropTypes.array,
      }),
      onSelect: PropTypes.func,
      selected: PropTypes.object,
    }),
  }),
};

export default FavoriteProductPicker;
