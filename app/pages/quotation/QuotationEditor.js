import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import currencyFormat from "currency-formatter";

import {
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  Colors,
  DateTimePicker,
  ExpandableSection,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BottomWheelPicker from "../../components/Picker/BottomWheelPicker";
import Headline from "../../components/Header/Headline";
import InputLabel from "../../components/Input/InputLabel";
import ProductImage from "../../components/ProductImage";
import SelectField from "../../components/Input/SelectField";
import TextInput from "../../components/Input/TextInput";
import TextRow from "../../components/TextRow";

import gStyles from "../../configs/gStyles";
import { useNotification } from "../../providers/NotificationProvider";
import { Calendar } from "../../configs/assets";

import {
  arr2WheelItems,
  currencyFormatter,
  getNewIds,
  obj2WheelItems,
  toDate,
  toISO,
} from "../../helper/utils";
import {
  DiscountTypeObject,
  DiscountTypes,
  IntendedUses,
  YesNos,
  YesNosEn,
} from "../../helper/constants";

import {
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
} from "../../store/api/quotation";
import InsuranceCard from "../../components/Card/InsuranceCard";

const styles = StyleSheet.create({
  switch: {
    position: "absolute",
    right: 16,
    top: 6,
  },
});

const schema = yup.object().shape({
  policy: yup.object().nullable(true),
  intendedUse: yup.string().nullable(true),
  discount: yup.number().integer().nullable(true),
  deliveryDate: yup.string().required(),

  registrationTax: yup.number().integer().nullable(true),
  registrationTaxDiscountType: yup
    .string()
    .nullable(true)
    .oneOf([...Object.keys(DiscountTypes), null]),
  registrationTaxDiscount: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true)
    .when("registrationTaxDiscountType", {
      is: DiscountTypeObject.percentage,
      then: yup.number().max(100).nullable(true),
    }),

  licensePlateFee: yup
    .number()
    .integer()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true),
  registrationFee: yup
    .number()
    .integer()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true),
  internalCirculationFee: yup
    .number()
    .integer()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true),
  serviceFee: yup
    .number()
    .integer()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(),

  hasPresent: yup.boolean().required(),
  otherPresents: yup.string().nullable(true),

  hasFinancialSolution: yup.boolean(),
  bank: yup.object().nullable(true).when("hasFinancialSolution", {
    is: true,
    then: yup.object().required(),
  }),
  prepayPercent: yup
    .number()
    .nullable(true)
    .when("hasFinancialSolution", {
      is: true,
      then: yup.number().max(100).required(),
    }),
  months: yup.number().integer().nullable(true).when("hasFinancialSolution", {
    is: true,
    then: yup.number().integer().required(),
  }),
  preferentialInterestRate: yup
    .number()
    .nullable(true)
    .when("hasFinancialSolution", {
      is: true,
      then: yup.number().nullable(true).max(100).required(),
    }),
  preferentialMonths: yup
    .number()
    .integer()
    .nullable(true)
    .when("hasFinancialSolution", {
      is: true,
      then: yup.number().integer().required(),
    }),
  interestRate: yup
    .number()
    .nullable(true)
    .when("hasFinancialSolution", {
      is: true,
      then: yup.number().max(100).required(),
    }),
  insurances: yup.array().nullable(true),
});

const QuotationEditor = ({ navigation, route: { params } }) => {
  const { customer, quotation } = params;
  const notification = useNotification();
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [selectedProduct, setSelectedProduct] = useState(
    quotation?.favoriteProduct || {}
  );

  const isEditMode = useMemo(() => Boolean(quotation), [quotation]);

  const handleChooseFavoriteProduct = useCallback(
    () =>
      navigation.navigate("FavoriteProductPicker", {
        customer,
        selected: selectedProduct,
        onSelect: (product) => {
          setSelectedProduct(product);
        },
      }),
    [customer, navigation, selectedProduct]
  );

  const [createQuotation, { isLoading, isSuccess }] =
    useCreateQuotationMutation();

  const [
    updateQuotation,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateQuotationMutation();

  const loading = isLoading || isUpdating;

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: quotation,
  });

  const policy = watch("policy");
  const registrationTaxDiscountType = watch("registrationTaxDiscountType");
  const hasFinancialSolution = watch("hasFinancialSolution");
  const bank = watch("bank");
  const insurances = watch("insurances");

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Tạo thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const handleSave = useCallback(
    (data) => {
      const _data = {
        ...data,
        saleId: customer.sales[0].id,
        favoriteProductId: selectedProduct.id,
        deliveryDate: toISO(data.deliveryDate),
        provinceId: customer.province?.id,
      };

      if (data.policy) _data.policyId = data.policy.id;
      if (data.bank) _data.bankId = data.bank.id;
      if (insurances) _data.insuranceIds = getNewIds(insurances);

      if (isEditMode) {
        _data.id = quotation?.id;

        updateQuotation(_data);
      } else {
        createQuotation(_data);
      }
    },
    [
      createQuotation,
      customer.province?.id,
      customer.sales,
      insurances,
      isEditMode,
      quotation?.id,
      selectedProduct.id,
      updateQuotation,
    ]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: isEditMode ? "Cập nhật báo giá" : "Tạo báo giá",
      headerLeft: () => (
        <Button link paddingH-16 disabled={loading} onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => {
        if (!selectedProduct.id) return null;

        return (
          <Button
            link
            paddingH-16
            disabled={loading}
            onPress={handleSubmit(handleSave)}
          >
            <Text headerAction>Lưu</Text>
          </Button>
        );
      },
    });
  }, [
    handleBack,
    handleSave,
    handleSubmit,
    isEditMode,
    loading,
    navigation,
    selectedProduct.id,
  ]);

  const handlePolicyPicked = useCallback(
    () =>
      navigation.navigate("PolicyPicker", {
        selected: policy,
        onSelect: (value) => {
          setValue("policy", value, { shouldValidate: true });
        },
      }),
    [policy, navigation, setValue]
  );

  const handleIntendedUsePressed = useCallback(() => {
    setActionConfig({
      key: "intendedUse",
      items: arr2WheelItems(IntendedUses),
      onChange: (value) =>
        setValue("intendedUse", value, { shouldValidate: true }),
      onCancel: () => setValue("intendedUse", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleDiscountTypePressed = useCallback(() => {
    setActionConfig({
      key: "registrationTaxDiscountType",
      items: obj2WheelItems(DiscountTypes),
      onChange: (value) =>
        setValue("registrationTaxDiscountType", value, {
          shouldValidate: true,
        }),
      onCancel: () => setValue("registrationTaxDiscountType", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handlePresentPicked = useCallback(() => {
    setActionConfig({
      key: "hasPresent",
      items: obj2WheelItems(YesNos),
      onChange: (value) => {
        setValue("hasPresent", value === YesNosEn.true, {
          shouldValidate: true,
        });
      },
      onCancel: () => setValue("hasPresent", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleFinancialSolution = useCallback(
    () => setValue("hasFinancialSolution", !hasFinancialSolution),
    [hasFinancialSolution, setValue]
  );

  const handleChooseBank = useCallback(
    () =>
      navigation.navigate("BankPicker", {
        selected: bank,
        onSelect: (value) => setValue("bank", value, { shouldValidate: true }),
      }),
    [bank, navigation, setValue]
  );

  const handleCreateInsurance = useCallback(
    () =>
      navigation.navigate("InsuranceEditor", {
        onChange: (value) =>
          setValue(
            "insurances",
            Array.isArray(insurances) ? [...insurances, value] : [value]
          ),
        customer,
      }),
    [customer, insurances, navigation, setValue]
  );

  const renderFinancialSolutionSection = useCallback(
    () => (
      <View
        bg-surface
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <View row marginT-10 centerV>
          <InputLabel text="Ngân hàng" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors?.bank)}
            label={bank?.name}
            onPress={handleChooseBank}
          />
        </View>

        <View row marginT-10 centerV>
          <InputLabel text="% trả trước" required />
          <View flex-2>
            <Controller
              name="prepayPercent"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  keyboardType="numeric"
                  maxLength={3}
                  error={Boolean(error)}
                  isError={Boolean(error)}
                  value={value}
                  formatter={(value) => value && `${value}%`}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        <View row marginT-10 centerV>
          <InputLabel text="Thời hạn vay" required />
          <View flex-2>
            <Controller
              name="months"
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
                  formatter={(value) => value && `${value} tháng`}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        <View row marginT-10 centerV>
          <InputLabel text="Lãi suất ưu đãi" required />
          <View flex-2>
            <Controller
              name="preferentialInterestRate"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  keyboardType="numeric"
                  maxLength={3}
                  error={Boolean(error)}
                  isError={Boolean(error)}
                  value={value}
                  formatter={(value) => value && `${value}%`}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        <View row marginT-10 centerV>
          <InputLabel text="Thời hạn ưu đãi" required />
          <View flex-2>
            <Controller
              name="preferentialMonths"
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
                  formatter={(value) => value && `${value} tháng`}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        <View row marginT-10 centerV>
          <InputLabel text="Lãi suất sau ưu đãi" required />
          <View flex-2>
            <Controller
              name="interestRate"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  keyboardType="numeric"
                  maxLength={3}
                  error={Boolean(error)}
                  isError={Boolean(error)}
                  value={value}
                  formatter={(value) => value && `${value}%`}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>
    ),
    [bank?.name, control, errors?.bank, handleChooseBank]
  );

  if (!selectedProduct.id && !isEditMode) {
    return (
      <View
        paddingV-16
        center
        bg-surface
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <Text body2 textBlackMedium>
          Chọn xe từ danh mục quan tâm!
        </Text>
        <Text body2 textBlackMedium>
          Thông tin xe sẽ được cập nhật cụ thể
        </Text>
        <Button
          borderRadius={4}
          outline
          outlineColor={Colors.primary900}
          marginT-8
          onPress={handleChooseFavoriteProduct}
        >
          <Text primary900 button>
            Chọn xe
          </Text>
        </Button>
      </View>
    );
  }

  return (
    <View flex useSafeArea>
      <KeyboardAvoidingView
        style={gStyles.flex1}
        enabled
        keyboardVerticalOffset={120}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <Headline label="Thông tin xe" />
          <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
            <TouchableOpacity onPress={handleChooseFavoriteProduct}>
              <ProductImage
                uri={selectedProduct.favoriteModel.model.photo?.url}
                name={selectedProduct.product?.name}
              />
            </TouchableOpacity>

            <TextRow
              left="Loại xe"
              right={selectedProduct.product?.name}
              leftRequired
              rightDisabled
            />
            <TextRow
              left="MTO"
              right={selectedProduct.favoriteModel?.model.description}
              rightDisabled
            />
            <TextRow
              left="Màu xe"
              right={selectedProduct.exteriorColor?.name}
              rightDisabled
            />
            <TextRow
              left="Màu nội thất"
              right={selectedProduct.interiorColor?.name}
              rightDisabled
            />

            <View row marginT-10 centerV>
              <InputLabel text="Chính sách" />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.policy)}
                label={getValues("policy")?.name}
                onPress={handlePolicyPicked}
              />
            </View>
            <TextRow
              left="Tỉnh"
              right={customer.province?.name}
              rightDisabled
            />
            <View row marginT-10 centerV>
              <InputLabel text="Mục đích sử dụng" />
              <SelectField
                flex-2
                placeholder="Chọn"
                label={getValues("intendedUse")}
                onPress={handleIntendedUsePressed}
              />
            </View>
            <TextRow
              left="Giá niêm yết"
              right={currencyFormatter(
                policy?.listedPrice || selectedProduct.product?.listedPrice
              )}
              rightDisabled
            />
            <View row marginT-10 centerV>
              <InputLabel text="Giảm giá" />
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
              <InputLabel text="Thời gian giao xe dự kiến" required />
              <View flex-2>
                <Controller
                  name="deliveryDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      value={toDate(value)}
                      onChange={onChange}
                      minimumDate={new Date()}
                      dateFormat="DD/MM/YYYY"
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Nhập"
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
              <InputLabel text="Lệ phí trước bạ" />
              <View flex-2>
                <Controller
                  name="registrationTax"
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
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Loại giảm lệ phí" />
              <SelectField
                flex-2
                placeholder="Chọn"
                label={DiscountTypes[registrationTaxDiscountType]}
                onPress={handleDiscountTypePressed}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Giảm lệ phí trước bạ" />
              <View flex-2>
                <Controller
                  name="registrationTaxDiscount"
                  defaultValue=""
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập"
                      keyboardType="numeric"
                      disabled={!registrationTaxDiscountType}
                      error={Boolean(error)}
                      isError={Boolean(error)}
                      maxLength={
                        registrationTaxDiscountType ===
                        DiscountTypeObject.number
                          ? undefined
                          : 3
                      }
                      value={value}
                      formatter={(value) => {
                        if (value) {
                          if (
                            registrationTaxDiscountType ===
                            DiscountTypeObject.number
                          ) {
                            return `${currencyFormat.format(value, {
                              precision: 0,
                            })}đ`;
                          }
                          return `${value}%`;
                        }
                      }}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Lệ phí biển số" />
              <View flex-2>
                <Controller
                  name="licensePlateFee"
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
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Lệ phí đăng kiểm" />
              <View flex-2>
                <Controller
                  name="registrationFee"
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
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Phí lưu hành nội bộ" />
              <View flex-2>
                <Controller
                  name="internalCirculationFee"
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
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Phí dịch vụ đăng ký xe" />
              <View flex-2>
                <Controller
                  name="serviceFee"
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
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
          </View>
          <Headline label="Quà tặng" />
          <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
            <View row centerV>
              <InputLabel text="Quà tặng theo xe" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.hasPresent)}
                label={YesNos[YesNosEn[getValues("hasPresent")]]}
                onPress={handlePresentPicked}
              />
            </View>

            <View row marginT-10 centerV>
              <InputLabel text="Quà tặng khác" />
              <View flex-2>
                <Controller
                  name="otherPresents"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập"
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

          <Headline label="Bảo hiểm" onPress={handleCreateInsurance} />

          {insurances && (
            <View style={[gStyles.borderV, gStyles.shadow]}>
              {insurances.map((item) => (
                <InsuranceCard
                  key={item.id}
                  insurance={item}
                  canPress={false}
                />
              ))}
            </View>
          )}

          <View bg-primary50 marginT-12>
            <ExpandableSection
              top={false}
              expanded={hasFinancialSolution}
              sectionHeader={
                <>
                  <View style={styles.switch}>
                    <Switch
                      value={hasFinancialSolution}
                      height={32}
                      width={52}
                      thumbSize={28}
                    />
                  </View>
                  <View
                    row
                    spread
                    centerV
                    paddingH-16
                    height={44}
                    style={gStyles.borderT}
                  >
                    <Text subtitle1>Giải pháp tài chính</Text>
                  </View>
                </>
              }
              onPress={handleFinancialSolution}
            >
              {renderFinancialSolutionSection()}
            </ExpandableSection>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomWheelPicker
        key={actionConfig.key}
        initialValue={
          typeof getValues(actionConfig.key) === "boolean"
            ? YesNosEn[getValues(actionConfig.key)]
            : getValues(actionConfig.key)
        }
        visible={actionShown}
        items={actionConfig.items}
        onChange={actionConfig.onChange}
        onCancel={actionConfig.onCancel}
        onDismiss={handleDismiss}
      />
    </View>
  );
};

QuotationEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      quotation: PropTypes.object,
    }),
  }),
};

export default QuotationEditor;
