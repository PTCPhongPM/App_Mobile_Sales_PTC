import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Toast } from "react-native-ui-lib/src/incubator";
import { Button, Colors, View } from "react-native-ui-lib";
import { Delete, Edit } from "../../configs/assets";

import BasePage from "../../components/Base/BasePage";
import TextRow from "../../components/TextRow";

import { useNotification } from "../../providers/NotificationProvider";
import { showDeleteAlert } from "../../helper/alert";
import { checkSaleActive } from "../../helper/utils";

import gStyles from "../../configs/gStyles";

import {
  useDeleteFavoriteProductMutation,
  useGetFavoriteProductQuery,
} from "../../store/api/sale";

const FavoriteProductDetails = ({ navigation, route }) => {
  const { product, customer } = route.params;
  const notification = useNotification();

  const { data, isFetching } = useGetFavoriteProductQuery({ id: product.id });
  const [deleteFavoriteProduct, { isLoading, isSuccess }] =
    useDeleteFavoriteProductMutation();

  const loading = isFetching || isLoading;
  const productDetails = useMemo(() => data || product, [data, product]);

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  const handleEditPressed = useCallback(
    () =>
      navigation.navigate("FavoriteProductEditor", {
        otherBrand: false,
        sale: customer.sales[0],
        product: productDetails,
      }),
    [customer.sales, navigation, productDetails]
  );

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá xe quan tâm",
        "Bạn có chắc chắn muốn xoá xe quan tâm?",
        () => deleteFavoriteProduct({ id: product.id })
      ),
    [deleteFavoriteProduct, product.id]
  );

  useEffect(() => {
    if (isSaleActive) {
      navigation.setOptions({
        headerRight: () => (
          <View row>
            <Button
              link
              paddingH-8
              disabled={loading}
              onPress={handleEditPressed}
            >
              <Edit fill={Colors.surface} />
            </Button>
            <Button
              link
              paddingR-16
              paddingL-8
              disabled={loading}
              onPress={handleDelete}
            >
              <Delete fill={Colors.surface} />
            </Button>
          </View>
        ),
      });
    }
  }, [handleDelete, handleEditPressed, isSaleActive, loading, navigation]);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const info = useMemo(
    () => [
      {
        label: "Mục đích sử dụng",
        value: productDetails.intendedUse,
      },
      {
        label: "Hình thức mua",
        value: productDetails.buyingType,
      },
      {
        label: "Loại xe",
        value: productDetails.favoriteModel?.model.description,
      },
      {
        label: "MTO",
        value: productDetails.product.name,
      },
      {
        label: "Màu xe",
        value: productDetails.exteriorColor.name,
      },
      {
        label: "Màu nội thất",
        value: productDetails.interiorColor?.name,
      },
    ],
    [
      productDetails.buyingType,
      productDetails.exteriorColor.name,
      productDetails.favoriteModel?.model.description,
      productDetails.intendedUse,
      productDetails.interiorColor?.name,
      productDetails.product.name,
    ]
  );

  return (
    <BasePage hasScroll={false} loading={loading}>
      <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        {info.map((e, i) => (
          <TextRow
            key={e.label}
            left={e.label}
            right={e.value}
            marginT-0={i === 0}
          />
        ))}
      </View>
    </BasePage>
  );
};

FavoriteProductDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      product: PropTypes.object,
    }),
  }),
};

export default FavoriteProductDetails;
