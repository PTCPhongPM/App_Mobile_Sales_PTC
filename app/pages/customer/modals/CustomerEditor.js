import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import PropTypes from "prop-types";

import {
  Button,
  Colors,
  DateTimePicker,
  ExpandableSection,
  Switch,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import dayjs from "dayjs";
import capitalize from "lodash/capitalize";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useNotification } from "../../../providers/NotificationProvider";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import { Calendar } from "../../../configs/assets";
import {
  Civilities,
  CompanyTypes,
  CustomerRoles,
  CustomerStates,
  CustomerTypes,
  ExpectedSigningDate,
  Genders,
  MaritalStatus,
  PaymentMethods,
} from "../../../helper/constants";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../store/api/customer";
import { arr2WheelItems, toDate, toISO } from "../../../helper/utils";
import gStyles from "../../../configs/gStyles";

const schema = yup.object().shape({
  type: yup.string().required(),
  civility: yup.string().nullable(true),
  firstContactDate: yup.string().nullable(true),
  lastName: yup.string().nullable(true),
  firstName: yup.string().required(),
  note: yup.string().nullable(true),
  source: yup.string().required(),
  phoneNumber: yup
    .string()
    .required()
    .matches(/^[0-9]+$/)
    .min(10)
    .max(10),
  phoneNumberOpt: yup
    .string()
    .nullable(true)
    .transform((o, c) => (o === "" ? null : c))
    .matches(/^[0-9]+$/)
    .min(10)
    .max(10),
  province: yup.object().required(),
  district: yup.object().required(),
  address: yup.string().required(),
  state: yup.string().required(),
  expectedSigningDate: yup.string().nullable(true),
  paymentMethod: yup.string().required(),
  role: yup.string().nullable(true),

  hasBroker: yup.boolean(),
  brokerInfo: yup.object().when("hasBroker", {
    is: true,
    then: yup.object({
      name: yup.string().required(),
      citizenIdentity: yup
        .string()
        .required()
        .matches(/^(?=(?:.{9}|.{12})$)[0-9]+$/),
      issuedDate: yup.string().required(),
      issuedPlace: yup.string().required(),
      relationship: yup.string().required(),
      phoneNumber: yup
        .string()
        .required()
        .matches(/^[0-9]+$/)
        .min(10)
        .max(10),
      address: yup.string().required(),
      bank: yup.object().required(),
      bankAccount: yup.string().required(),
    }),
  }),
  customerInfo: yup
    .object({
      birthday: yup.string().nullable(true),
      citizenIdentity: yup
        .string()
        .matches(/^(?=(?:.{9}|.{12})$)[0-9]+$/)
        .nullable(true)
        .transform((o, c) => (o === "" ? null : c)),
      issuedDate: yup.string().nullable(true),
      issuedPlace: yup.string().nullable(true),
      gender: yup.string().nullable(true),
      maritalStatus: yup.string().nullable(true),
      profession: yup.string().nullable(true),
      interests: yup.string().nullable(true),
      approachSource: yup.string().nullable(true),
      email: yup.string().email().nullable(true),
    })
    .when("type", {
      is: CustomerTypes.corporate,
      then: yup.object({
        companyName: yup.string().required(),
        companyType: yup.string().nullable(true),
        ownerName: yup.string().nullable(true),
        ownerTitle: yup.string().nullable(true),
        taxCode: yup.string().nullable(true),
      }),
    }),
});

const defaultValues = {
  type: "personal",
  civility: "mr",
  hasBroker: false,
  customerInfo: { gender: "male" },
};

const CustomerEditor = ({ navigation, route: { params } }) => {
  const { customer } = params;

  const notification = useNotification();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [createCustomer, createResult] = useCreateCustomerMutation();

  const [updateCustomer, updateResult] = useUpdateCustomerMutation();

  const isLoading = useMemo(
    () => createResult.isLoading || updateResult.isLoading,
    [createResult.isLoading, updateResult.isLoading]
  );

  const isSuccess = useMemo(
    () => createResult.isSuccess || updateResult.isSuccess,
    [createResult.isSuccess, updateResult.isSuccess]
  );

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...defaultValues,
      ...customer,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation, reset]);

  const onSubmit = useCallback(
    (data) => {
      data.provinceId = data.province?.id;
      data.districtId = data.district?.id;

      if (data.firstContactDate) {
        data.firstContactDate = toISO(data.firstContactDate);
      }
      if (!data.hasBroker) {
        delete data.brokerInfo;
      } else {
        data.brokerInfo.issuedDate = toISO(data.brokerInfo.issuedDate);
        data.brokerInfo.bankId = data.brokerInfo.bank?.id;
      }

      if (data.customerInfo.birthday) {
        data.customerInfo.birthday = toISO(data.customerInfo.birthday);
      }
      if (data.customerInfo.issuedDate) {
        data.customerInfo.issuedDate = toISO(data.customerInfo.issuedDate);
      }

      if (customer) {
        updateCustomer(data);
      } else {
        createCustomer(data);
      }
    },
    [createCustomer, customer, updateCustomer]
  );

  const type = watch("type");
  const province = watch("province");
  const district = watch("district");
  const source = watch("source");
  const hasBroker = watch("hasBroker");
  const brokerBank = watch("brokerInfo.bank");

  const isPersonal = useMemo(() => type === "personal", [type]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: customer ? "Cập nhật khách hàng" : "Tạo khách hàng",
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
          onPress={handleSubmit(onSubmit)}
        >
          <Text headerAction>{customer ? "Lưu" : "Tạo"}</Text>
        </Button>
      ),
    });
  }, [customer, handleBack, handleSubmit, isLoading, navigation, onSubmit]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  const handleChooseCustomerType = useCallback(() => {
    setValue(
      "type",
      isPersonal ? CustomerTypes.corporate : CustomerTypes.personal
    );
  }, [isPersonal, setValue]);

  const handleChooseCivility = useCallback(() => {
    setActionConfig({
      key: "civility",
      items: Object.entries(Civilities).map(([key, value]) => ({
        label: value,
        value: key,
      })),
      onChange: (value) =>
        setValue("civility", value, { shouldValidate: true }),
      onCancel: () => setValue("civility", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseState = useCallback(() => {
    setActionConfig({
      key: "state",
      items: Object.entries(CustomerStates).map(([key, value]) => ({
        label: value,
        value: key,
      })),
      onChange: (value) => setValue("state", value, { shouldValidate: true }),
      onCancel: () => setValue("state", null),
    });
    setActionShown(true);
  }, [setValue]);

  const handleChooseExpectedSigningDate = useCallback(() => {
    setActionConfig({
      key: "expectedSigningDate",
      items: arr2WheelItems(ExpectedSigningDate),
      onChange: (value) =>
        setValue("expectedSigningDate", value, { shouldValidate: true }),
      onCancel: () => setValue("expectedSigningDate", null),
    });
    setActionShown(true);
  }, [setValue]);

  const handleChoosePaymentMethod = useCallback(() => {
    setActionConfig({
      key: "paymentMethod",
      items: arr2WheelItems(PaymentMethods),
      onChange: (value) =>
        setValue("paymentMethod", value, { shouldValidate: true }),
      onCancel: () => setValue("paymentMethod", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseCustomerRole = useCallback(() => {
    setActionConfig({
      key: "role",
      items: arr2WheelItems(CustomerRoles),
      onChange: (value) => setValue("role", value, { shouldValidate: true }),
      onCancel: () => setValue("role", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseGender = useCallback(() => {
    setActionConfig({
      key: "customerInfo.gender",
      items: Object.entries(Genders).map(([key, label]) => ({
        label: label,
        value: key,
      })),
      onChange: (value) =>
        setValue("customerInfo.gender", value, { shouldValidate: true }),
      onCancel: () => setValue("customerInfo.gender", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleMaritalStatusPicked = useCallback(() => {
    setActionConfig({
      key: "customerInfo.maritalStatus",
      items: Object.entries(MaritalStatus).map(([key, label]) => ({
        label: label,
        value: key,
      })),
      onChange: (value) => setValue("customerInfo.maritalStatus", value),
      onCancel: () => setValue("customerInfo.maritalStatus", null),
    });
    setActionShown(true);
  }, [setValue]);

  const handleChooseCompanyType = useCallback(() => {
    setActionConfig({
      key: "customerInfo.companyType",
      items: arr2WheelItems(CompanyTypes),
      onChange: (value) =>
        setValue("customerInfo.companyType", value, { shouldValidate: true }),
      onCancel: () => setValue("customerInfo.companyType", null),
    });

    setActionShown(true);
  }, [setValue]);

  const toggleBrokerSection = useCallback(
    () => setValue("hasBroker", !hasBroker),
    [hasBroker, setValue]
  );

  const handleProvincePicked = useCallback(
    () =>
      navigation.navigate("ProvincePicker", {
        selected: province,
        onSelect: (province) =>
          setValue("province", province, { shouldValidate: true }),
      }),
    [navigation, province, setValue]
  );

  const handleChooseBrokerInfoIssuedPlace = useCallback(
    () =>
      navigation.navigate("ProvincePicker", {
        selected: getValues("brokerInfo.issuedPlace"),
        onSelect: (province) =>
          setValue("brokerInfo.issuedPlace", province.name, {
            shouldValidate: true,
          }),
      }),
    [getValues, navigation, setValue]
  );

  const handleChooseCustomerInfoIssuedPlace = useCallback(
    () =>
      navigation.navigate("ProvincePicker", {
        selected: getValues("customerInfo.issuedPlace"),
        onSelect: (province) =>
          setValue("customerInfo.issuedPlace", province.name, {
            shouldValidate: true,
          }),
      }),
    [getValues, navigation, setValue]
  );

  const handleDistrictPicked = useCallback(
    () =>
      navigation.navigate("DistrictPicker", {
        selected: { province, district },
        onSelect: (district) =>
          setValue("district", district, { shouldValidate: true }),
      }),
    [district, navigation, province, setValue]
  );

  const handleSourcePicked = useCallback(
    () =>
      navigation.navigate("ApproachSourcePicker", {
        selected: source,
        onSelect: (value) => {
          setValue("source", value, { shouldValidate: true });
        },
      }),
    [navigation, source, setValue]
  );

  const handleApproachSourcePicked = useCallback(
    () =>
      navigation.navigate("ApproachSourcePicker", {
        selected: getValues("customerInfo.approachSource"),
        onSelect: (value) => {
          setValue("customerInfo.approachSource", value, {
            shouldValidate: true,
          });
        },
      }),
    [navigation, getValues, setValue]
  );

  const handleBrokerBankPicked = useCallback(
    () =>
      navigation.navigate("BankPicker", {
        selected: brokerBank,
        onSelect: (value) => {
          setValue("brokerInfo.bank", value, { shouldValidate: true });
        },
      }),
    [brokerBank, navigation, setValue]
  );

  const renderBrokerSection = useCallback(
    () => (
      <View padding-16 paddingB-16 bg-surface>
        <View row centerV>
          <InputLabel text="Họ và tên" required />
          <View flex-2>
            <Controller
              name="brokerInfo.name"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập họ và tên"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="CMT/CCCD" required />
          <View flex-2>
            <Controller
              name="brokerInfo.citizenIdentity"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập CMT/CCCD"
                  maxLength={12}
                  keyboardType="number-pad"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Nơi cấp" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.brokerInfo?.issuedPlace)}
            label={getValues("brokerInfo.issuedPlace")}
            onPress={handleChooseBrokerInfoIssuedPlace}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Ngày cấp" required />
          <View flex-2>
            <Controller
              name="brokerInfo.issuedDate"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  value={toDate(value)}
                  maximumDate={new Date()}
                  onChange={onChange}
                  dateFormat="DD/MM/YYYY"
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Nhập ngày cấp"
                      onChangeText={onChange}
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
        <View row marginT-10 centerV>
          <InputLabel text="Quan hệ với KH" required />
          <View flex-2>
            <Controller
              name="brokerInfo.relationship"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập quan hệ với KH"
                  error={error}
                  isError={Boolean(error)}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Số điện thoại" required />
          <View flex-2>
            <Controller
              name="brokerInfo.phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số điện thoại"
                  keyboardType="number-pad"
                  error={error}
                  isError={Boolean(error)}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Địa chỉ" required />
          <View flex-2>
            <Controller
              name="brokerInfo.address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập địa chỉ"
                  error={error}
                  isError={Boolean(error)}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Ngân hàng" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.brokerInfo?.bank)}
            label={getValues("brokerInfo.bank")?.name}
            onPress={handleBrokerBankPicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Số tài khoản" required />
          <View flex-2>
            <Controller
              name="brokerInfo.bankAccount"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số tài khoản"
                  keyboardType="number-pad"
                  error={Boolean(error)}
                  isError={Boolean(error)}
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>
    ),
    [
      control,
      errors.brokerInfo?.bank,
      errors.brokerInfo?.issuedPlace,
      getValues,
      handleBrokerBankPicked,
      handleChooseBrokerInfoIssuedPlace,
    ]
  );

  const renderAdditionalInfoSection = useCallback(() => {
    if (isPersonal) {
      return (
        <View padding-16 bg-surface style={[gStyles.borderB, gStyles.shadow]}>
          <View row centerV>
            <InputLabel text="Ngày sinh" />
            <View flex-2>
              <Controller
                name="customerInfo.birthday"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    mode="date"
                    value={toDate(value)}
                    onChange={onChange}
                    dateFormat="DD/MM/YYYY"
                    maximumDate={new Date()}
                    renderInput={({ value }) => (
                      <TextInput
                        placeholder="Nhập ngày sinh"
                        onChangeText={onChange}
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
          <View row marginT-10 centerV>
            <InputLabel text="CMT/CCCD" />
            <View flex-2>
              <Controller
                name="customerInfo.citizenIdentity"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập CMT/CCCD"
                    maxLength={12}
                    keyboardType="number-pad"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Nơi cấp" />
            <SelectField
              flex-2
              placeholder="Chọn"
              error={Boolean(errors.customerInfo?.issuedPlace)}
              label={getValues("customerInfo.issuedPlace")}
              onPress={handleChooseCustomerInfoIssuedPlace}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Ngày cấp" />
            <View flex-2>
              <Controller
                name="customerInfo.issuedDate"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <DateTimePicker
                    mode="date"
                    value={toDate(value)}
                    maximumDate={new Date()}
                    dateFormat="DD/MM/YYYY"
                    onChange={onChange}
                    renderInput={({ value }) => (
                      <TextInput
                        placeholder="Nhập ngày cấp"
                        onChangeText={onChange}
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
          <View row marginT-10 centerV>
            <InputLabel text="Giới tính" />
            <SelectField
              flex-2
              label={Genders[getValues("customerInfo.gender")]}
              onPress={handleChooseGender}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Hôn nhân" />
            <SelectField
              flex-2
              placeholder="Chọn"
              label={MaritalStatus[getValues("customerInfo.maritalStatus")]}
              error={Boolean(errors.customerInfo?.maritalStatus)}
              onPress={handleMaritalStatusPicked}
            />
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Nghề nghiệp" />
            <View flex-2>
              <Controller
                name="customerInfo.profession"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nhập nghề nghiệp"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Sở thích" />
            <View flex-2>
              <Controller
                name="customerInfo.interests"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Nhập sở thích"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row marginT-10 centerV>
            <InputLabel text="Nguồn thông tin tiếp cận" />
            <SelectField
              flex-2
              placeholder="Chọn"
              label={getValues("customerInfo.approachSource")}
              error={Boolean(errors.customerInfo?.approachSource)}
              onPress={handleApproachSourcePicked}
            />
          </View>
          <View row centerV marginT-8>
            <InputLabel text="Email" />
            <View flex-2>
              <Controller
                name="customerInfo.email"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    keyboardType="email-address"
                    placeholder="Nhập email"
                    error={error}
                    isError={Boolean(error)}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View padding-16 bg-surface style={[gStyles.borderB, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Chủ sở hữu" />
          <View flex-2>
            <Controller
              name="customerInfo.ownerName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập tên chủ sở hữu"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Chức vụ" />
          <View flex-2>
            <Controller
              name="customerInfo.ownerTitle"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập chức vụ"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Mã số thuế" />
          <View flex-2>
            <Controller
              name="customerInfo.taxCode"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập mã số thuế"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>
    );
  }, [
    control,
    errors.customerInfo?.approachSource,
    errors.customerInfo?.issuedPlace,
    errors.customerInfo?.maritalStatus,
    getValues,
    handleApproachSourcePicked,
    handleChooseCustomerInfoIssuedPlace,
    handleChooseGender,
    handleMaritalStatusPicked,
    isPersonal,
  ]);

  const renderCompanySection = useCallback(
    () => (
      <>
        <View row marginT-10 centerV>
          <InputLabel text="Tên công ty" required />
          <View flex-2>
            <Controller
              name="customerInfo.companyName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập tên công ty"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Loại hình kinh doanh" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("customerInfo.companyType")}
            onPress={handleChooseCompanyType}
          />
        </View>
      </>
    ),
    [control, getValues, handleChooseCompanyType]
  );

  return (
    <BasePage loading={isLoading}>
      <Headline label="Thông tin khách hàng" />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View centerV>
          <View absR style={styles.top4}>
            <Switch value={!isPersonal} height={32} width={52} thumbSize={28} />
          </View>
          <ExpandableSection
            top={false}
            expanded={!isPersonal}
            sectionHeader={
              <View centerV paddingV-10>
                <Text>Khách hàng là doanh nghiệp</Text>
              </View>
            }
            onPress={handleChooseCustomerType}
          >
            {renderCompanySection()}
          </ExpandableSection>
        </View>
        <TextRow
          capitalize
          left="Ngày khởi tạo"
          rightDisabled
          right={dayjs().format("DD/MM/YYYY")}
          marginT-10
        />
        <View row marginT-10 centerV>
          <InputLabel text="Ngày liên hệ" />
          <View flex-2>
            <Controller
              name="firstContactDate"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  value={toDate(value)}
                  maximumDate={new Date()}
                  dateFormat="DD/MM/YYYY"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Ngày liên hệ"
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
        <View row marginT-10 centerV>
          <InputLabel text="Danh xưng" />
          <SelectField
            flex-2
            label={Civilities[getValues("civility")]}
            onPress={handleChooseCivility}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Họ và tên đệm" />
          <View flex-2>
            <Controller
              name="lastName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  autoCapitalize="words"
                  placeholder="Nhập họ và tên đệm"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tên khách hàng" required />
          <View flex-2>
            <Controller
              name="firstName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  autoCapitalize="words"
                  placeholder="Nhập tên"
                  onChangeText={onChange}
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Ghi chú" />
          <View flex-2>
            <Controller
              name="note"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập ghi chú"
                  multiline
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Điện thoại 1" required />
          <View flex-2>
            <Controller
              name="phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số điện thoại"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Điện thoại 2" />
          <View flex-2>
            <Controller
              name="phoneNumberOpt"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số điện thoại"
                  keyboardType="number-pad"
                  maxLength={10}
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tỉnh/Thành phố" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.province)}
            label={province?.name}
            onPress={handleProvincePicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Quận/Huyện" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={district?.name}
            disabled={!province || !province?.id}
            error={Boolean(errors.district)}
            onPress={handleDistrictPicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Địa chỉ chi tiết" required />
          <View flex-2>
            <Controller
              name="address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập địa chỉ"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Nguồn KH" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("source")}
            error={Boolean(errors.source)}
            onPress={handleSourcePicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tình trạng" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={capitalize(getValues("state"))}
            error={Boolean(errors.state)}
            onPress={handleChooseState}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Dự kiến ký HD" />
          <SelectField
            flex-2
            placeholder="Chưa xác đinh"
            label={getValues("expectedSigningDate")}
            onPress={handleChooseExpectedSigningDate}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Hình thức thanh toán" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("paymentMethod")}
            error={Boolean(errors.paymentMethod)}
            onPress={handleChoosePaymentMethod}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Vai trò" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("role")}
            onPress={handleChooseCustomerRole}
          />
        </View>
      </View>

      <View marginT-16 bg-primary50 style={[gStyles.borderV, gStyles.shadow]}>
        <View style={styles.switch}>
          <Switch value={hasBroker} height={32} width={52} thumbSize={28} />
        </View>
        <ExpandableSection
          top={false}
          expanded={hasBroker}
          sectionHeader={
            <View flex row spread paddingH-16 paddingV-12>
              <Text subtitle1>Môi giới</Text>
            </View>
          }
          onPress={toggleBrokerSection}
        >
          {renderBrokerSection()}
        </ExpandableSection>
      </View>

      <Headline label="Thông tin bổ sung" />

      {renderAdditionalInfoSection()}

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

CustomerEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
    }),
  }),
};

export default CustomerEditor;

const styles = StyleSheet.create({
  switch: {
    position: "absolute",
    right: 16,
    top: 8,
  },
  top4: {
    top: 4,
  },
});
