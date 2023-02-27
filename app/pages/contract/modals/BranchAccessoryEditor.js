import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { ScrollView } from "react-native";
import { Button, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import PriceSummaryCard from "../../../components/Card/PriceSummaryCard";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";
import { useNotification } from "../../../providers/NotificationProvider";

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
  Formalities,
  FormalityObj,
} from "../../../helper/constants";

import {
  useCreateAccessoryBranchMutation,
  useUpdateAccessoryBranchMutation,
} from "../../../store/api/request";

const schema = yup.object().shape({
  formality: yup.string().required(),
  accessory: yup.object().required(),
  amount: yup.number().integer().min(1).required(),
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

const BranchAccessoryEditor = ({ navigation, route: { params } }) => {
  const { onChange, branchAccessory,productCode  } = params;
  const notification = useNotification();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [createAccessoryBranch, { data: newAccessory, isLoading, isSuccess }] =
    useCreateAccessoryBranchMutation();

  const [
    updateAccessoryBranch,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateAccessoryBranchMutation();

  const loading = isLoading || isUpdating;

  const defaultValues = useMemo(
    () =>
      branchAccessory
        ? {
            ...branchAccessory,
          }
        : {},
    [branchAccessory]
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
      notification.showMessage(
        "Tạo phụ kiện thành công",
        Toast.presets.SUCCESS
      );
      onChange?.({ ...newAccessory, isNew: true });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation, newAccessory, onChange]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage(
        "Cập nhật phụ kiện thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const accessory = watch("accessory");
  const formality = watch("formality");
  const discountType = watch("discountType");
  const discount = watch("discount");
  const amount = watch("amount");

  const totalPrice = accessory?.price * amount;

  const discountNumber = computeDiscountNumber(
    accessory?.price * amount,
    discount,
    discountType
  );

  const total = computeTotalNumber(accessory?.price * amount, discountNumber);

  const handleSave = useCallback(
    (data) => {
      if (branchAccessory) {
        updateAccessoryBranch({
          ...data,
          total,
          accessoryId: accessory?.id,
        });
      } else {
        createAccessoryBranch({
          ...data,
          total,
          accessoryId: accessory?.id,
        });
      }
    },
    [
      accessory?.id,
      branchAccessory,
      total,
      createAccessoryBranch,
      updateAccessoryBranch,
    ]
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
          disabled={isLoading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, isLoading, navigation]);

  const handleFormalityClicked = useCallback(() => {
    setActionConfig({
      key: "formality",
      items: obj2WheelItems(Formalities),
      onChange: (value) => {
        if (value !== FormalityObj.sell) {
          setValue("discountType", null);
          setValue("discount", null);
        }

        setValue("formality", value, { shouldValidate: true });
      },
      onCancel: () => setValue("formality", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleAccessoryClicked = useCallback(() => {
    navigation.navigate("BranchAccessoryPicker", {
      productCode:productCode,
      selected: accessory,
      onSelect: (value) =>
        setValue("accessory", value, { shouldValidate: true }),
    });
  }, [accessory, navigation, setValue]);

  const handleDiscountTypeClicked = useCallback(() => {
    setActionConfig({
      key: "discountType",
      items: obj2WheelItems(DiscountTypes),
      onChange: (value) =>
        setValue("discountType", value, { shouldValidate: true }),
      onCancel: () => {
        setValue("discountType", null, { shouldValidate: true });
        setValue("discount", null, { shouldValidate: true });
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
                <InputLabel text="Mã phụ kiện" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  error={Boolean(errors.accessory)}
                  label={accessory?.code}
                  onPress={handleAccessoryClicked}
                />
              </View>

              <TextRow
                capitalize
                left="Tên phụ kiện"
                leftRequired
                rightDisabled
                right={accessory?.name}
              />

              <TextRow
                capitalize
                left="Đơn vị"
                leftRequired
                rightDisabled
                right={accessory?.unit}
              />

              <TextRow
                capitalize
                left="Đơn giá"
                leftRequired
                rightDisabled
                right={currencyFormatter(accessory?.price)}
              />

              <View row centerV marginT-10>
                <InputLabel text="Số lượng" required={true} />
                <View flex-2>
                  <Controller
                    name="amount"
                    control={control}
                    defaultValue={1}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập"
                        keyboardType="numeric"
                        value={value ? String(value) : ""}
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
                  disabled={formality !== ExtendedFormalityObj.sell}
                  error={Boolean(errors.discountType)}
                  label={DiscountTypes[discountType]}
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
                        disabled={
                          !discountType ||
                          formality !== ExtendedFormalityObj.sell
                        }
                        returnKeyType="done"
                        placeholder="Nhập"
                        keyboardType="numeric"
                        value={value}
                        error={error}
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
                left="Thành tiền"
                rightDisabled
                right={currencyFormatter(total)}
              />
            </View>
          </ScrollView>
        </View>

        <PriceSummaryCard
          price={currencyFormatter(totalPrice)}
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

BranchAccessoryEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onChange: PropTypes.func,
      branchAccessory: PropTypes.object,
    }),
  }),
};

export default BranchAccessoryEditor;
