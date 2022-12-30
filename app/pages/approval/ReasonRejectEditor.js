import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Button,
  Colors,
  Incubator,
  Text,
  Typography,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";

import { useNotification } from "../../providers/NotificationProvider";
import { useRejectContractMutation } from "../../store/api/contract";
import { useRejectDeliveryMutation } from "../../store/api/delivery";
import { useRejectRequestMutation } from "../../store/api/request";
import { useRejectTestDriveMutation } from "../../store/api/testDrive";

const schema = yup.object().shape({
  reason: yup.string().required(),
});

const ReasonRejectEditor = ({ navigation, route: { params } }) => {
  const { id, type } = params;
  const notification = useNotification();

  const [
    rejectRequest,
    { isLoading: isRequestRejecting, isSuccess: requestRejected },
  ] = useRejectRequestMutation();

  const [
    rejectContract,
    { isLoading: isContractRejecting, isSuccess: contractRejected },
  ] = useRejectContractMutation();

  const [
    rejectTestDrive,
    { isLoading: isTestDriveRejecting, isSuccess: testDriveRejected },
  ] = useRejectTestDriveMutation();

  const [
    rejectDelivery,
    { isLoading: isDeliveryRejecting, isSuccess: deliveryRejected },
  ] = useRejectDeliveryMutation();

  const loading =
    isRequestRejecting ||
    isContractRejecting ||
    isTestDriveRejecting ||
    isDeliveryRejecting;

  useEffect(() => {
    const isSuccess =
      requestRejected ||
      contractRejected ||
      testDriveRejected ||
      deliveryRejected;

    if (isSuccess) {
      notification.showMessage("Đã từ chối", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contractRejected,
    navigation,
    requestRejected,
    testDriveRejected,
    deliveryRejected,
  ]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      const _data = { id, reason: data.reason };
      switch (type) {
        case "request":
          rejectRequest(_data);
          break;
        case "contract":
          rejectContract(_data);
          break;
        case "testDrive":
          rejectTestDrive(_data);
          break;
        case "delivery":
          rejectDelivery(_data);
          break;
        default:
          break;
      }
    },
    [id, rejectContract, rejectDelivery, rejectRequest, rejectTestDrive, type]
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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
          disabled={loading || Boolean(errors.reason)}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction textWhiteMedium={Boolean(errors.reason)}>
            Lưu
          </Text>
        </Button>
      ),
    });
  }, [
    errors.reason,
    handleBack,
    handleSave,
    handleSubmit,
    loading,
    navigation,
  ]);

  return (
    <BasePage loading={loading}>
      <View flex bg-surface padding-16 row>
        <Controller
          name="reason"
          defaultValue={null}
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Incubator.TextField
              autoFocus
              multiline
              placeholder='Nhập lý do từ chối "bắt buộc"'
              placeholderTextColor={Colors.textBlackLow}
              style={Typography.body1}
              error={error}
              isError={Boolean(error)}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
      </View>
    </BasePage>
  );
};

ReasonRejectEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
      type: PropTypes.string,
    }),
  }),
};

export default ReasonRejectEditor;
