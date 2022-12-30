import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { Controller } from "react-hook-form";
import { ScrollView, useWindowDimensions } from "react-native";
import { Colors, DateTimePicker, View } from "react-native-ui-lib";

import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import gStyles from "../../../configs/gStyles";
import Headline from "../../../components/Header/Headline";
import TextInput from "../../../components/Input/TextInput";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";

import {
  arr2WheelItems,
  currencyFormatter,
  toDate,
} from "../../../helper/utils";
import {
  ContractTypes,
  PaymentMethods,
  ContractSigners,
} from "../../../helper/constants";
import { Calendar } from "../../../configs/assets";
import { useDirectorRole } from "../../../helper/hooks";

const ContractEditorTab = ({ contract, form }) => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const isDirector = useDirectorRole();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);
  const onDismiss = useCallback(() => setActionShown(false), []);

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = form;

  const paymentMethod = watch("paymentMethod");
  const signer = watch("signer");
  const bankAccount = watch("bankAccount");
  const bank = watch("bank");

  const handleChooseType = useCallback(() => {
    setActionConfig({
      key: "type",
      items: arr2WheelItems(ContractTypes),
      onChange: (value) => setValue("type", value, { shouldValidate: true }),
      onCancel: () => setValue("type", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChoosePaymentMethod = useCallback(() => {
    setActionConfig({
      key: "paymentMethod",
      items: arr2WheelItems(PaymentMethods),
      onChange: (value) => {
        setValue("paymentMethod", value, { shouldValidate: true });
        if (paymentMethod !== "Trả góp") {
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
  }, [paymentMethod, setValue]);

  const handleChooseSigner = useCallback(() => {
    setActionConfig({
      key: "signer",
      items: arr2WheelItems(ContractSigners),
      onChange: (value) => setValue("signer", value, { shouldValidate: true }),
      onCancel: () => setValue("signer", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  const handleChooseBank = useCallback(
    () =>
      navigation.navigate("BankPicker", {
        selected: bank,
        onSelect: (value) => setValue("bank", value, { shouldValidate: true }),
      }),
    [bank, navigation, setValue]
  );

  const handleChooseBankAccount = useCallback(
    () =>
      navigation.navigate("BankAccountPicker", {
        selected: bankAccount,
        onSelect: (value) =>
          setValue("bankAccount", value, { shouldValidate: true }),
      }),
    [bankAccount, navigation, setValue]
  );

  return (
    <ScrollView
      contentContainerStyle={[gStyles.basePage, { minHeight: height * 1.1 }]}
    >
      <Headline label="Thông tin hợp đồng" marginT-8 />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Số hợp đồng 1" required />
          <View flex-2>
            <TextInput
              keyboardType="numeric"
              value={contract.code.toUpperCase()}
              disabled
            />
          </View>
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Số hợp đồng 2" required={isDirector} />
          <View flex-2>
            <Controller
              name="code2"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  value={value}
                  disabled={!isDirector}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Loại hợp đồng" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("type")}
            error={Boolean(errors.type)}
            onPress={handleChooseType}
          />
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
              <InputLabel text="Ngân hàng" required />
              <SelectField
                flex-2
                placeholder="Chọn"
                error={Boolean(errors.bank)}
                label={bank?.name}
                onPress={handleChooseBank}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Số tiền vay" />
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
                      returnKeyType="done"
                      error={error}
                      isError={Boolean(error)}
                      formatter={currencyFormatter}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
          </>
        )}

        <View row marginT-10 centerV>
          <InputLabel text="Ngày ký" required />
          <View flex-2>
            <Controller
              defaultValue=""
              name="signingDate"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  value={toDate(value)}
                  // maximumDate={new Date()}
                  dateFormat="DD/MM/YYYY"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Ngày ký"
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
          <InputLabel text="Người ký" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.signer)}
            label={signer}
            onPress={handleChooseSigner}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tài khoản NH" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.bankAccount)}
            label={bankAccount?.accountNumber}
            onPress={handleChooseBankAccount}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tiền đặt cọc" required />
          <View flex-2>
            <TextInput
              placeholder="Nhập số điện thoại"
              keyboardType="numeric"
              value={currencyFormatter(contract.deposit)}
              disabled
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Thanh toán lần 2" required />
          <View flex-2>
            <Controller
              name="secondAmount"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  keyboardType="numeric"
                  value={value}
                  returnKeyType="done"
                  error={error}
                  isError={Boolean(error)}
                  formatter={currencyFormatter}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Còn lại" required />
          <View flex-2>
            <Controller
              name="remainingAmount"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập"
                  keyboardType="numeric"
                  value={value}
                  returnKeyType="done"
                  error={error}
                  isError={Boolean(error)}
                  formatter={currencyFormatter}
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
    </ScrollView>
  );
};

ContractEditorTab.propTypes = {
  contract: PropTypes.shape({
    code: PropTypes.string,
    deposit: PropTypes.number,
  }),
  form: PropTypes.shape({
    control: PropTypes.any,
    formState: PropTypes.shape({
      errors: PropTypes.object,
    }),
    getValues: PropTypes.func,
    setValue: PropTypes.func,
    watch: PropTypes.func,
  }),
};

export default ContractEditorTab;
