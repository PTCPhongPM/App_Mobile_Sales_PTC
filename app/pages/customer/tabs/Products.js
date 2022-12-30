import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";

import CarFavoriteCard from "../../../components/Card/CarFavoriteCard";
import FavoriteModelCard from "../../../components/Card/FavoriteModelCard";
import Headline from "../../../components/Header/Headline";

import { useGetFavoriteProductsQuery } from "../../../store/api/sale";
import gStyles from "../../../configs/gStyles";
import { checkSaleActive } from "../../../helper/utils";

const Products = ({ customer }) => {
  const navigation = useNavigation();
  const sale = customer.sales[0];

  const {
    data: favoriteProducts = [],
    isFetching: isFavoriteProductFetching,
    refetch: refetchFavoriteProducts,
  } = useGetFavoriteProductsQuery(
    { saleId: sale?.id, isOther: false },
    { skip: !sale }
  );

  const {
    data: otherFavoriteProducts = [],
    isFetching: isOtherFavoriteProductFetching,
    refetch: refetchOtherFavoriteProducts,
  } = useGetFavoriteProductsQuery(
    { saleId: sale?.id, isOther: true },
    { skip: !sale }
  );

  const {
    data: boughtProducts = [],
    isFetching: isBoughtProductFetching,
    refetch: refetchBoughtProducts,
  } = useGetFavoriteProductsQuery(
    { saleId: sale?.id, isOther: false, state: "bought" },
    { skip: !sale }
  );

  const isLoading =
    isFavoriteProductFetching ||
    isOtherFavoriteProductFetching ||
    isBoughtProductFetching;

  const handleAddFavoriteProduct = useCallback(
    ({ otherBrand }) =>
      navigation.navigate("FavoriteProductEditor", {
        otherBrand,
        sale,
      }),
    [navigation, sale]
  );

  const handleUpdatePressed = useCallback(
    (product) => navigation.navigate("ProcessUpdate", { customer, product }),
    [customer, navigation]
  );

  const toFavoriteProductDetails = useCallback(
    (favoriteProduct) =>
      navigation.navigate("FavoriteProductDetails", {
        product: favoriteProduct.products[0],
        customer,
      }),
    [customer, navigation]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  return (
    <ScrollView
      paddingV-8
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={isLoading}
          onRefresh={() => {
            refetchFavoriteProducts();
            refetchOtherFavoriteProducts();
            refetchBoughtProducts();
          }}
        />
      }
    >
      <Headline
        label="Xe quan tâm"
        onPress={
          Boolean(favoriteProducts.length) && isSaleActive
            ? () => handleAddFavoriteProduct({ otherBrand: false })
            : null
        }
      />

      {favoriteProducts.length ? (
        <View style={[gStyles.borderV, gStyles.shadow]}>
          {favoriteProducts.map((product) => (
            <FavoriteModelCard
              key={product.id}
              item={product}
              onUpdate={
                isSaleActive ? () => handleUpdatePressed(product) : undefined
              }
              onPress={() => toFavoriteProductDetails(product)}
            />
          ))}
        </View>
      ) : (
        <View
          paddingV-16
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa có xe quan tâm
          </Text>
          {isSaleActive && (
            <Button
              borderRadius={4}
              outline
              outlineColor={Colors.primary900}
              marginT-8
              onPress={() => handleAddFavoriteProduct({ otherBrand: false })}
            >
              <Text primary900 button>
                Thêm xe quan tâm
              </Text>
            </Button>
          )}
        </View>
      )}

      <Headline
        label="Xe quan tâm hãng khác"
        marginT-12={!favoriteProducts.length}
        onPress={
          otherFavoriteProducts.length
            ? () => handleAddFavoriteProduct({ otherBrand: true })
            : null
        }
      />

      {otherFavoriteProducts.length ? (
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {otherFavoriteProducts.map((e) => (
            <CarFavoriteCard
              key={e.id}
              brand={e.brand}
              model={e.model}
              type={e.product}
            />
          ))}
        </View>
      ) : (
        <View
          paddingV-16
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa có xe quan tâm hãng khác
          </Text>
          {isSaleActive && (
            <Button
              borderRadius={4}
              outline
              outlineColor={Colors.primary900}
              marginT-8
              onPress={() => handleAddFavoriteProduct({ otherBrand: true })}
            >
              <Text primary900 button>
                Thêm xe quan tâm
              </Text>
            </Button>
          )}
        </View>
      )}

      <Headline label="Xe đã mua" />

      {boughtProducts.length ? (
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {boughtProducts.map((element) => (
            <FavoriteModelCard
              key={element.id}
              item={element}
              isBought
              onUpdate={undefined}
            />
          ))}
        </View>
      ) : (
        <View
          paddingV-16
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa mua xe
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

Products.propTypes = {
  customer: PropTypes.shape({
    sales: PropTypes.array,
  }),
};

export default Products;
