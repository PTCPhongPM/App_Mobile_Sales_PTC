import React, { useCallback, useEffect, useMemo, useState } from "react";

import PropTypes from "prop-types";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import gStyles from "../../../configs/gStyles";

import { Calendar } from "../../../configs/assets";
import {
  FrozenCustomerReasons,
  LostCustomerReasons,
} from "../../../helper/constants";
import { arr2WheelItems, toISO } from "../../../helper/utils";

import {
  useSetSaleAsFrozenMutation,
  useSetSaleAsLostMutation,
} from "../../../store/api/sale";

import { useNotification } from "../../../providers/NotificationProvider";

const lostSchema = yup.object().shape({
  lostDate: yup.string().required(),
  reasonType: yup.string().required(),
  reason: yup.string().required(),
  note: yup.string().nullable(true),
});

const frozenSchema = yup.object().shape({
  frozenDate: yup.string().required(),
  reason: yup.string().required(),
  note: yup.string().nullable(true),
});

const LostFrozenUpdate = ({ navigation, route: { params } }) => {
  const { customer, state } = params;
  const sale = customer.sales[0];

  const notification = useNotification();

  const [
    setSaleAsFrozen,
    { isLoading: frozenLoading, isSuccess: isFrozenSuccess },
  ] = useSetSaleAsFrozenMutation();

  const [setSaleAsLost, { isLoading: lostLoading, isSuccess: isLostSuccess }] =
    useSetSaleAsLostMutation();

  useEffect(() => {
    if (isFrozenSuccess) {
      notification.showMessage(
        "Đã chuyển tới danh sách khách hàng đóng băng",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFrozenSuccess, navigation]);

  useEffect(() => {
    if (isLostSuccess) {
      notification.showMessage(
        "Đã chuyển tới danh sách khách hàng đã mất",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLostSuccess, navigation]);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(state === "lost" ? lostSchema : frozenSchema),
  });

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const reasonType = watch("reasonType");

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      if (state === "lost") {
        setSaleAsLost({
          id: sale.id,
          customerCode: customer.code,
          lostDate: toISO(data.lostDate),
          note: data.note,
          reason: data.reason,
          reasonType: data.reasonType,
        });
      } else {
        setSaleAsFrozen({
          id: sale.id,
          customerCode: customer.code,
          frozenDate: toISO(data.frozenDate),
          note: data.note,
          reason: data.reason,
        });
      }
    },
    [customer.code, sale.id, setSaleAsFrozen, setSaleAsLost, state]
  );

  const headerTitle = useMemo(
    () => (state === "lost" ? "Cập nhật mất khách" : "Cập nhật đóng băng"),
    [state]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: headerTitle,
      headerLeft: () => (
        <Button
          link
          paddingH-16
          disabled={lostLoading || frozenLoading}
          onPress={handleBack}
        >
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          disabled={lostLoading || frozenLoading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [
    frozenLoading,
    handleBack,
    handleSave,
    handleSubmit,
    headerTitle,
    lostLoading,
    navigation,
  ]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  const handleLostReasonTypePressed = useCallback(() => {
    setActionConfig({
      key: "reasonType",
      items: arr2WheelItems(Object.keys(LostCustomerReasons)),
      onChange: (value) => {
        setValue("reasonType", value);
        setValue("reason", null);
      },
      onCancel: () => {
        setValue("reasonType", null);
        setValue("reason", null);
      },
    });

    setActionShown(true);
  }, [setValue]);

  const handleLostReasonPressed = useCallback(() => {
    setActionConfig({
      key: "reason",
      items: arr2WheelItems(LostCustomerReasons[reasonType]),
      onChange: (value) => setValue("reason", value, { shouldValidate: true }),
      onCancel: () => setValue("reason", null),
    });

    setActionShown(true);
  }, [reasonType, setValue]);

  const handleFrozenReasonPressed = useCallback(() => {
    setActionConfig({
      key: "reason",
      items: arr2WheelItems(FrozenCustomerReasons),
      onChange: (value) => setValue("reason", value, { shouldValidate: true }),
      onCancel: () => setValue("reason", null),
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage loading={lostLoading || frozenLoading}>
      {state === "lost" && (
        <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <View row centerV>
            <InputLabel text="Ngày mất khách" required />
            <View flex-2>
              <Controller
                name="lostDate"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    mode="date"
                    title="Ngày mất khách"
                    value={value}
                    dateFormat="DD/MM/YYYY"
                    onChange={onChange}
                    renderInput={({ value }) => (
                      <TextInput
                        placeholder="Chọn ngày"
                        value={value}
                        error={error}
                        isError={Boolean(error)}
                        trailingAccessory={
                          <Calendar fill={Colors.textBlackHigh} />
                        }
                      />
                    )}
                  />
                )}
              />
            </View>
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Loại lý do" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.reasonType)}
              label={reasonType}
              onPress={handleLostReasonTypePressed}
            />
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Lý do" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.reason)}
              disabled={!reasonType}
              label={getValues("reason")}
              onPress={handleLostReasonPressed}
            />
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Ghi chú" />
            <View flex-2>
              <Controller
                name="note"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập"
                    multiline
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
      )}

      {state === "frozen" && (
        <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <View row centerV>
            <InputLabel text="Ngày đóng băng" required />
            <View flex-2>
              <Controller
                name="frozenDate"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    mode="date"
                    minimumDate={new Date()}
                    title="Ngày đóng băng"
                    value={value}
                    dateFormat="DD/MM/YYYY"
                    onChange={onChange}
                    renderInput={({ value }) => (
                      <TextInput
                        placeholder="Chọn ngày"
                        value={value}
                        error={error}
                        isError={Boolean(error)}
                        trailingAccessory={
                          <Calendar
                            fill={Colors.textBlackHigh}
                            width={20}
                            height={20}
                          />
                        }
                      />
                    )}
                  />
                )}
              />
            </View>
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Lý do" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.reason)}
              label={getValues("reason")}
              onPress={handleFrozenReasonPressed}
            />
          </View>

          <View row centerV marginT-10>
            <InputLabel text="Ghi chú" />
            <View flex-2>
              <Controller
                name="note"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập"
                    multiline
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

LostFrozenUpdate.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      state: PropTypes.oneOf(["lost", "frozen"]),
    }),
  }),
};

export default LostFrozenUpdate;
