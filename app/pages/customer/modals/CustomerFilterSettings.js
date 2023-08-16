import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  View,
} from "react-native-ui-lib";

import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import { Calendar } from "../../../configs/assets";

import {
  CustomerScopes,
  CustomerSortBy,
  CustomerSources,
  OrderBy,
  PaymentMethods,
  SaleProcesses,
} from "../../../helper/constants";
import {
  resetQuery,
  selectQuery,
  setQuery,
} from "../../../store/slices/customer";

import gStyles from "../../../configs/gStyles";
import {
  arr2WheelItems,
  formatFilter,
  obj2WheelItems,
  toDate,
} from "../../../helper/utils";
import { useGetManagerAccountsQuery } from "../../../store/api/account";

const CustomerFilterSettings = ({ navigation, route: { params } }) => {
  const isBoughtCustomer = params?.isBoughtCustomer;
  const dispatch = useDispatch();

  const query = useSelector(selectQuery);
  const [_customerScopes, setCustomerScopes] = useState(obj2WheelItems(CustomerScopes));
  const [scopeDataChanged, setScopeDataChanged] = useState(false); // Biến state để theo dõi thay đổi của _customerScopes
  const { data = [], isFetching, refetch } = useGetManagerAccountsQuery();

  // Sử dụng useEffect để theo dõi sự thay đổi của data
  useEffect(() => {
    if (data.length > 0) {
      const listAccounts = data.map((item) => ({
        value: item.id.toString(),
        label: item.name,
      }));
      setCustomerScopes((prevScopes) => [...prevScopes, ...listAccounts]);
      setScopeDataChanged(true); // Cập nhật biến state khi _customerScopes thay đổi
    }
  }, [data]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      dispatch(
        setQuery({
          ...data,
          from: formatFilter(data.from),
          to: formatFilter(data.to),
        })
      );
      navigation.goBack();
    },
    [dispatch, navigation]
  );

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const { control, getValues, handleSubmit, reset, setValue } = useForm({
    defaultValues: query,
  });

  useEffect(() => {
    reset(query);
  }, [query, reset]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => (
        <Button link paddingH-16 onPress={handleSubmit(handleSave)}>
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, navigation]);

  const handleSortbyClicked = useCallback(() => {
    setActionConfig({
      key: "sortby",
      items: obj2WheelItems(CustomerSortBy),
      onChange: (value) => setValue("sortby", value, { shouldValidate: true }),
      onCancel: null,
    });

    setActionShown(true);
  }, [setValue]);

  const handleOrderByClicked = useCallback(() => {
    setActionConfig({
      key: "orderby",
      items: obj2WheelItems(OrderBy),
      onChange: (value) => setValue("orderby", value, { shouldValidate: true }),
      onCancel: null,
    });

    setActionShown(true);
  }, [setValue]);

  const handleScopeClicked = useCallback(() => {
    setActionConfig({
      key: "scope",
      items: _customerScopes,
      onChange: (value) =>
        setValue("scope", value, { shouldValidate: true }),
      onCancel: null,
    });

    setActionShown(true);
  }, [setValue, _customerScopes]);
  const handleProcessClicked = useCallback(() => {
    setActionConfig({
      key: "process",
      items: obj2WheelItems(SaleProcesses),
      onChange: (value) => setValue("process", value, { shouldValidate: true }),
      onCancel: () => setValue("process", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleMethodClicked = useCallback(() => {
    setActionConfig({
      key: "paymentMethod",
      items: arr2WheelItems(PaymentMethods),
      onChange: (value) =>
        setValue("paymentMethod", value, { shouldValidate: true }),
      onCancel: () => setValue("paymentMethod", null),
    });
    setActionShown(true);
  }, [setValue]);

  const handleSourceClicked = useCallback(() => {
    setActionConfig({
      key: "source",
      items: arr2WheelItems(CustomerSources),
      onChange: (value) => setValue("source", value, { shouldValidate: true }),
      onCancel: () => setValue("source", null),
    });

    setActionShown(true);
  }, [setValue]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  const handleResetClicked = useCallback(() => {
    dispatch(resetQuery());
    reset(query);
  }, [dispatch, query, reset]);

  return (
    <BasePage loading={isFetching}>
      <Headline label="Phân nhóm" marginT-8 />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Sắp xếp theo" />
          <SelectField
            flex-2
            label={CustomerSortBy[getValues("sortby")]}
            onPress={handleSortbyClicked}
          />
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Thứ tự sắp xêp" />
          <SelectField
            flex-2
            label={OrderBy[getValues("orderby")]}
            onPress={handleOrderByClicked}
          />
        </View>
      </View>

      <Headline label="Nâng cao" />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Khách hàng" />
          {scopeDataChanged ? ( // Kiểm tra nếu dữ liệu _customerScopes đã thay đổi
            <SelectField
              flex-2
              label={_customerScopes?.find(
                (option) => option?.value === getValues("scope")
              )?.label}
              onPress={handleScopeClicked}
            />
          ) : (
            <SelectField
              flex-2
              label={CustomerScopes[getValues("scope")]}
              onPress={handleScopeClicked}
            />
          )}
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Quy trình" />
          <SelectField
            flex-2
            label={SaleProcesses[getValues("process")]}
            placeholder="Chọn"
            onPress={handleProcessClicked}
          />
        </View>

        {!isBoughtCustomer && (
          <>
            <View row marginT-10 centerV>
              <InputLabel text="Hình thức" />
              <SelectField
                flex-2
                label={getValues("paymentMethod")}
                placeholder="Chọn"
                onPress={handleMethodClicked}
              />
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Nguồn" />
              <SelectField
                flex-2
                label={getValues("source")}
                placeholder="Chọn"
                onPress={handleSourceClicked}
              />
            </View>
          </>
        )}

        <View row marginT-10 centerV>
          <InputLabel text="Từ ngày" />
          <View flex-2>
            <Controller
              name="from"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  title="Từ ngày"
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
          <InputLabel text="Đến ngày" />
          <View flex-2>
            <Controller
              name="to"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
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
      </View>

      <Button link marginT-16 onPressIn={handleResetClicked}>
        <Text primary900 button>
          Xoá bộ lọc
        </Text>
      </Button>

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

CustomerFilterSettings.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      isBoughtCustomer: PropTypes.bool,
    }),
  }),
};

export default CustomerFilterSettings;
