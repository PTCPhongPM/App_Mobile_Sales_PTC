import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import isEmpty from "lodash/isEmpty";
import compact from "lodash/compact";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native-ui-lib";
import { Alert } from "react-native";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";
import { Calendar, DefaultCar, Time } from "../../../configs/assets";

import { TestDrivePlaces } from "../../../helper/constants";

import {
  arr2WheelItems,
  formatTime,
  getCustomerName,
  getFile,
  getTestDriveUploadFiles,
  toDate,
  toISO,
} from "../../../helper/utils";

import {
  useCreateTestDriveMutation,
  useUpdateTestDriveFileMutation,
  useUpdateTestDriveMutation,
} from "../../../store/api/testDrive";
import { useNotification } from "../../../providers/NotificationProvider";

const schema = yup.object().shape({
  testProduct: yup.object().required(),
  drivingDate: yup.string().required(),
  startingTime: yup.string().required(),
  endingTime: yup.string().required(),
  supporter: yup.object().nullable(true),
  place: yup.string().required(),
  road: yup.string().required(),
  // approver: yup.object().nullable(true),
  note: yup.string().nullable(true),
  files: yup.object().required(),
});

const TestDriveEditor = ({ navigation, route: { params } }) => {
  const notification = useNotification();

  const { testDrive, customer } = params;

  const isEdit = Boolean(testDrive?.id);

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const savedFiles = useMemo(
    () => ({
      identityCardFront: getFile(testDrive?.files, "identityCardFront"),
      identityCardBack: getFile(testDrive?.files, "identityCardBack"),
      driveLicenseFront: getFile(testDrive?.files, "driveLicenseFront"),
      driveLicenseBack: getFile(testDrive?.files, "driveLicenseBack"),
      disclaimers: (
        testDrive?.files?.filter((e) => e.type === "disclaimers") || []
      ).map((e) => ({ ...e.file, fileType: "disclaimers" })),
      other: (testDrive?.files?.filter((e) => e.type === "other") || []).map(
        (e) => ({ ...e.file, fileType: "other" })
      ),
    }),
    [testDrive?.files]
  );
  const [testDriveId, setTestDriveId] = useState(0);

  const defaultValues = useMemo(() => {
    if (!isEdit) return {};
    return {
      ...testDrive,
      startingTime: dayjs(testDrive.startingTime, "HH:mm").toDate(),
      endingTime: dayjs(testDrive.endingTime, "HH:mm").toDate(),
      files: savedFiles,
    };
  }, [isEdit, savedFiles, testDrive]);

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

  const [createTestDrive, { isLoading, isSuccess }] =
    useCreateTestDriveMutation();
  const [
    updateTestDrive,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateTestDriveMutation();

  const [
    updateTestDriveFile,
    {
      isLoading: isFileUpdating,
      isSuccess: isFileUpdateSuccess,
      isError: isFileUpdateError,
    },
  ] = useUpdateTestDriveFileMutation();

  const loading = isLoading || isUpdating || isFileUpdating;

  useEffect(() => {
    if (isUpdateSuccess || (isSuccess && isFileUpdateSuccess)) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFileUpdateSuccess, isSuccess, isUpdateSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const testProduct = watch("testProduct");
  // const approver = watch("approver");
  const supporter = watch("supporter");
  const files = watch("files");
  const startingTime = watch("startingTime");
  const endingTime = watch("endingTime");

  const countImages = useMemo(() => {
    if (isEmpty(files)) return 0;

    const tmp = compact(Object.values(files).flat());

    return tmp?.length || 0;
  }, [files]);

  const handleSave = useCallback(
    async (data) => {
      const _data = {
        drivingDate: toISO(data.drivingDate),
        place: data.place,
        road: data.road,
        testProductId: data.testProduct.id,
        note: data.note,
        startingTime: formatTime(data.startingTime),
        endingTime: formatTime(data.endingTime),
      };
      if (data.supporter) {
        _data.supporterId = data.supporter.id;
      }
      if (data.approver) {
        _data.approverId = data.approver.id;
      }

      if (isFileUpdateError) {
        await updateTestDriveFile({
          id: testDriveId,
          files: getTestDriveUploadFiles(savedFiles),
        }).unwrap();

        return;
      }

      if (isEdit) {
        _data.id = testDrive.id;
        await updateTestDrive(_data).unwrap();
      } else {
        _data.saleId = customer.sales[0].id;
        Alert.alert(
          "Yêu cầu phê duyệt",
          "Bạn sẽ gửi yêu cầu phê duyệt đến quản lý",
          [
            {
              text: "Lưu bản nháp",
              onPress: async () => {
                _data.state = "draft";

                const res = await createTestDrive(_data).unwrap();

                setTestDriveId(res.id);
                await updateTestDriveFile({
                  id: res.id,
                  files: getTestDriveUploadFiles(files),
                }).unwrap();
              },
            },
            {
              text: "Gửi",
              onPress: async () => {
                _data.state = "created";
                const res = await createTestDrive(_data).unwrap();

                setTestDriveId(res.id);
                await updateTestDriveFile({
                  id: res.id,
                  files: getTestDriveUploadFiles(files),
                }).unwrap();
              },
            },
          ],
          { cancelable: false }
        );
      }
    },
    [
      createTestDrive,
      customer.sales,
      files,
      isEdit,
      isFileUpdateError,
      savedFiles,
      testDrive?.id,
      testDriveId,
      updateTestDrive,
      updateTestDriveFile,
    ]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEdit ? "Cập nhật lịch lái thử" : "Tạo lịch lái thử",
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
  }, [handleBack, handleSave, handleSubmit, isEdit, loading, navigation]);

  const handlePlaceClicked = useCallback(() => {
    setActionConfig({
      key: "place",
      items: arr2WheelItems(TestDrivePlaces),
      onChange: (value) => setValue("place", value, { shouldValidate: true }),
      onCancel: () => setValue("place", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleProductPress = useCallback(
    () =>
      navigation.navigate("TestDrivePicker", {
        selected: testProduct,
        onSelect: (value) =>
          setValue("testProduct", value, { shouldValidate: true }),
      }),
    [navigation, setValue, testProduct]
  );

  const handleAddPhoto = useCallback(
    () =>
      navigation.navigate("PhotoEditor", {
        customer,
        testDrive,
        files,
        onChange: (value) => setValue("files", value, { shouldValidate: true }),
      }),
    [customer, files, navigation, setValue, testDrive]
  );

  // const handleApproverPicked = useCallback(
  //   () =>
  //     navigation.navigate("ApproverPicker", {
  //       selected: approver,
  //       onSelect: (approver) =>
  //         setValue("approver", approver, { shouldValidate: true }),
  //     }),
  //   [navigation, approver, setValue]
  // );

  const handleSupporterPicked = useCallback(
    () =>
      navigation.navigate("SupporterPicker", {
        selected: supporter,
        onSelect: (supporter) =>
          setValue("supporter", supporter, { shouldValidate: true }),
      }),
    [navigation, supporter, setValue]
  );

  return (
    <BasePage loading={loading}>
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <TouchableOpacity row center paddingV-8 onPress={handleProductPress}>
          {testProduct && testProduct.model.photo.url ? (
            <Image
              source={{ uri: testProduct.model.photo.url }}
              width={70}
              height={32}
              resizeMode="contain"
            />
          ) : (
            <DefaultCar width={70} height={32} />
          )}

          <Text subtitle1 textBlackMedium textBlackHigh={testProduct} marginL-8>
            {testProduct ? testProduct?.model.description : "Chọn xe"}
          </Text>
        </TouchableOpacity>
        {errors.testProduct && <View height={0.5} bg-stateRedDefault />}

        <TextRow
          capitalize
          left="Khách hàng"
          leftRequired
          rightDisabled
          right={getCustomerName(customer)}
        />

        <View row centerV marginT-10>
          <InputLabel text="Hình ảnh giấy tờ" required />
          <SelectField
            flex-2
            placeholder="Thêm hình ảnh"
            label={countImages ? `${countImages} hình ảnh` : ""}
            error={Boolean(errors.files)}
            onPress={handleAddPhoto}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Ngày hẹn" required />
          <View flex-2>
            <Controller
              name="drivingDate"
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
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn ngày"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={
                        <Calendar
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
          <InputLabel text="Bắt đầu" required />
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
                  title="Bắt đầu"
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
          <InputLabel text="Địa điểm" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.place)}
            label={getValues("place")}
            onPress={handlePlaceClicked}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Cung đường" required />
          <View flex-2>
            <Controller
              name="road"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập cung đường"
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
          <InputLabel text="Người hỗ trợ" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={supporter?.name}
            onPress={handleSupporterPicked}
          />
        </View>

        {/* <View row centerV marginT-10>
          <InputLabel text="Quản lý phê duyệt" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={approver?.name}
            onPress={handleApproverPicked}
          />
        </View> */}

        <View row centerV marginT-10>
          <InputLabel text="Ghi chú" />
          <View flex-2>
            <Controller
              name="note"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập ghi chú"
                  multiline
                  value={value}
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
        onDismiss={handleDismiss}
      />
    </BasePage>
  );
};

TestDriveEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      testDrive: PropTypes.object,
    }),
  }),
};

export default TestDriveEditor;
