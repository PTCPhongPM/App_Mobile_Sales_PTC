import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";

import { ScrollView, useWindowDimensions } from "react-native";
import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import { Controller } from "react-hook-form";

import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import ProductImage from "../../../components/ProductImage";
import SellGiftFooter from "../../../components/SellGift/SellGiftFooter";
import SellGiveItem from "../../../components/SellGift/SellGiveItem";
import TextRow from "../../../components/TextRow";

import { Calendar, PriorityHigh16, SolidDelete } from "../../../configs/assets";
import gStyles from "../../../configs/gStyles";

import {
  arr2WheelItems,
  computeResultTotal,
  currencyFormatter,
  monthsFormatter,
  toDate,
  yearsFormatter,
} from "../../../helper/utils";

import LoadingOverlay from "../../../components/Loading/LoadingOverlay";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";
import { showDeleteAlert } from "../../../helper/alert";
import {
  BuyingTypes,
  DeliveryPlaces,
  IntendedUses,
  PaymentMethods,
  ProductRegistrationTypes,
} from "../../../helper/constants";

import { useDeleteInsuranceMutation } from "../../../store/api/insurance";
import {
  useDeleteAccessoryBranchMutation,
  useDeleteAccessoryBrandMutation,
  useDeleteMaintenanceExtendedMutation,
  useDeleteMaintenanceRoutineMutation,
  useDeletePromotionMutation,
  useDeleteRequestBrokerMutation,
} from "../../../store/api/request";

const RequestProductTab = ({ form, navigation, route }) => {
  const { height } = useWindowDimensions();
  const { customer, request } = route.params;

  const [isDeleting, setIsDeleting] = useState(false);

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const onDismiss = useCallback(() => setActionShown(false), []);

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = form;

  const policy = watch("policy");
  const paymentMethod = watch("paymentMethod");
  const bank = watch("bank");
  const accessoryPack = watch("accessoryPack");

  const fromDate = watch("fromDate");
  const toDateWatched = watch("toDate");

  const requestBrandAccessories = watch("requestBrandAccessories");
  const requestBranchAccessories = watch("requestBranchAccessories");
  const insurances = watch("insurances");
  const routineMaintenances = watch("routineMaintenances");
  const extendedMaintenances = watch("extendedMaintenances");
  const requestPromotions = watch("requestPromotions");
  const requestBroker = watch("requestBroker");

  const watchAll = watch();

  const [selectedProduct, setSelectedProduct] = useState(
    request?.favoriteProduct || {}
  );

  const [deleteBrandAccessory] = useDeleteAccessoryBrandMutation();
  const [deleteBranchAccessory] = useDeleteAccessoryBranchMutation();
  const [deleteInsurance] = useDeleteInsuranceMutation();
  const [deleteMaintenanceExtended] = useDeleteMaintenanceExtendedMutation();
  const [deleteMaintenanceRoutine] = useDeleteMaintenanceRoutineMutation();
  const [deletePromotion] = useDeletePromotionMutation();
  const [deleteRequestBroker] = useDeleteRequestBrokerMutation();

  const deleteFunction = useMemo(
    () => ({
      requestBrandAccessories: deleteBrandAccessory,
      requestBranchAccessories: deleteBranchAccessory,
      insurances: deleteInsurance,
      routineMaintenances: deleteMaintenanceRoutine,
      extendedMaintenances: deleteMaintenanceExtended,
      requestPromotions: deletePromotion,
      requestBroker: deleteRequestBroker,
    }),
    [
      deleteBranchAccessory,
      deleteBrandAccessory,
      deleteInsurance,
      deleteMaintenanceExtended,
      deleteMaintenanceRoutine,
      deletePromotion,
      deleteRequestBroker,
    ]
  );

  const numbers = useMemo(
    () =>
      computeResultTotal([
        ...(requestBrandAccessories || []),
        ...(requestBranchAccessories || []),
        ...(insurances || []),
        ...(routineMaintenances || []),
        ...(extendedMaintenances || []),
        ...(requestPromotions || []),
      ]),
    [
      extendedMaintenances,
      insurances,
      requestBranchAccessories,
      requestBrandAccessories,
      requestPromotions,
      routineMaintenances,
    ]
  );

  const handleChooseFavoriteProduct = useCallback(
    () =>
      navigation.navigate("FavoriteProductPicker", {
        customer,
        selected: selectedProduct,
        onSelect: (value) => {
          setSelectedProduct(value);
          setValue("favoriteProduct", value);
        },
      }),
    [customer, navigation, selectedProduct, setValue]
  );

  const handlePolicyPicked = useCallback(
    () =>
      navigation.navigate("PolicyPicker", {
        productCode: selectedProduct?.product?.code,
        selected: policy,
        onSelect: (value) =>
          setValue("policy", value, { shouldValidate: true }),
      }),
    [navigation, policy, selectedProduct?.product?.code, setValue]
  );

  const handleAccessoryPackPicked = useCallback(
    () =>
      navigation.navigate("AccessoryPackPicker", {
        productCode: selectedProduct?.product?.code,
        selected: accessoryPack,
        onSelect: (value) =>
          setValue("accessoryPack", value, { shouldValidate: true }),
      }),
    [navigation, selectedProduct?.product?.code, accessoryPack, setValue]
  );

  const handleAddBrandAccessoryPressed = useCallback(
    () =>
      navigation.navigate("BrandAccessoryEditor", {
        onChange: (value) =>
          setValue(
            "requestBrandAccessories",
            Array.isArray(requestBrandAccessories)
              ? [...requestBrandAccessories, value]
              : [value]
          ),
      }),
    [navigation, requestBrandAccessories, setValue]
  );

  const handleAddBranchAccessoryPressed = useCallback(
    () =>
      navigation.navigate("BranchAccessoryEditor", {
        onChange: (value) =>
          setValue(
            "requestBranchAccessories",
            Array.isArray(requestBranchAccessories)
              ? [...requestBranchAccessories, value]
              : [value]
          ),
      }),
    [navigation, requestBranchAccessories, setValue]
  );

  const handleAddInsurancePressed = useCallback(
    () =>
      navigation.navigate("InsuranceEditor", {
        customer,
        onChange: (value) =>
          setValue(
            "insurances",
            Array.isArray(insurances) ? [...insurances, value] : [value]
          ),
      }),
    [navigation, customer, setValue, insurances]
  );

  const handleAddRoutineMaintenancePressed = useCallback(
    () =>
      navigation.navigate("RoutineMaintenanceEditor", {
        onChange: (value) =>
          setValue(
            "routineMaintenances",
            Array.isArray(routineMaintenances)
              ? [...routineMaintenances, value]
              : [value]
          ),
      }),
    [navigation, routineMaintenances, setValue]
  );

  const handleAddExtendedMaintenancePressed = useCallback(
    () =>
      navigation.navigate("ExtendedMaintenanceEditor", {
        onChange: (value) =>
          setValue(
            "extendedMaintenances",
            Array.isArray(extendedMaintenances)
              ? [...extendedMaintenances, value]
              : [value]
          ),
      }),
    [navigation, setValue, extendedMaintenances]
  );

  const handleAddBrokerPressed = useCallback(
    () =>
      navigation.navigate("RequestBrokerEditor", {
        customer,
        onChange: (value) => setValue("requestBroker", value),
      }),
    [customer, navigation, setValue]
  );

  const handleAddPromotionPressed = useCallback(
    () =>
      navigation.navigate("PromotionEditor", {
        onChange: (value) =>
          setValue(
            "requestPromotions",
            Array.isArray(requestPromotions)
              ? [...requestPromotions, value]
              : [value]
          ),
      }),
    [navigation, setValue, requestPromotions]
  );

  const handleBankPicked = useCallback(
    () =>
      navigation.navigate("BankPicker", {
        selected: bank,
        onSelect: (value) => {
          setValue("bank", value, { shouldValidate: true });
        },
      }),
    [bank, navigation, setValue]
  );

  const handleChoosePaymentMethod = useCallback(() => {
    setActionConfig({
      key: "paymentMethod",
      items: arr2WheelItems(PaymentMethods),
      onChange: (value) => {
        setValue("paymentMethod", value, { shouldValidate: true });
        if (value !== "Trả góp") {
          setValue("bank", null);
          setValue("loanAmount", null);
        }
      },
      onCancel: () => {
        setValue("paymentMethod", null, { shouldValidate: true });
        setValue("bank", null);
        setValue("loanAmount", null);
      },
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseIntendedUsed = useCallback(() => {
    setActionConfig({
      key: "intendedUse",
      items: arr2WheelItems(IntendedUses),
      onChange: (value) =>
        setValue("intendedUse", value, { shouldValidate: true }),
      onCancel: () => setValue("intendedUse", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseBuyingType = useCallback(() => {
    setActionConfig({
      key: "buyingType",
      items: arr2WheelItems(BuyingTypes),
      onChange: (value) =>
        setValue("buyingType", value, { shouldValidate: true }),
      onCancel: () => setValue("buyingType", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseRegistration = useCallback(() => {
    setActionConfig({
      key: "registration",
      items: arr2WheelItems(ProductRegistrationTypes),
      onChange: (value) =>
        setValue("registration", value, { shouldValidate: true }),
      onCancel: () => setValue("registration", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseDeliveryPlace = useCallback(() => {
    setActionConfig({
      key: "deliveryPlace",
      items: arr2WheelItems(DeliveryPlaces),
      onChange: (value) =>
        setValue("deliveryPlace", value, { shouldValidate: true }),
      onCancel: () => setValue("deliveryPlace", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleDelete = useCallback(
    async (key, index) => {
      setIsDeleting(true);
      await deleteFunction[key]({ id: watchAll[key][index].id }).unwrap();
      watchAll[key].splice(index, 1);

      setIsDeleting(false);
    },
    [deleteFunction, watchAll]
  );

  if (!selectedProduct.id) {
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
    <View flex spread>
      <View flexS>
        <ScrollView
          contentContainerStyle={[gStyles.basePage, { minHeight: height }]}
        >
          <Headline label="Thông tin xe" marginT-8 />
          <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
            <TouchableOpacity onPress={handleChooseFavoriteProduct}>
              <ProductImage
                uri={selectedProduct.favoriteModel.model.photo?.url}
                name={selectedProduct.product?.name}
              />
            </TouchableOpacity>
            <TextRow
              marginT-10
              left="Loại xe"
              leftRequired
              rightDisabled
              right={selectedProduct.product?.name}
            />
            <TextRow
              marginT-10
              left="Mẫu xe"
              leftRequired
              rightDisabled
              right={selectedProduct.favoriteModel?.model.description}
            />
            <TextRow
              marginT-10
              left="Màu xe"
              leftRequired
              rightDisabled
              right={selectedProduct.exteriorColor?.name}
            />
            <TextRow
              marginT-10
              left="Màu nội thất"
              rightDisabled
              right={selectedProduct.interiorColor?.name}
            />
            <View row marginT-10 centerV>
              <InputLabel text="Chính sách" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.policy)}
                label={policy?.name}
                onPress={handlePolicyPicked}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Số lượng" required />
              <View flex-2>
                <Controller
                  name="quantity"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập"
                      keyboardType="number-pad"
                      value={value ? String(value) : ""}
                      error={error}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Giao xe từ" required />
              <View flex-2>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      value={toDate(value)}
                      dateFormat="DD/MM/YYYY"
                      maximumDate={toDateWatched}
                      onChange={onChange}
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Chọn"
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
              <InputLabel text="Đến ngày" required />
              <View flex-2>
                <Controller
                  name="toDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      value={toDate(value)}
                      dateFormat="DD/MM/YYYY"
                      minimumDate={fromDate}
                      onChange={onChange}
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Chọn"
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
            <TextRow
              capitalize
              left="Giá niêm yết"
              leftRequired
              rightDisabled
              right={currencyFormatter(
                policy?.listedPrice || selectedProduct.product?.listedPrice
              )}
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
                      value={value}
                      error={error}
                      formatter={currencyFormatter}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Tiền đặt cọc" required />
              <View flex-2>
                <Controller
                  name="deposit"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập"
                      keyboardType="numeric"
                      value={value}
                      error={error}
                      formatter={currencyFormatter}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Hạn đặt cọc" required />
              <View flex-2>
                <Controller
                  name="depositDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      value={toDate(value)}
                      minimumDate={new Date()}
                      dateFormat="DD/MM/YYYY"
                      onChange={onChange}
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Chọn"
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
              <InputLabel text="Hình thức thanh toán" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                label={paymentMethod}
                error={Boolean(errors.paymentMethod)}
                onPress={handleChoosePaymentMethod}
              />
            </View>

            {paymentMethod === "Trả góp" && (
              <>
                <View row marginT-10 centerV>
                  <InputLabel
                    text="Ngân hàng"
                    required={paymentMethod === "Trả góp"}
                  />
                  <SelectField
                    flex-2
                    placeholder="Chọn"
                    error={Boolean(errors.bank)}
                    label={getValues("bank")?.name}
                    onPress={handleBankPicked}
                    disabled={paymentMethod !== "Trả góp"}
                  />
                </View>
                <View row marginT-10 centerV>
                  <InputLabel
                    text="Số tiền vay"
                    required={paymentMethod === "Trả góp"}
                  />
                  <View flex-2>
                    <Controller
                      name="loanAmount"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextInput
                          placeholder="Nhập"
                          keyboardType="numeric"
                          value={value}
                          error={error}
                          disabled={paymentMethod !== "Trả góp"}
                          formatter={currencyFormatter}
                          isError={Boolean(error)}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                </View>
              </>
            )}
            <View row marginT-10 centerV>
              <InputLabel text="Mục đích sử dụng" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.intendedUse)}
                label={getValues("intendedUse")}
                onPress={handleChooseIntendedUsed}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Hình thức mua xe" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.buyingType)}
                label={getValues("buyingType")}
                onPress={handleChooseBuyingType}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Đăng ký xe" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.registration)}
                label={getValues("registration")}
                onPress={handleChooseRegistration}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Giao xe" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.deliveryPlace)}
                label={getValues("deliveryPlace")}
                onPress={handleChooseDeliveryPlace}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Gói quà tặng" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.accessoryPack)}
                label={accessoryPack?.name}
                onPress={handleAccessoryPackPicked}
              />
            </View>
            <TextRow capitalize left="Quà tặng theo xe" right={""} />
            <View row marginT-10 centerV>
              <InputLabel text="Ghi chú" />
              <View flex-2>
                <Controller
                  name="note"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      placeholder="Nhập"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
          </View>

          <Headline
            label="Phụ kiện hãng"
            onPress={handleAddBrandAccessoryPressed}
          />

          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {requestBrandAccessories &&
              requestBrandAccessories.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.accessory.name}
                  formality={item.formality}
                  amount={item.amount}
                  total={item.total}
                  onDelete={() =>
                    handleDelete("requestBrandAccessories", index)
                  }
                />
              ))}
            <SellGiftFooter items={requestBrandAccessories} />
          </View>
          <Headline
            label="Phụ kiện đại lý"
            onPress={handleAddBranchAccessoryPressed}
          />
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {requestBranchAccessories &&
              requestBranchAccessories.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.accessory.name}
                  formality={item.formality}
                  amount={item.amount}
                  total={item.total}
                  onDelete={() =>
                    handleDelete("requestBranchAccessories", index)
                  }
                />
              ))}
            <SellGiftFooter items={requestBranchAccessories} />
          </View>

          <Headline label="Bảo hiểm" onPress={handleAddInsurancePressed} />
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {insurances &&
              insurances.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.name}
                  formality={item.method}
                  years={item.years}
                  total={item.total}
                  onDelete={() => handleDelete("insurances", index)}
                />
              ))}
            <SellGiftFooter
              items={insurances?.map((e) => ({
                ...e,
                formality: e.method,
              }))}
            />
          </View>

          <Headline
            label="Bảo dưỡng định kỳ"
            onPress={handleAddRoutineMaintenancePressed}
          />

          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {routineMaintenances &&
              routineMaintenances.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.maintenance?.description}
                  formality={item.formality}
                  duration={monthsFormatter(item.duration)}
                  total={item.total}
                  onDelete={() => handleDelete("routineMaintenances", index)}
                />
              ))}
            <SellGiftFooter items={routineMaintenances} />
          </View>

          <Headline
            label="Gia hạn bảo hành"
            onPress={handleAddExtendedMaintenancePressed}
          />
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {extendedMaintenances &&
              extendedMaintenances.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.maintenance?.description}
                  formality={item.formality}
                  duration={yearsFormatter(item.duration)}
                  total={item.total}
                  onDelete={() => handleDelete("extendedMaintenances", index)}
                />
              ))}
            <SellGiftFooter items={extendedMaintenances} />
          </View>

          <Headline
            label="Khuyến mại khác"
            onPress={handleAddPromotionPressed}
          />
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {requestPromotions &&
              requestPromotions.map((item, index) => (
                <SellGiveItem
                  key={item.id}
                  name={item.promotion?.description}
                  formality={item.formality}
                  amount={item.amount}
                  total={item.total}
                  onDelete={() => handleDelete("requestPromotions", index)}
                />
              ))}
            <SellGiftFooter items={requestPromotions} />
          </View>

          {customer?.brokerInfo && (
            <Headline
              label="Hoa hồng"
              onPress={requestBroker ? null : handleAddBrokerPressed}
            />
          )}
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            {requestBroker && (
              <SwipeWrapper
                rightActions={[
                  {
                    text: "Xóa",
                    color: Colors.stateRedDefault,
                    icon: <SolidDelete fill={Colors.surface} />,
                    onPress: () =>
                      showDeleteAlert(
                        "Xóa",
                        "Bạn có chắc chắn muốn xoá?",
                        handleDelete("requestBroker", 0)
                      ),
                  },
                ]}
              >
                <View paddingH-16 paddingV-12 style={gStyles.borderB}>
                  <Text subtitle2>Chi phí môi giới</Text>
                  <View row spread>
                    <Text body2 textBlackMedium>
                      Ghi chú: {requestBroker?.note}
                    </Text>
                    <Text> {currencyFormatter(requestBroker?.amount)}</Text>
                  </View>
                </View>
              </SwipeWrapper>
            )}
          </View>
        </ScrollView>
      </View>

      <View
        paddingV-12
        paddingH-20
        bg-surface
        style={[gStyles.shadowUp, gStyles.borderT]}
      >
        <View row spread>
          <Text body2 textBlackMedium>
            Tổng bán
          </Text>
          <Text body2 textBlackMedium>
            {currencyFormatter(numbers.sell)}
          </Text>
        </View>
        <View row spread>
          <Text body2 textBlackMedium>
            Tổng tặng
          </Text>
          <Text body2 textBlackMedium>
            {currencyFormatter(numbers.gift)}
          </Text>
        </View>
        <View row spread>
          <Text body2 textBlackMedium>
            Hoa hồng
          </Text>
          <Text body2 textBlackMedium>
            {currencyFormatter(requestBroker?.amount)}
          </Text>
        </View>
        <View row spread>
          <Text body2 textBlackMedium>
            Khung BH
          </Text>
          <View row centerV>
            {numbers.gift > Number(policy?.insuranceDiscountMax) && (
              <PriorityHigh16 fill={Colors.primary900} />
            )}
            <Text
              body2
              textBlackMedium
              primary900={numbers.gift > Number(policy?.insuranceDiscountMax)}
            >
              {currencyFormatter(Number(policy?.insuranceDiscountMax))}
            </Text>
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
      {isDeleting && <LoadingOverlay />}
    </View>
  );
};

RequestProductTab.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.any,
    formState: PropTypes.shape({
      errors: PropTypes.object,
    }),
    getValues: PropTypes.func,
    setValue: PropTypes.func,
    watch: PropTypes.func,
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      request: PropTypes.shape({
        favoriteProduct: PropTypes.object,
      }),
    }),
  }),
};

export default RequestProductTab;
