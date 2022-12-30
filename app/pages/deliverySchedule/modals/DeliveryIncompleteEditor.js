import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";

import { DeliveryIncompleteReasons } from "../../../helper/constants";

import { arr2WheelItems } from "../../../helper/utils";

import gStyles from "../../../configs/gStyles";

import { useNotification } from "../../../providers/NotificationProvider";
import { useIncompleteDeliveryMutation } from "../../../store/api/delivery";

const schema = yup.object().shape({
  reason: yup.string().required(),
});

const DeliveryIncompleteEditor = ({ navigation, route }) => {
  const notification = useNotification();
  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  const [completeDelivery, { isLoading, isSuccess }] =
    useIncompleteDeliveryMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSave = useCallback(
    (data) =>
      completeDelivery({
        id: route.params.delivery.id,
        reason: data.reason,
      }),
    [completeDelivery, route.params.delivery.id]
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

  const handleChooseReason = useCallback(() => {
    setActionConfig({
      key: "reason",
      items: arr2WheelItems(DeliveryIncompleteReasons),
      onChange: (value) => setValue("reason", value, { shouldValidate: true }),
      onCancel: () => setValue("reason", null, { shouldValidate: true }),
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage loading={isLoading}>
      <View
        bg-surface
        padding-16
        style={[gStyles.borderV, gStyles.shadow]}
        row
        centerV
      >
        <InputLabel text="Lý do" required />
        <SelectField
          flex-2
          placeholder="Chọn"
          error={Boolean(errors.reason)}
          label={getValues("reason")}
          onPress={handleChooseReason}
        />
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

DeliveryIncompleteEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      delivery: PropTypes.shape({
        id: PropTypes.number,
      }),
    }),
  }),
};

export default DeliveryIncompleteEditor;
