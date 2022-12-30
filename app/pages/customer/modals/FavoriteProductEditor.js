import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Button, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import { useNotification } from "../../../providers/NotificationProvider";
import gStyles from "../../../configs/gStyles";

import { BuyingTypes, IntendedUses } from "../../../helper/constants";

import { useGetAllModelListQuery } from "../../../store/api/model";
import {
  useCreateFavoriteProductMutation,
  useCreateFavoriteProductOtherMutation,
  useUpdateFavoriteProductMutation,
} from "../../../store/api/sale";
import {
  useGetExteriorColorsQuery,
  useGetInteriorColorsQuery,
  useGetProductListAllQuery,
} from "../../../store/api/product";
import { arr2WheelItems } from "../../../helper/utils";

const favoriteSchema = yup.object().shape({
  model: yup.object().required(),
  product: yup.object().required(),
  exteriorColor: yup.object().required(),
  intendedUse: yup.string().nullable(true),
  buyingType: yup.string().nullable(true),
});

const otherBrandSchema = yup.object().shape({
  brand: yup.string().required(),
  model: yup.string().required(),
  product: yup.string().required(),
});

const FavoriteProductEditor = ({ navigation, route }) => {
  const notification = useNotification();
  const { otherBrand, sale, product } = route.params;

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(otherBrand ? otherBrandSchema : favoriteSchema),
    defaultValues: product
      ? {
          ...product,
          model: product.favoriteModel.model,
        }
      : {},
  });

  const model = watch("model");
  const productWatch = watch("product");
  const exteriorColor = watch("exteriorColor");

  const { data: models, isFetching: isFetchingModel } =
    useGetAllModelListQuery();

  const { data: products, isFetching: isProductsFetching } =
    useGetProductListAllQuery({ modelId: model?.id }, { skip: !model?.id });

  const [createFavoriteProduct, { isLoading, isSuccess }] =
    useCreateFavoriteProductMutation();

  const [
    updateFavoriteProduct,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateFavoriteProductMutation();

  const [
    createFavoriteProductOther,
    { isLoading: isOtherLoading, isSuccess: isOtherSuccess },
  ] = useCreateFavoriteProductOtherMutation();

  const { data: exteriorColors, isFetching: isFetchingExteriorColors } =
    useGetExteriorColorsQuery(
      { productId: productWatch?.id },
      { skip: !productWatch?.id }
    );

  const { data: interiorColors, isFetching: isFetchingInteriorColors } =
    useGetInteriorColorsQuery(
      { productId: productWatch?.id, exteriorColorId: exteriorColor?.id },
      { skip: !productWatch?.id || !exteriorColor?.id }
    );

  const loading =
    isFetchingModel ||
    isFetchingExteriorColors ||
    isFetchingInteriorColors ||
    isProductsFetching ||
    isLoading ||
    isOtherLoading ||
    isUpdating;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: otherBrand
        ? "Thêm xe quan tâm hãng khác"
        : "Thêm xe quan tâm",
      headerLeft: () => (
        <Button link paddingH-16 disabled={loading} onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          disabled={loading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, loading, navigation, otherBrand]);

  useEffect(() => {
    if (isSuccess || isOtherSuccess) {
      notification.showMessage(
        "Thêm xe quan tâm thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOtherSuccess, isSuccess, navigation]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage(
        "Cập nhật quan tâm thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleSave = useCallback(
    (data) => {
      if (otherBrand) {
        createFavoriteProductOther({
          brand: data.brand,
          model: data.model,
          product: data.product,
          saleId: sale.id,
        });
      } else {
        const _data = {
          saleId: sale.id,
          modelId: data.model.id,
          productId: data.product.id,
          intendedUse: data.intendedUse,
          buyingType: data.buyingType,
          exteriorColorId: data.exteriorColor.id,
        };
        if (data.interiorColor) {
          _data.interiorColorId = data.interiorColor.id;
        }

        if (product && product?.id) {
          _data.id = product.id;
          updateFavoriteProduct(_data);
        } else {
          createFavoriteProduct(_data);
        }
      }
    },
    [
      createFavoriteProduct,
      createFavoriteProductOther,
      otherBrand,
      product,
      sale.id,
      updateFavoriteProduct,
    ]
  );

  const handleIntendedUsePressed = useCallback(() => {
    setActionConfig({
      key: "intendedUse",
      items: arr2WheelItems(IntendedUses),
      onChange: (value) =>
        setValue("intendedUse", value, { shouldValidate: true }),
      onCancel: () => setValue("intendedUse", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleBuyingTypePressed = useCallback(() => {
    setActionConfig({
      key: "buyingType",
      items: arr2WheelItems(BuyingTypes),
      onChange: (value) => setValue("buyingType", value),
      onCancel: () => setValue("buyingType", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleModelPressed = useCallback(() => {
    setActionConfig({
      key: "model",
      items: models.map((element) => ({
        label: element.description,
        value: element,
      })),
      onChange: (value) => {
        setValue("model", value);
        setValue("product", null);
        setValue("exteriorColor", null);
        setValue("interiorColor", null);
      },
      onCancel: () => {
        setValue("model", null);
        setValue("product", null);
        setValue("exteriorColor", null);
        setValue("interiorColor", null);
      },
    });

    setActionShown(true);
  }, [models, setValue]);

  const handleProductPressed = useCallback(() => {
    setActionConfig({
      key: "product",
      items: products.map((element) => ({
        label: element.name,
        value: element,
      })),
      onChange: (value) => {
        setValue("product", value);
        setValue("exteriorColor", null);
        setValue("interiorColor", null);
      },
      onCancel: () => {
        setValue("product", null);
        setValue("exteriorColor", null);
        setValue("interiorColor", null);
      },
    });

    setActionShown(true);
  }, [products, setValue]);

  const handleExteriorColorPressed = useCallback(() => {
    if (!exteriorColors) return;

    setActionConfig({
      key: "exteriorColor",
      items: exteriorColors.map((element) => ({
        label: element.name,
        value: element,
      })),
      onChange: (value) => {
        setValue("exteriorColor", value, { shouldValidate: true });
        setValue("interiorColor", null);
      },
      onCancel: () => setValue("exteriorColor", null),
    });

    setActionShown(true);
  }, [exteriorColors, setValue]);

  const handleInteriorColorPressed = useCallback(() => {
    if (!interiorColors) return;

    setActionConfig({
      key: "interiorColor",
      items: interiorColors.map((element) => ({
        label: element.name,
        value: element,
      })),
      onChange: (value) => setValue("interiorColor", value),
      onCancel: () => setValue("interiorColor", null),
    });

    setActionShown(true);
  }, [interiorColors, setValue]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  return (
    <BasePage loading={loading}>
      {otherBrand ? (
        <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <View row centerV marginT-10>
            <InputLabel text="Hãng" required />
            <View flex-2>
              <Controller
                name="brand"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Loại xe" required />
            <View flex-2>
              <Controller
                name="model"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Mẫu xe" required />
            <View flex-2>
              <Controller
                name="product"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </View>
      ) : (
        <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <View row centerV>
            <InputLabel text="Mục đích sử dụng" />
            <SelectField
              flex-2
              placeholder="Chọn"
              label={getValues("intendedUse")}
              onPress={handleIntendedUsePressed}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Hình thức mua" />
            <SelectField
              flex-2
              placeholder="Chọn"
              label={getValues("buyingType")}
              onPress={handleBuyingTypePressed}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Loại xe" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.model)}
              disabled={isFetchingModel}
              label={model?.description}
              onPress={handleModelPressed}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Mẫu xe" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.product)}
              disabled={loading || !model}
              label={productWatch?.name}
              onPress={handleProductPressed}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Màu xe" required />
            <SelectField
              flex-2
              disabled={!productWatch}
              error={Boolean(errors.exteriorColor)}
              label={exteriorColor?.name}
              placeholder="Chọn"
              onPress={handleExteriorColorPressed}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Màu nội thất" />
            <SelectField
              flex-2
              disabled={!productWatch || !exteriorColor}
              error={Boolean(errors.interiorColor)}
              label={getValues("interiorColor")?.name}
              placeholder="Chọn"
              onPress={handleInteriorColorPressed}
            />
          </View>
        </View>
      )}

      <BottomWheelPicker
        key={actionConfig.key}
        initialValue={getValues(actionConfig.key)}
        visible={actionShown}
        items={actionConfig.items}
        onChange={actionConfig.onChange}
        onCancel={actionConfig.onCancel}
        onDismiss={onDismiss}
      />
    </BasePage>
  );
};

FavoriteProductEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      otherBrand: PropTypes.bool,
      product: PropTypes.object,
      sale: PropTypes.shape({
        id: PropTypes.number,
      }),
    }),
  }),
};

export default FavoriteProductEditor;
