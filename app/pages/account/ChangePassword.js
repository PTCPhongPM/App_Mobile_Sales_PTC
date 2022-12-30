import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { ActivityIndicator } from "react-native";
import { Assets, Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";
import { useDispatch } from "react-redux";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import BasePage from "../../components/Base/BasePage";
import AuthTextInput from "../../components/Input/AuthTextInput";

import {
  Language,
  SolidPhone,
  Visibility,
  VisibilityOff,
} from "../../configs/assets";
import { useNotification } from "../../providers/NotificationProvider";
import ptcApi from "../../store/api";
import { useUpdatePasswordMutation } from "../../store/api/account";

const schema = yup.object().shape({
  newPassword: yup.string().required("Bắt buộc"),
  passwordConfirmation: yup
    .string()
    .required("Bắt buộc")
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp"),
});

const loggedInSchema = yup.object().shape({
  currentPassword: yup.string().required("Bắt buộc"),
  newPassword: yup.string().required("Bắt buộc"),
  passwordConfirmation: yup
    .string()
    .required("Bắt buộc")
    .oneOf([yup.ref("newPassword"), null], "Mật khẩu không khớp"),
});

const ChangePassword = ({ navigation, route: { params } }) => {
  const notification = useNotification();
  const dispatch = useDispatch();

  const { isLoggedIn } = params;

  const [updatePassword, { isLoading, isSuccess }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    navigation.setOptions({
      title: isLoggedIn ? "Đổi mật khẩu" : "Nhập mật khẩu mới",
    });
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage(
        "Đổi mật khẩu thành công",
        Toast.presets.SUCCESS
      );

      dispatch(ptcApi.util.resetApiState());

      navigation.replace("AuthStack", { screen: "Login" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isLoggedIn, isSuccess, navigation]);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const toggleShowPassword = useCallback(
    () => setShowPassword((pre) => !pre),
    []
  );
  const toggleShowNewPassword = useCallback(
    () => setNewShowPassword((pre) => !pre),
    []
  );

  const toggleShowPasswordConfirmation = useCallback(
    () => setShowPasswordConfirmation((pre) => !pre),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isLoggedIn ? loggedInSchema : schema),
  });

  const onSubmit = (data) => updatePassword(data);

  return (
    <BasePage>
      <View flex paddingH-16 paddingT-16 bg-surface spread>
        <View>
          {isLoggedIn ? (
            <Controller
              control={control}
              name="currentPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <AuthTextInput
                  label="Mật khẩu hiện tại"
                  placeholder="Nhập mật khẩu hiện tại"
                  enableErrors
                  isError={Boolean(errors.currentPassword)}
                  helper={errors.currentPassword?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  secureTextEntry={!showPassword}
                  trailingAccessory={
                    <Button round bg-transparent onPress={toggleShowPassword}>
                      {showPassword ? (
                        <VisibilityOff fill={Colors.textBlackHigh} />
                      ) : (
                        <Visibility fill={Colors.textBlackHigh} />
                      )}
                    </Button>
                  }
                />
              )}
            />
          ) : (
            <View marginT-24 marginB-44 center>
              <Image
                source={Assets.images.brand.logo}
                width={200}
                height={100}
              />
            </View>
          )}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextInput
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu"
                enableErrors
                isError={Boolean(errors.newPassword)}
                helper={errors.newPassword?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showNewPassword}
                trailingAccessory={
                  <Button round bg-transparent onPress={toggleShowNewPassword}>
                    {showNewPassword ? (
                      <VisibilityOff fill={Colors.textBlackHigh} />
                    ) : (
                      <Visibility fill={Colors.textBlackHigh} />
                    )}
                  </Button>
                }
              />
            )}
          />
          <Controller
            control={control}
            name="passwordConfirmation"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextInput
                label="Nhập lại mật khẩu mới"
                placeholder="Nhập mật khẩu"
                enableErrors
                isError={Boolean(errors.passwordConfirmation)}
                helper={errors.passwordConfirmation?.message}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPasswordConfirmation}
                trailingAccessory={
                  <Button
                    round
                    bg-transparent
                    onPress={toggleShowPasswordConfirmation}
                  >
                    {showPasswordConfirmation ? (
                      <VisibilityOff fill={Colors.textBlackHigh} />
                    ) : (
                      <Visibility fill={Colors.textBlackHigh} />
                    )}
                  </Button>
                }
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
                Đổi mật khẩu
              </Text>
            )}
          </Button>
        </View>

        {!isLoggedIn && (
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
        )}
      </View>
    </BasePage>
  );
};

ChangePassword.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    replace: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      isLoggedIn: PropTypes.bool,
    }),
  }),
};

export default ChangePassword;
