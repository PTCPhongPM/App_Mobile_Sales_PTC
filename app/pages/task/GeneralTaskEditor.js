import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../components/Base/BasePage";
import InputLabel from "../../components/Input/InputLabel";
import SelectField from "../../components/Input/SelectField";
import TextInput from "../../components/Input/TextInput";

import gStyles from "../../configs/gStyles";
import {
  Calendar,
  RadioChecked2,
  RadioUnChecked,
  Time,
} from "../../configs/assets";

import { getCustomerName, toDate, toISO } from "../../helper/utils";
import { useCreateTaskMutation } from "../../store/api/task";
import { useNotification } from "../../providers/NotificationProvider";

const formatTime = (time) => dayjs(time).format("HH:mm");

const schema = yup.object().shape({
  date: yup.string().required(),
  startingTime: yup.string().required(),
  endingTime: yup.string().required(),
  content: yup.string().required(),
  type: yup.string().required(),
  customer: yup.object().nullable(true).when("type", {
    is: "customer",
    then: yup.object().required(),
  }),
});

const GeneralTaskEditor = ({ navigation }) => {
  const notification = useNotification();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: "customer",
    },
  });

  const type = watch("type");
  const customer = watch("customer");
  const startingTime = watch("startingTime");
  const endingTime = watch("endingTime");

  const [createTask, { isLoading, isSuccess }] = useCreateTaskMutation();

  const loading = isLoading;

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      const _data = {
        content: data.content,
        date: toISO(data.date),
        startingTime: formatTime(data.startingTime),
        endingTime: formatTime(data.endingTime),
        saleId: type === "customer" ? customer?.sales[0].id : null,
      };

      createTask(_data);
    },
    [createTask, customer?.sales, type]
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

  const handleChooseCustomer = useCallback(
    () =>
      navigation.navigate("CustomerPicker", {
        selected: customer,
        onSelect: (value) => {
          setValue("customer", value, { shouldValidate: true });
        },
      }),
    [navigation, customer, setValue]
  );

  return (
    <BasePage loading={loading}>
      <View
        bg-white
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <View row paddingT-8>
          <TouchableOpacity
            row
            flex
            centerV
            onPress={() => {
              setValue("type", "self");
              setValue("customer", null);
            }}
          >
            <Text body2 marginR-4>
              Chính mình
            </Text>
            {type === "customer" ? (
              <RadioUnChecked fill={Colors.textBlackHigh} />
            ) : (
              <RadioChecked2 fill={Colors.primary900} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            row
            flex-2
            centerV
            onPress={() => setValue("type", "customer")}
          >
            <Text body2 marginR-4>
              Khách hàng
            </Text>
            {type === "customer" ? (
              <RadioChecked2 fill={Colors.primary900} />
            ) : (
              <RadioUnChecked fill={Colors.textBlackHigh} />
            )}
          </TouchableOpacity>
        </View>

        {type === "customer" && (
          <View row marginT-10 centerV>
            <InputLabel text="Khách hàng" required />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors?.customer)}
              label={customer ? getCustomerName(customer) : ""}
              onPress={handleChooseCustomer}
            />
          </View>
        )}

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
          <InputLabel text="Ngày thực hiện" required />
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
                  minimumDate={new Date()}
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
          <InputLabel text="Bắt đầu từ" required />
          <View flex-2>
            <Controller
              name="startingTime"
              defaultValue={null}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="time"
                  title="Bắt đầu từ"
                  value={value}
                  timeFormat="HH:mm"
                  maximumDate={endingTime}
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn giờ"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={<Time fill={Colors.textBlackHigh} />}
                    />
                  )}
                />
              )}
            />
          </View>
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Kết thúc" required />
          <View flex-2>
            <Controller
              name="endingTime"
              defaultValue={null}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="time"
                  title="Kết thúc"
                  value={value}
                  minimumDate={startingTime}
                  timeFormat="HH:mm"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn giờ"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={<Time fill={Colors.textBlackHigh} />}
                    />
                  )}
                />
              )}
            />
          </View>
        </View>
      </View>
    </BasePage>
  );
};

GeneralTaskEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      task: PropTypes.object,
    }),
  }),
};

export default GeneralTaskEditor;
