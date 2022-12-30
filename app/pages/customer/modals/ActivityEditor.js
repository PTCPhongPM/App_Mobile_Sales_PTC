import React, { useCallback, useEffect, useState } from "react";
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
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";
import { Calendar } from "../../../configs/assets";
import { ActivityResults, SaleActivities } from "../../../helper/constants";

import { useCreateSaleActivityMutation } from "../../../store/api/sale";
import { useNotification } from "../../../providers/NotificationProvider";
import {
  getCustomerName,
  arr2WheelItems,
  toISO,
  obj2WheelItems,
  toDate,
} from "../../../helper/utils";

const activitySchema = yup.object().shape({
  date: yup.string().required(),
  activity: yup.string().required(),
  content: yup.string().required(),
  result: yup.string().required(),
  note: yup.string().when("result", {
    is: "Khác",
    then: yup.string().required(),
  }),
});

const ActivityEditor = ({ navigation, route: { params } }) => {
  const customer = params.customer;
  const notification = useNotification();

  const [createSaleActivity, { isLoading, isSuccess }] =
    useCreateSaleActivityMutation();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(activitySchema),
  });

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) =>
      createSaleActivity({
        ...data,
        date: toISO(data.date),
        saleId: customer.sales[0].id,
      }),
    [createSaleActivity, customer.sales]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 disabled={isLoading} onPress={handleBack}>
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
          <Text headerAction>Tạo</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, isLoading, navigation]);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleActivityClicked = useCallback(() => {
    setActionConfig({
      key: "activity",
      items: obj2WheelItems(SaleActivities),
      onChange: (value) =>
        setValue("activity", value, { shouldValidate: true }),
      onCancel: () => setValue("activity", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleResultClicked = useCallback(() => {
    setActionConfig({
      key: "result",
      items: arr2WheelItems(ActivityResults),
      onChange: (value) => setValue("result", value, { shouldValidate: true }),
      onCancel: () => setValue("result", null),
    });
    setActionShown(true);
  }, [setValue]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  return (
    <BasePage loading={isLoading}>
      <View
        bg-surface
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <TextRow
          capitalize
          left="KH tiềm năng"
          leftRequired
          rightDisabled
          right={getCustomerName(customer)}
        />

        <View row centerV marginT-10>
          <InputLabel text="Ngày hẹn" required />
          <View flex-2>
            <Controller
              name="date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  title="Ngày hẹn"
                  value={toDate(value)}
                  dateFormat="DD/MM/YYYY"
                  maximumDate={new Date()}
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
          <InputLabel text="Phương thức" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.activity)}
            label={SaleActivities[getValues("activity")]}
            onPress={handleActivityClicked}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Nội dung" required />
          <View flex-2>
            <Controller
              name="content"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập nội dung"
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
          <InputLabel text="Kết quả" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.result)}
            label={getValues("result")}
            onPress={handleResultClicked}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel
            text="Ghi chú"
            required={getValues("result") === "Khác"}
          />
          <View flex-2>
            <Controller
              name="note"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập ghi chú"
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

ActivityEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.any,
    }),
  }),
};

export default ActivityEditor;
