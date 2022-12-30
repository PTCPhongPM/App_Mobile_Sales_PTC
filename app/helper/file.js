// eslint-disable-next-line react-native/split-platform-components
import { Alert, PermissionsAndroid, Platform } from "react-native";
import RNFetchBlob from "react-native-blob-util";

import apiConfig from "../configs/api";
import { getAccessToken } from "./auth";

const {
  dirs: { DocumentDir },
} = RNFetchBlob.fs;

const isIOS = Platform.OS === "ios";

export const exportedDir = Platform.select({
  ios: `${DocumentDir}/AutosaleFiles`,
  android: `${DocumentDir}/AutosaleFiles`,
});

const checkPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      Alert.alert(
        "Permission Denied!",
        "You need to give storage permission to download the file"
      );
      return false;
    }
  } catch (err) {
    return false;
  }
};

// const getConfig = (path, title) =>
//   Platform.select({
//     ios: {
//       path,
//     },
//     android: {
//       path,
//       addAndroidDownloads: {
//         useDownloadManager: true,
//         title: title,
//         description: "Đang tải ...",
//         path,
//         mime: "application/pdf",
//         mediaScannable: true,
//         notification: true,
//       },
//     },
//   });

/**
 * Download PDF
 * @param {string} endpoint
 * @param {string} type
 * @param {object} data
 * @param {string} data.code
 * @param {number} data.id
 */
export const downloadPDF = async (endpoint, type, data) => {
  if (!isIOS) {
    const granted = await checkPermission();
    if (!granted) return;
  }

  const accessToken = await getAccessToken();

  const fileName = `${type}_${data.code || data.id}.pdf`;
  const filePath = `${exportedDir}/${fileName}`;
  // const config = getConfig(fPath, `${fileName}`);

  const res = await RNFetchBlob.config({
    overwrite: true,
    path: filePath,
  }).fetch(
    "POST",
    `${apiConfig.baseURL}${endpoint}`,
    {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    JSON.stringify(data)
  );

  const status = res.info().status;

  if (status == 200) {
    isIOS
      ? RNFetchBlob.ios.openDocument(filePath)
      : RNFetchBlob.android.actionViewIntent(filePath, "application/pdf");
  } else {
    Alert.alert("Có lỗi xảy ra", "Vui lòng kiểm tra lại", [
      {
        text: "OK",
        style: "destructive",
      },
    ]);
  }
};
