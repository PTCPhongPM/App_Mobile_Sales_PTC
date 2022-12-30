import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo } from "react";

import { ImageBackground } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";

import {
  Assets,
  Avatar,
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";
import { ArrowBack, Password, RequestPage, Star } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

import {
  useGetAccountQuery,
  useUpdateAccountMutation,
} from "../../store/api/account";

import { useUploadFileMutation } from "../../store/api/file";
import { getAccount, setAccount } from "../../store/slices/account";

const Profile = ({ navigation, route: { params } }) => {
  const dispatch = useDispatch();
  const account = useSelector(getAccount);

  const { data, isLoading } = useGetAccountQuery();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [updateAccount, { isLoading: isUpdating }] = useUpdateAccountMutation();

  const accountDetails = useMemo(() => data || account, [account, data]);

  const loading = isLoading || isUploading || isUpdating;

  const handleBack = useCallback(() => {
    navigation.goBack();
    params.onAccountChanged(accountDetails);
  }, [accountDetails, navigation, params]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-4 disabled={loading} onPress={handleBack}>
          <ArrowBack fill="#ffffff" />
        </Button>
      ),
    });
  }, [handleBack, loading, navigation]);

  const list = useMemo(
    () => [
      {
        icon: Password,
        label: "Đổi mật khẩu",
        onPress: () =>
          navigation.navigate("ChangePassword", { isLoggedIn: true }),
      },
      {
        icon: Star,
        label: "Thành tích",
        onPress: () => {},
      },
      {
        icon: RequestPage,
        label: "Thu nhập",
        onPress: () => {},
      },
    ],
    [navigation]
  );

  const handleChoosePhoto = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      async (response) => {
        if (response.didCancel) return;

        const fileData = await uploadFile({
          file: response.assets[0],
          scope: "avatar",
        }).unwrap();

        const accountUpdated = await updateAccount({
          id: accountDetails.id,
          avatarId: fileData.id,
        }).unwrap();

        dispatch(
          setAccount({
            account: accountUpdated,
          })
        );
      }
    );
  }, [accountDetails.id, dispatch, updateAccount, uploadFile]);

  return (
    <BasePage loading={loading}>
      <ImageBackground source={Assets.images.background.dashboardBig}>
        <View paddingV-24 center>
          <Avatar
            source={{ uri: accountDetails.avatar?.url }}
            size={64}
            resizeMode="cover"
            name={accountDetails.name}
          />

          <Button link paddingV-8 onPress={handleChoosePhoto}>
            <Text button stateBlueDefault>
              Tải ảnh lên
            </Text>
          </Button>
          <Text marginT-8 subtitle1>
            {accountDetails.name}
          </Text>
          <Text body2>{accountDetails.role.name}</Text>
          <Text body2>{accountDetails.branch.name}</Text>
        </View>
      </ImageBackground>

      <View marginT-16>
        {list.map((e) => (
          <TouchableOpacity
            key={e.label}
            style={gStyles.borderB}
            onPress={e.onPress}
          >
            <View bg-surface paddingH-16 paddingV-8 row centerV>
              <e.icon fill={Colors.textBlackHigh} width={28} height={28} />
              <Text marginL-16>{e.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </BasePage>
  );
};

Profile.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onAccountChanged: PropTypes.func,
    }),
  }),
};

export default Profile;
