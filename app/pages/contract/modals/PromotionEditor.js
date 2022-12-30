import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Button, Text, View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNotification } from "../../../providers/NotificationProvider";
import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import PriceSummaryCard from "../../../components/Card/PriceSummaryCard";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";

import {
  computeDiscountNumber,
  computeTotalNumber,
  currencyFormatter,
  discountFormatter,
  obj2WheelItems,
} from "../../../helper/utils";
import {
  DiscountTypes,
  ExtendedFormalities,
  ExtendedFormalityObj,
} from "../../../helper/constants";

import {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
} from "../../../store/api/request";

const schema = yup.object().shape({
  promotion: yup.object().required(),
  formality: yup.string().required(),
  amount: yup.number().required(),
  discountType: yup.string().nullable(true),
  discount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true)
    .when("discountType", {
      is: (discountType) => discountType !== null && discountType !== undefined,
      then: yup.number().required(),
    }),
});

const PromotionEditor = ({ navigation, route: { params } }) => {
  const { onChange, requestPromotion } = params;
  const notification = useNotification();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [createPromotion, { data: newItem, isLoading, isSuccess }] =
    useCreatePromotionMutation();

  const [
    updatePromotion,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdatePromotionMutation();

  const loading = isLoading || isUpdating;

  const defaultValues = useMemo(
    () =>
      requestPromotion
        ? {
            ...requestPromotion,
          }
        : {},
    [requestPromotion]
  );

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Tạo thành công", Toast.presets.SUCCESS);
      onChange?.({ ...newItem, isNew: true });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation, newItem, onChange]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const promotion = watch("promotion");
  const amount = watch("amount");
  const formality = watch("formality");
  const discountType = watch("discountType");
  const discount = watch("discount");

  const discountNumber = computeDiscountNumber(
    promotion?.price * amount,
    discount,
    discountType
  );

  const total = computeTotalNumber(promotion?.price * amount, discountNumber);

  const handleSave = useCallback(
    (data) => {
      if (requestPromotion) {
        updatePromotion({
          ...data,
          total,
          promotionId: promotion?.id,
        });
      } else {
        createPromotion({
          ...data,
          total,
          promotionId: promotion?.id,
        });
      }
    },
    [createPromotion, promotion?.id, requestPromotion, total, updatePromotion]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
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
  }, [handleBack, handleSave, handleSubmit, loading, navigation]);

  const handleFormalityClicked = useCallback(() => {
    setActionConfig({
      key: "formality",
      items: obj2WheelItems(ExtendedFormalities),
      onChange: (value) => {
        if (value !== ExtendedFormalityObj.sell) {
          setValue("discountType", null);
          setValue("discount", null);
        }

        setValue("formality", value, { shouldValidate: true });
      },
      onCancel: () => setValue("formality", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handlePromotionClicked = useCallback(() => {
    navigation.navigate("PromotionPicker", {
      selected: promotion,
      onSelect: (value) =>
        setValue("promotion", value, { shouldValidate: true }),
    });
  }, [promotion, navigation, setValue]);

  const handleDiscountTypeClicked = useCallback(() => {
    setActionConfig({
      key: "discountType",
      items: obj2WheelItems(DiscountTypes),
      onChange: (value) =>
        setValue("discountType", value, { shouldValidate: true }),
      onCancel: () => {
        setValue("discountType", null);
        setValue("discount", null);
      },
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage loading={loading} hasScroll={false}>
      <View flex spread>
        <View flexS style={[gStyles.borderV, gStyles.shadow]}>
          <ScrollView contentContainerStyle={gStyles.basePage}>
            <View bg-white padding-16>
              <View row centerV>
                <InputLabel text="Hình thức" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  error={Boolean(errors.formality)}
                  label={ExtendedFormalities[formality]}
                  onPress={handleFormalityClicked}
                />
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Mã khuyến mại" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  error={Boolean(errors.promotion)}
                  label={promotion?.code}
                  onPress={handlePromotionClicked}
                />
              </View>

              <TextRow
                capitalize
                left="Nội dung"
                leftRequired
                rightDisabled
                right={promotion?.description}
              />

              <TextRow
                capitalize
                left="Đơn giá"
                leftRequired
                rightDisabled
                right={currencyFormatter(promotion?.price)}
              />

              <View row centerV marginT-10>
                <InputLabel text="Số lượng" required />
                <View flex-2>
                  <Controller
                    name="amount"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        value={value ? String(value) : "1"}
                        error={error}
                        isError={Boolean(error)}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Loại giảm giá" />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  error={Boolean(errors.discountType)}
                  label={DiscountTypes[discountType]}
                  disabled={formality !== ExtendedFormalityObj.sell}
                  onPress={handleDiscountTypeClicked}
                />
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Giảm giá" required={discountType} />
                <View flex-2>
                  <Controller
                    name="discount"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        value={value}
                        error={error}
                        disabled={
                          !discountType ||
                          formality !== ExtendedFormalityObj.sell
                        }
                        formatter={(value) =>
                          discountFormatter(value, discountType)
                        }
                        isError={Boolean(error)}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <TextRow
                capitalize
                left="Thành tiền"
                rightDisabled
                right={currencyFormatter(total)}
              />
            </View>
          </ScrollView>
        </View>

        <PriceSummaryCard
          price={currencyFormatter(promotion?.price * amount)}
          discount={currencyFormatter(discountNumber)}
          total={currencyFormatter(total)}
        />
      </View>

      <BottomWheelPicker
        key={actionConfig.key}
        initialValue={getValues(actionConfig.key)}
        visible={actionShown}
        items={actionConfig.items}
        onChange={actionConfig.onChange}
        onCancel={actionConfig.onCancel}
        onDismiss={handleDismiss}
      />
    </BasePage>
  );
};

PromotionEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onChange: PropTypes.func,
      requestPromotion: PropTypes.object,
    }),
  }),
};

export default PromotionEditor;
