import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import RNFetchBlob from "react-native-blob-util";

import { useDispatch } from "react-redux";

import { ImageBackground } from "react-native";
import { Assets, Colors, Image, Text, View } from "react-native-ui-lib";

import { Language, SolidPhone } from "../../configs/assets";
import {
  getAccessToken,
  isAuthTokenValid,
  saveAccessToken,
} from "../../helper/auth";
import { setAccount } from "../../store/slices/account";

import ptcApi, { setToken } from "../../store/api";

import { useRefreshTokenMutation } from "../../store/api/auth";

import gStyles from "../../configs/gStyles";
import { exportedDir } from "../../helper/file";

const Splash = ({ navigation }) => {
  const [refreshToken] = useRefreshTokenMutation();

  const dispatch = useDispatch();
  const handleToken = useCallback(
    async (accessToken) => {
      try {
        setToken(accessToken);

        const data = await refreshToken().unwrap();

        dispatch(
          setAccount({ accessToken: data.token, account: data.account })
        );

        saveAccessToken(data.token);

        navigation.replace("MainStack");
      } catch {
        navigation.replace("AuthStack");
        dispatch(ptcApi.util.resetApiState());
      }
    },
    [dispatch, navigation, refreshToken]
  );

  const checkAccessToken = useCallback(async () => {
    const accessToken = await getAccessToken();

    if (isAuthTokenValid(accessToken)) {
      handleToken(accessToken);
    } else {
      navigation.replace("AuthStack");
    }
  }, [handleToken, navigation]);

  useEffect(() => {
    checkAccessToken();
  }, [checkAccessToken]);

  useEffect(() => {
    RNFetchBlob.fs.unlink(exportedDir).catch(() => {});
  }, []);

  return (
    <ImageBackground
      source={Assets.images.background.splash}
      style={gStyles.flex1}
    >
      <View flex centerH spread>
        <View marginT-40>
          <Image source={Assets.images.brand.logo} width={200} height={100} />
        </View>
        <View row marginB-42>
          <View row centerV marginR-30>
            <SolidPhone fill={Colors.white} width={16} height={16} />
            <Text caption white marginL-4>
              1800.6610
            </Text>
          </View>
          <View row centerV>
            <Language fill={Colors.white} width={16} height={16} />
            <Text caption white marginL-4>
              https://phattien.com
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

Splash.propTypes = {
  navigation: PropTypes.shape({
    replace: PropTypes.func,
  }),
};

export default Splash;
