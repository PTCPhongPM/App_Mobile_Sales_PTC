import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { ScrollView } from "react-native";
import { Button, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import PriceSummaryCard from "../../../components/Card/PriceSummaryCard";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import {
  DiscountTypes,
  ExtendedFormalities,
  ExtendedFormalityObj,
  InsuranceTypes,
} from "../../../helper/constants";

import {
  arr2WheelItems,
  computeDiscountNumber,
  computeTotalNumber,
  currencyFormatter,
  discountFormatter,
  obj2WheelItems,
  yearsFormatter,
} from "../../../helper/utils";

import gStyles from "../../../configs/gStyles";
import {
  useCreateInsuranceMutation,
  useUpdateInsuranceMutation,
} from "../../../store/api/insurance";
import { useNotification } from "../../../providers/NotificationProvider";

const schema = yup.object().shape({
  method: yup.string().required(),
  type: yup.string().required(),
  name: yup.string().required(),
  years: yup.number().integer().required(),
  price: yup.number().integer().required(),
  discountType: yup
    .string()
    .nullable(true)
    .oneOf([...Object.keys(DiscountTypes), null]),
  discount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true)
    .when("discountType", {
      is: (discountType) => discountType !== null && discountType !== undefined,
      then: yup.number().required(),
    }),
});

const InsuranceEditor = ({ navigation, route: { params } }) => {
  const { customer, onChange, insurance } = params;
  const notification = useNotification();
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const [createInsurance, { data: newInsurance, isLoading, isSuccess }] =
    useCreateInsuranceMutation();

  const [
    updateInsurance,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateInsuranceMutation();

  const loading = isLoading || isUpdating;

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage(
        "Cập nhật bảo hiểm thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage(
        "Tạo bảo hiểm thành công",
        Toast.presets.SUCCESS
      );
      onChange?.({ ...newInsurance, isNew: true });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation, newInsurance, onChange]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: insurance,
  });

  const method = watch("method");
  const price = watch("price");
  const discountType = watch("discountType");
  const discount = watch("discount");

  const discountNumber = computeDiscountNumber(price, discount, discountType);
  const total = computeTotalNumber(price, discountNumber);

  const handleSave = useCallback(
    (data) => {
      if (insurance) {
        updateInsurance({
          ...data,
          id: insurance.id,
          total,
        });
      } else {
        createInsurance({
          ...data,
          saleId: customer?.sales[0].id,
          total,
        });
      }
    },
    [createInsurance, customer?.sales, insurance, total, updateInsurance]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: insurance ? "Cập nhật bảo hiểm" : "Tạo bảo hiểm",
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
  }, [handleBack, handleSave, handleSubmit, insurance, loading, navigation]);

  const handleChooseMethod = useCallback(() => {
    setActionConfig({
      key: "method",
      items: obj2WheelItems(ExtendedFormalities),
      onChange: (value) => {
        if (value !== ExtendedFormalityObj.sell) {
          setValue("discountType", null);
          setValue("discount", null);
        }

        setValue("method", value, { shouldValidate: true });
      },
      onCancel: () => setValue("method", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseType = useCallback(() => {
    setActionConfig({
      key: "type",
      items: arr2WheelItems(InsuranceTypes),
      onChange: (value) => {
        setValue("type", value, { shouldValidate: true });
        setValue("name", `Bảo hiểm ${value.toLowerCase()}`, {
          shouldValidate: true,
        });
      },
      onCancel: () => {
        setValue("type", null, {
          shouldValidate: true,
        });
        setValue("name", null, {
          shouldValidate: true,
        });
      },
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseDiscountType = useCallback(() => {
    setActionConfig({
      key: "discountType",
      items: obj2WheelItems(DiscountTypes),
      onChange: (value) => {
        setValue("discountType", value, {
          shouldValidate: true,
        });
      },
      onCancel: () => {
        setValue("discountType", null, { shouldValidate: true });
        setValue("discount", null, { shouldValidate: true });
      },
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage hasScroll={false} loading={loading}>
      <View spread flex>
        <View flexS style={[gStyles.borderV, gStyles.shadow]}>
          <ScrollView contentContainerStyle={gStyles.basePage}>
            <View padding-16 bg-surface>
              <View row centerV>
                <InputLabel text="Hình thức" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  label={ExtendedFormalities[getValues("method")]}
                  error={Boolean(errors.method)}
                  onPress={handleChooseMethod}
                />
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Loại bảo hiểm" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  label={getValues("type")}
                  error={Boolean(errors.type)}
                  onPress={handleChooseType}
                />
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Tên loại bảo hiểm" required />
                <View flex-2>
                  <Controller
                    name="name"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        error={Boolean(error)}
                        isError={Boolean(error)}
                        value={value}
                        editable={false}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Số năm" required />
                <View flex-2>
                  <Controller
                    name="years"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        error={Boolean(error)}
                        isError={Boolean(error)}
                        value={value}
                        formatter={yearsFormatter}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Giá thành" required />
                <View flex-2>
                  <Controller
                    name="price"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        returnKeyType="done"
                        error={Boolean(error)}
                        isError={Boolean(error)}
                        value={value}
                        formatter={currencyFormatter}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View row marginT-10 centerV>
                <InputLabel text="Loại giảm giá" />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  disabled={method !== ExtendedFormalityObj.sell}
                  label={DiscountTypes[discountType]}
                  error={Boolean(errors.discountType)}
                  onPress={handleChooseDiscountType}
                />
              </View>

              <View row marginT-10 centerV>
                <InputLabel text="Giảm giá" required={Boolean(discountType)} />
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
                        returnKeyType="done"
                        disabled={
                          !discountType || method !== ExtendedFormalityObj.sell
                        }
                        error={Boolean(error)}
                        isError={Boolean(error)}
                        value={value}
                        formatter={(value) =>
                          discountFormatter(value, discountType)
                        }
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <TextRow left="Thành tiền" right={currencyFormatter(total)} />
            </View>
          </ScrollView>
        </View>

        <PriceSummaryCard
          price={currencyFormatter(price)}
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

InsuranceEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      insurance: PropTypes.object,
      onChange: PropTypes.func,
    }),
  }),
};

export default InsuranceEditor;
