import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  View,
} from "react-native-ui-lib";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";

import BasePage from "../../../components/Base/BasePage";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";
import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import { Calendar } from "../../../configs/assets";

import { OrderBy, TestDriveSortBy } from "../../../helper/constants";
import {
  resetQuery,
  selectQuery,
  setQuery,
} from "../../../store/slices/testDrive";

import gStyles from "../../../configs/gStyles";
import { obj2WheelItems, toDate } from "../../../helper/utils";

const TestDriveFilterSettings = ({ navigation }) => {
  const dispatch = useDispatch();

  const query = useSelector(selectQuery);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const onDismiss = useCallback(() => setActionShown(false), []);

  const handleSave = useCallback(
    (data) => {
      dispatch(
        setQuery({
          ...data,
          from: data.from ? dayjs(data.from).startOf("d").toISOString() : null,
          to: data.to ? dayjs(data.to).endOf("d").toISOString() : null,
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

  useEffect(() => reset(query), [query, reset]);

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
      items: obj2WheelItems(TestDriveSortBy),
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

  const handleResetPressed = useCallback(() => {
    dispatch(resetQuery());
    reset(query);
  }, [dispatch, query, reset]);

  return (
    <BasePage>
      <Headline label="Phân nhóm" marginT-8 />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Sắp xếp theo" />
          <SelectField
            flex-2
            label={TestDriveSortBy[getValues("sortby")]}
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

      <Button link marginT-16 onPressIn={handleResetPressed}>
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

TestDriveFilterSettings.propTypes = {
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

export default TestDriveFilterSettings;
