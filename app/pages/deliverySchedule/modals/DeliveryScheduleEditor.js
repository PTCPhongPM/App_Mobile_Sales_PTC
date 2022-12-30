import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { Alert } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import dayjs from "dayjs";

import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import ProductImage from "../../../components/ProductImage";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";

import { Calendar, Time } from "../../../configs/assets";
import { DeliveryPlaces, DeliveryStateObject } from "../../../helper/constants";
import {
  arr2WheelItems,
  getCustomerName,
  toDate,
  toISO,
} from "../../../helper/utils";
import { useNotification } from "../../../providers/NotificationProvider";
import {
  useCreateDeliveryScheduleMutation,
  useUpdateDeliveryScheduleMutation,
} from "../../../store/api/delivery";

const schema = yup.object().shape({
  allocation: yup.object().required(),
  compartment: yup.object().nullable(true).when("place", {
    is: "Tại đại lý",
    then: yup.object().required(),
  }),
  supporter: yup.object().nullable(true),
  place: yup.string().required(),
  address: yup.string().nullable(true),
  date: yup.string().required(),
  startingTime: yup.string().required(),
  endingTime: yup.string().required(),
});

const DeliveryScheduleEditor = ({ navigation, route }) => {
  const notification = useNotification();

  const { deliverySchedule } = route.params;

  let contract = deliverySchedule
    ? deliverySchedule.contract
    : route.params.contract;

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [createDeliverySchedule, { isLoading, isSuccess }] =
    useCreateDeliveryScheduleMutation();

  const [
    updateDeliverySchedule,
    { isLoading: isUpdating, isSuccess: isUpdated },
  ] = useUpdateDeliveryScheduleMutation();

  const loading = isLoading || isUpdating;

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: deliverySchedule
      ? {
          ...deliverySchedule,
          startingTime: deliverySchedule.startingTime
            ? dayjs(deliverySchedule.startingTime, "HH:mm").toDate()
            : null,
          endingTime: deliverySchedule.endingTime
            ? dayjs(deliverySchedule.endingTime, "HH:mm").toDate()
            : null,
        }
      : {},
  });

  const allocation = watch("allocation");
  const compartment = watch("compartment");
  const startingTime = watch("startingTime");
  const endingTime = watch("endingTime");
  const supporter = watch("supporter");
  const place = watch("place");

  const handleSave = useCallback(
    (data) => {
      data.allocationId = data.allocation.id;
      delete data.allocation;

      if (data.compartment) {
        data.compartmentId = data.compartment.id;
        delete data.compartment;
      }

      data.date = toISO(data.date);

      data.startingTime = dayjs(data.startingTime).format("HH:mm");
      data.endingTime = dayjs(data.endingTime).format("HH:mm");

      if (data.supporter) {
        data.supporterId = data.supporter.id;
        delete data.supporter;
      }

      if (deliverySchedule) {
        updateDeliverySchedule(data);
      } else {
        Alert.alert(
          "Yêu cầu phê duyệt",
          "Bạn sẽ gửi yêu cầu phê duyệt đến quản lý",
          [
            {
              text: "Lưu bản nháp",
              onPress: () => createDeliverySchedule(data),
            },
            {
              text: "Gửi",
              onPress: () => {
                data.state = DeliveryStateObject.pending;
                createDeliverySchedule(data);
              },
            },
          ],
          { cancelable: false }
        );
      }
    },
    [createDeliverySchedule, deliverySchedule, updateDeliverySchedule]
  );

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage(
        "Tạo lịch giao xe thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (isUpdated) {
      notification.showMessage(
        "Cập nhật lịch giao xe thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: deliverySchedule
        ? "Cập nhật lịch giao xe"
        : "Tạo lịch giao xe",
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
  }, [
    deliverySchedule,
    handleBack,
    handleSave,
    handleSubmit,
    loading,
    navigation,
  ]);

  const handleChoosePlace = useCallback(() => {
    setActionConfig({
      key: "place",
      items: arr2WheelItems(DeliveryPlaces),
      onChange: (value) => {
        setValue("place", value, { shouldValidate: true });

        if (value !== "Tại đại lý") {
          setValue("compartment", null);
        } else {
          setValue("address", null);
        }
      },
      onCancel: () => {
        setValue("place", null);
        setValue("compartment", null);
        setValue("address", null);
      },
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseAllocationProduct = useCallback(
    () =>
      navigation.navigate("AllocationProductPicker", {
        contract,
        selected: allocation,
        onSelect: (value) =>
          setValue("allocation", value, { shouldValidate: true }),
      }),
    [allocation, contract, navigation, setValue]
  );

  const handleChooseSupporter = useCallback(
    () =>
      navigation.navigate("SupporterPicker", {
        selected: supporter,
        onSelect: (supporter) =>
          setValue("supporter", supporter, { shouldValidate: true }),
      }),
    [navigation, supporter, setValue]
  );

  const handleChooseCompartment = useCallback(
    () =>
      navigation.navigate("CompartmentPicker", {
        selected: compartment,
        onSelect: (compartment) =>
          setValue("compartment", compartment, { shouldValidate: true }),
      }),
    [navigation, compartment, setValue]
  );

  return (
    <BasePage loading={loading}>
      <View
        bg-surface
        padding-16
        marginB-12
        style={[gStyles.shadow, gStyles.borderB]}
      >
        <View row centerV>
          <InputLabel text="Hợp đồng" required />
          <SelectField
            disabled
            flex-2
            label={contract?.code.toUpperCase()}
            placeholder="Chọn"
          />
        </View>
        <TextRow
          left="Khách hàng"
          rightDisabled
          right={getCustomerName(contract.customer)}
          marginT-10
        />
      </View>

      <View bg-surface padding-16 style={[gStyles.shadow, gStyles.borderB]}>
        <TouchableOpacity
          onPress={handleChooseAllocationProduct}
          style={[
            gStyles.borderB,
            Boolean(errors.allocation) && {
              borderBottomColor: Colors.stateRedDefault,
            },
          ]}
        >
          <ProductImage
            uri={allocation?.favoriteProduct.product?.photo?.url}
            name={allocation?.favoriteProduct.product.name}
          />
        </TouchableOpacity>

        <View row centerV marginT-10>
          <InputLabel text="Địa điểm" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={place}
            error={Boolean(errors.place)}
            onPress={handleChoosePlace}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Khoang xe" required={place === "Tại đại lý"} />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={compartment?.name}
            disabled={place !== "Tại đại lý"}
            error={Boolean(errors.compartment)}
            onPress={handleChooseCompartment}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Địa chỉ" />
          <View flex-2>
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập"
                  value={value}
                  disabled={place === "Tại đại lý"}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Ngày giao" required />
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
                  title="Ngày giao"
                  value={toDate(value)}
                  dateFormat="DD/MM/YYYY"
                  minimumDate={new Date()}
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn"
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
          <InputLabel text="Thời gian bắt đầu" required />
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
                  title="Thời gian bắt đầu"
                  value={value}
                  timeFormat="HH:mm"
                  maximumDate={endingTime}
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={
                        <Time
                          width={20}
                          height={20}
                          fill={Colors.textBlackHigh}
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
          <InputLabel text="Thời gian kết thúc" required />
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
                  title="Thời gian kết thúc"
                  value={value}
                  minimumDate={startingTime}
                  timeFormat="HH:mm"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={
                        <Time
                          width={20}
                          height={20}
                          fill={Colors.textBlackHigh}
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
          <InputLabel text="Người hỗ trợ" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={supporter?.name}
            onPress={handleChooseSupporter}
          />
        </View>
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

DeliveryScheduleEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      contract: PropTypes.object,
      deliverySchedule: PropTypes.object,
    }),
  }),
};

export default DeliveryScheduleEditor;
