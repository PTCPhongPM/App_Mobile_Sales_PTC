import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { FlatList } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { Button, Colors, Text, View } from "react-native-ui-lib";

import { Toast } from "react-native-ui-lib/src/incubator";
import BasePage from "../../../components/Base/BasePage";
import DocumentItem from "../../../components/DocumentItem";
import Headline from "../../../components/Header/Headline";

import { Upload } from "../../../configs/assets";
import { useNotification } from "../../../providers/NotificationProvider";

import gStyles from "../../../configs/gStyles";

import {
  useAddFilesMutation,
  useCompleteDeliveryMutation,
} from "../../../store/api/delivery";
import { useUploadFileMutation } from "../../../store/api/file";

const LimitPhoto = 4;

const DeliveryCompleteEditor = ({ navigation, route }) => {
  const notification = useNotification();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [uploadFile] = useUploadFileMutation();
  const [addFiles] = useAddFilesMutation();
  const [completeDelivery, { isSuccess }] = useCompleteDeliveryMutation();

  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    // upload files

    try {
      const fileArr = [];
      for (const file of files) {
        const res = await uploadFile({ file, scope: "delivery" }).unwrap();

        fileArr.push({
          fileId: res.id,
          type: "delivery",
        });
      }

      await addFiles({
        id: route.params.delivery.id,
        files: fileArr,
      }).unwrap();

      await completeDelivery({
        id: route.params.delivery.id,
      }).unwrap();
    } catch (error) {
      setIsLoading(false);
    }

    setIsLoading(false);
  }, [addFiles, completeDelivery, files, route.params.delivery.id, uploadFile]);

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
          disabled={isLoading || !files.length}
          onPress={handleSave}
        >
          <Text headerAction textWhiteMedium={!files.length}>
            Lưu
          </Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, navigation, files.length, isLoading]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <DocumentItem
        bg-surface
        style={gStyles.borderB}
        file={item}
        onDelete={() => {
          setFiles((pre) => {
            const arr = [...pre];
            arr.splice(index, 1);

            setFiles(arr);
          });
        }}
      />
    ),
    []
  );

  const handleChoosePhoto = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
        selectionLimit: LimitPhoto - files.length,
      },
      (response) => {
        if (response.didCancel) return;

        setFiles((pre) => [...pre, ...response.assets]);
      }
    );
  }, [files.length]);

  return (
    <BasePage loading={isLoading} hasScroll={false}>
      <Headline
        label={`Hình ảnh giao xe (${files.length}/${LimitPhoto})`}
        onPress={files.length === LimitPhoto ? undefined : handleChoosePhoto}
      />

      <FlatList
        keyExtractor={(item) => item.fileName}
        extraData={files}
        data={files}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View paddingV-16 bg-surface center>
            <Text body2>Bạn chưa có hình ảnh nào</Text>
            <Button
              br10
              marginT-8
              outline
              outlineColor={Colors.primary900}
              onPress={handleChoosePhoto}
            >
              <Upload fill={Colors.primary900} width={20} height={20} />
              <Text body2 primary900>
                Tải ảnh lên
              </Text>
            </Button>
          </View>
        )}
      />
    </BasePage>
  );
};

DeliveryCompleteEditor.propTypes = {
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

export default DeliveryCompleteEditor;
