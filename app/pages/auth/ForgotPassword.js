import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { ActivityIndicator } from "react-native";
import { Assets, Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useNotification } from "../../providers/NotificationProvider";

import AuthBasePage from "../../components/Base/AuthBasePage";
import AuthTextInput from "../../components/Input/AuthTextInput";

import { Language, SolidPhone } from "../../configs/assets";
import { useResetPasswordMutation } from "../../store/api/auth";

const schema = yup.object().shape({
  email: yup.string().email("Email không đúng!").required("Bắt buộc"),
});

const ForgotPassword = ({ navigation }) => {
  const notification = useNotification();

  const [resetPassword, { isLoading, isSuccess }] = useResetPasswordMutation();
  useEffect(() => {
    if (isSuccess) {
      notification.showMessage(
        "Kiểm tra email để đặt lại mật khẩu",
        Toast.presets.SUCCESS
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await resetPassword(data).unwrap();

    navigation.replace("Login");
  };

  return (
    <AuthBasePage>
      <View flex paddingH-16 bg-white spread>
        <View>
          <View marginT-40 marginB-20 center>
            <Image source={Assets.images.brand.logo} width={200} height={100} />
          </View>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextInput
                keyboardType="email-address"
                label="Email"
                placeholder="Nhập email"
                enableErrors
                isError={Boolean(errors?.email)}
                helper={errors?.email ? errors?.email.message : ""}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          <Button
            bg-primary900
            br30
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text button textWhiteHigh>
                Gửi yêu cầu
              </Text>
            )}
          </Button>
        </View>
        <View row marginB-42 center>
          <View row centerV marginR-30>
            <SolidPhone fill={Colors.textBlackHigh} width={16} height={16} />
            <Text caption marginL-4>
              1800.6610
            </Text>
          </View>
          <View row centerV>
            <Language fill={Colors.textBlackHigh} width={16} height={16} />
            <Text caption marginL-4>
              https://phattien.com
            </Text>
          </View>
        </View>
      </View>
    </AuthBasePage>
  );
};

ForgotPassword.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func,
  }),
};

export default ForgotPassword;
