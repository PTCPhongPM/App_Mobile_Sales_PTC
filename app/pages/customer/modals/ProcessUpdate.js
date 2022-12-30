import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import ProcessGroup from "../../../components/Process/ProcessGroup";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import gStyles from "../../../configs/gStyles";

import { useNotification } from "../../../providers/NotificationProvider";
import { Calendar } from "../../../configs/assets";
import { SaleProcesses, YesNos, YesNosEn } from "../../../helper/constants";

import { useUpdateFavoriteProductProcessMutation } from "../../../store/api/sale";
import { obj2WheelItems, toDate, toISO } from "../../../helper/utils";

const schema = yup.object().shape({
  process: yup.string().required(),
  arrivedAgent: yup.boolean().nullable(true),
  arrivalDate: yup.string().nullable(true),
  hasTestDrive: yup.boolean().nullable(true),
  testDriveDate: yup.string().nullable(true),
  reason: yup.string().nullable(true),
});

const ProcessUpdate = ({ navigation, route: { params } }) => {
  const { customer, product } = params;
  const notification = useNotification();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const [updateFavoriteProductProcess, { isLoading, isSuccess }] =
    useUpdateFavoriteProductProcessMutation();

  const defaultValues = useMemo(() => {
    const values = {
      process: product.process,
      arrivalDate: product.arrivalDate || "",
      arrivedAgent:
        product.arrivedAgent !== null ? product.arrivedAgent : undefined,
      hasTestDrive:
        product.hasTestDrive !== null ? product.hasTestDrive : undefined,
      reason: product.reason || "",
      testDriveDate: product.testDriveDate || "",
    };

    return values;
  }, [product]);

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const process = watch("process");
  const hasTestDrive = watch("hasTestDrive");

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      const _data = {
        ...data,
        id: product.id,
      };
      if (data.arrivalDate) {
        _data.arrivalDate = toISO(data.arrivalDate);
      }
      if (data.testDriveDate) {
        _data.testDriveDate = toISO(data.testDriveDate);
      }

      updateFavoriteProductProcess(_data);
    },
    [product.id, updateFavoriteProductProcess]
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
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, isLoading, navigation]);

  const handleAgentClicked = useCallback(() => {
    setActionConfig({
      key: "arrivedAgent",
      items: obj2WheelItems(YesNos),
      onChange: (value) => setValue("arrivedAgent", value === YesNosEn.true),
      onCancel: () => setValue("arrivedAgent", null),
    });

    setActionShown(true);
  }, [setValue]);

  const handleTestDriveClicked = useCallback(() => {
    setActionConfig({
      key: "hasTestDrive",
      items: obj2WheelItems(YesNos),
      onChange: (value) => {
        setValue("hasTestDrive", value === YesNosEn.true);
        setValue("testDriveDate", defaultValues.testDriveDate);
        setValue("reason", defaultValues.reason);
      },
      onCancel: () => {
        setValue("hasTestDrive", null);
        setValue("testDriveDate", defaultValues.testDriveDate);
        setValue("reason", defaultValues.reason);
      },
    });

    setActionShown(true);
  }, [defaultValues.reason, defaultValues.testDriveDate, setValue]);

  const onDismiss = useCallback(() => setActionShown(false), []);

  const handleProcessChanged = useCallback(
    (selectedProcess) => setValue("process", selectedProcess),
    [setValue]
  );

  return (
    <BasePage loading={isLoading}>
      <Headline label="Quy trình" marginT-8 />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <ProcessGroup process={process} onChange={handleProcessChanged} />
      </View>

      <Headline label="Thông tin quy trình" />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Giai đoạn" required />
          <View flex-2 paddingL-8>
            <Text textBlackLow>{SaleProcesses[process]}</Text>
          </View>
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Đến đại lý" />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.arrivedAgent)}
            label={YesNos[YesNosEn[getValues("arrivedAgent")]]}
            onPress={handleAgentClicked}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Ngày đến" />
          <View flex-2>
            <Controller
              name="arrivalDate"
              defaultValue={""}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  title="Ngày đến"
                  value={toDate(value)}
                  dateFormat="DD/MM/YYYY"
                  minimumDate={toDate(customer.firstContactDate)}
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn"
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

        <View row centerV marginT-10>
          <InputLabel text="Lái thử xe" />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.hasTestDrive)}
            label={YesNos[YesNosEn[hasTestDrive]]}
            onPress={handleTestDriveClicked}
          />
        </View>

        <View row centerV marginT-10>
          {hasTestDrive ? (
            <>
              <InputLabel text="Ngày lái thử" />
              <View flex-2>
                <Controller
                  name="testDriveDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      title="Ngày lái thử"
                      value={toDate(value)}
                      dateFormat="DD/MM/YYYY"
                      minimumDate={toDate(customer.firstContactDate)}
                      onChange={onChange}
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Chọn"
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
            </>
          ) : (
            <>
              <InputLabel text="Lý do" />
              <View flex-2>
                <Controller
                  name="reason"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập lý do không lái"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </>
          )}
        </View>
      </View>

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
        onDismiss={onDismiss}
      />
    </BasePage>
  );
};

ProcessUpdate.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.any,
      product: PropTypes.shape({
        id: PropTypes.number,
        process: PropTypes.string,
        arrivedAgent: PropTypes.bool,
        arrivalDate: PropTypes.string,
        hasTestDrive: PropTypes.bool,
        testDriveDate: PropTypes.string,
        reason: PropTypes.string,
      }),
    }),
  }),
};

export default ProcessUpdate;
