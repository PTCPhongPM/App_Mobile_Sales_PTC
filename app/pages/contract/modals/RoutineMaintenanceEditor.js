import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Button, Text, View } from "react-native-ui-lib";
import { ScrollView } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

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
  monthsFormatter,
  obj2WheelItems,
} from "../../../helper/utils";

import {
  DiscountTypes,
  ExtendedFormalities,
  ExtendedFormalityObj,
} from "../../../helper/constants";
import { useNotification } from "../../../providers/NotificationProvider";

import {
  useCreateMaintenanceRoutineMutation,
  useUpdateMaintenanceRoutineMutation,
} from "../../../store/api/request";

const schema = yup.object().shape({
  maintenance: yup.object().required(),
  formality: yup.string().required(),
  duration: yup.number().integer().min(1).required(),
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

const RoutineMaintenanceEditor = ({ navigation, route: { params } }) => {
  const { onChange, routineMaintenance } = params;
  const notification = useNotification();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [createMaintenanceRoutine, { data: newItem, isLoading, isSuccess }] =
    useCreateMaintenanceRoutineMutation();

  const [
    updateMaintenanceRoutine,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateMaintenanceRoutineMutation();

  const loading = isLoading || isUpdating;

  const defaultValues = useMemo(
    () =>
      routineMaintenance
        ? {
            ...routineMaintenance,
          }
        : {},
    [routineMaintenance]
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

  const maintenance = watch("maintenance");
  const formality = watch("formality");
  const duration = watch("duration");
  const discountType = watch("discountType");
  const discount = watch("discount");

  const discountNumber = computeDiscountNumber(
    maintenance?.price * duration,
    discount,
    discountType
  );
  const total = computeTotalNumber(
    maintenance?.price * duration,
    discountNumber
  );

  const handleSave = useCallback(
    (data) => {
      if (routineMaintenance) {
        updateMaintenanceRoutine({
          ...data,
          total,
          maintenanceId: maintenance?.id,
        });
      } else {
        createMaintenanceRoutine({
          ...data,
          total,
          maintenanceId: maintenance?.id,
        });
      }
    },
    [
      maintenance?.id,
      routineMaintenance,
      total,
      createMaintenanceRoutine,
      updateMaintenanceRoutine,
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

  const handleMaintenanceClicked = useCallback(() => {
    navigation.navigate("MaintenancePicker", {
      selected: maintenance,
      onSelect: (value) =>
        setValue("maintenance", value, { shouldValidate: true }),
    });
  }, [maintenance, navigation, setValue]);

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
                <InputLabel text="Gói bảo dưỡng" required />
                <SelectField
                  flex-2
                  placeholder="Chọn"
                  error={Boolean(errors.maintenance)}
                  label={maintenance?.description}
                  onPress={handleMaintenanceClicked}
                />
              </View>

              <TextRow
                capitalize
                left="Đơn giá"
                leftRequired
                rightDisabled
                right={currencyFormatter(maintenance?.price)}
              />

              <View row centerV marginT-10>
                <InputLabel text="Thời hạn" required={true} />
                <View flex-2>
                  <Controller
                    name="duration"
                    control={control}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextInput
                        placeholder="Nhập số tháng"
                        keyboardType="numeric"
                        value={value}
                        error={error}
                        formatter={monthsFormatter}
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
                        returnKeyType="done"
                        keyboardType="numeric"
                        value={value}
                        error={error}
                        isError={Boolean(error)}
                        formatter={(value) =>
                          discountFormatter(value, discountType)
                        }
                        disabled={
                          !discountType ||
                          formality !== ExtendedFormalityObj.sell
                        }
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
          price={currencyFormatter(maintenance?.price * duration)}
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

RoutineMaintenanceEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onChange: PropTypes.func,
      routineMaintenance: PropTypes.object,
    }),
  }),
};

export default RoutineMaintenanceEditor;
