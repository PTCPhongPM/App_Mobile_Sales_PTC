import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch } from "react-redux";

import { ActivityIndicator } from "react-native";
import { Assets, Button, Colors, Image, Text, View } from "react-native-ui-lib";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import AuthTextInput from "../../components/Input/AuthTextInput";

import { saveAccessToken } from "../../helper/auth";
import { setAccount } from "../../store/slices/account";
import { useLoginMutation } from "../../store/api/auth";

import AuthBasePage from "../../components/Base/AuthBasePage";
import {
  Language,
  SolidPhone,
  Visibility,
  VisibilityOff,
} from "../../configs/assets";

const schema = yup.object().shape({
  code: yup.string().required("Bắt buộc"),
  password: yup.string().required("Bắt buộc"),
});

const Login = ({ navigation }) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      // code: "head-sale",
      code: "director",
      password: "123456",
    },
  });

  const [login, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = useCallback(() => setShowPassword((pre) => !pre), []);

  const onSubmit = useCallback(
    async (data) => {
      const _data = await login(data).unwrap();

      dispatch(
        setAccount({
          accessToken: _data.token,
          account: _data.account,
        })
      );
      saveAccessToken(_data.token);
      navigation.replace("MainStack");
    },
    [dispatch, login, navigation]
  );

  const handleForgotPassword = useCallback(
    () => navigation.navigate("ForgotPassword"),
    [navigation]
  );

  return (
    <AuthBasePage>
      <View flex paddingH-16 bg-white spread>
        <View>
          <View marginT-40 marginB-20 center>
            <Image source={Assets.images.brand.logo} width={200} height={100} />
          </View>
          <Controller
            control={control}
            name="code"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextInput
                autoCapitalize="none"
                placeholder="Nhập tên đăng nhập"
                label="Tên đăng nhập"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                enableErrors
                isError={Boolean(errors?.code)}
                helper={errors?.code ? errors.code.message : ""}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            defaultValue=""
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthTextInput
                autoCapitalize="none"
                placeholder="Nhập mật khẩu"
                label="Mật khẩu"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                enableErrors
                isError={Boolean(errors?.password)}
                secureTextEntry={!showPassword}
                helper={errors?.password ? errors?.password.message : ""}
                trailingAccessory={
                  <Button round bg-transparent onPress={togglePassword}>
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

          <Button
            br30
            bg-primary900
            disabled={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text button textWhiteHigh>
                Đăng nhập
              </Text>
            )}
          </Button>
          <Button
            link
            primary900
            marginT-8
            disabled={isLoading}
            label="Quên mật khẩu?"
            onPress={handleForgotPassword}
          />
        </View>
        <View>
          <View row center paddingH-40 marginB-32>
            <Image source={Assets.images.brand.honda} width={100} height={56} />
            <Image
              source={Assets.images.brand.toyota}
              width={100}
              height={56}
            />
            <Image
              source={Assets.images.brand.mitsubishi}
              width={64}
              height={64}
            />
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
      </View>
    </AuthBasePage>
  );
};

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    replace: PropTypes.func,
  }),
};

export default Login;
