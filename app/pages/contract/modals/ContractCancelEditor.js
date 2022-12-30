import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { Button, Text, View } from "react-native-ui-lib";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Toast } from "react-native-ui-lib/src/incubator";
import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";

import { CancelContractReasons } from "../../../helper/constants";
import { arr2WheelItems } from "../../../helper/utils";

import gStyles from "../../../configs/gStyles";
import { useNotification } from "../../../providers/NotificationProvider";
import { useCancelContractMutation } from "../../../store/api/contract";

const schema = yup.object().shape({
  reason: yup.string().required(),
  note: yup.string().nullable(true),
});

const ContractCancelEditor = ({ navigation, route }) => {
  const contract = route.params.contract;
  const notification = useNotification();

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const [cancelContract, { isLoading, isSuccess }] =
    useCancelContractMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage(
        "Hủy hợp đồng thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onDismiss = useCallback(() => setActionShown(false), []);
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      cancelContract({
        id: contract.id,
        reason: data.reason,
        note: data.note,
      });
    },
    [cancelContract, contract.id]
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
          disabled={isLoading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, isLoading, navigation]);

  const handleReasonPressed = useCallback(() => {
    setActionConfig({
      key: "reason",
      items: arr2WheelItems(CancelContractReasons),
      onChange: (value) => setValue("reason", value),
      onCancel: () => setValue("reason", null),
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage loading={isLoading}>
      <View padding-16 bg-surface style={[gStyles.borderB, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Lý do" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.reason)}
            label={getValues("reason")}
            onPress={handleReasonPressed}
          />
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Ghi chú" />
          <View flex-2>
            <Controller
              name="note"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Nhập"
                  value={value}
                  multiline
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
    </BasePage>
  );
};

ContractCancelEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      contract: PropTypes.object,
    }),
  }),
};

export default ContractCancelEditor;
