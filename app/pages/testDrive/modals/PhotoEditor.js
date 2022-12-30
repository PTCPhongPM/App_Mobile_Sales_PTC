import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { launchImageLibrary } from "react-native-image-picker";
import { Button, Text, View } from "react-native-ui-lib";

import BasePage from "../../../components/Base/BasePage";
import DocumentItem from "../../../components/DocumentItem";
import Headline from "../../../components/Header/Headline";
import UploadCard from "../../../components/Card/UploadCard";

import gStyles from "../../../configs/gStyles";

import {
  useRemoveFileMutation,
  useUploadFileMutation,
} from "../../../store/api/file";
import { useUpdateTestDriveFileMutation } from "../../../store/api/testDrive";

const schema = yup.object().shape({
  identityCardFront: yup.object().required(),
  identityCardBack: yup.object().required(),
  driveLicenseFront: yup.object().required(),
  driveLicenseBack: yup.object().required(),
  disclaimers: yup.array(),
  other: yup.array(),
});

const PhotoEditor = ({ navigation, route: { params } }) => {
  const { customer, files, onChange, testDrive, viewOnly } = params;

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [removeList, setRemoveList] = useState([]);

  const [uploadFile, { isLoading }] = useUploadFileMutation();
  const [removeFile, { isLoading: isRemoving }] = useRemoveFileMutation();
  const [updateTestDriveFile, { isLoading: isUpdating }] =
    useUpdateTestDriveFileMutation();

  const loading = isLoading || isRemoving || isUpdating;

  const {
    formState: { errors },
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      disclaimers: [],
      other: [],
      ...files,
    },
  });

  const watchAll = watch();

  const handleSave = useCallback(async () => {
    if (removeList.length) {
      for (const file of removeList) {
        await removeFile({ id: file.id }).unwrap();
      }
    }

    let files = compact(Object.values(watchAll).flat());

    const resultObject = {};
    const changedFiles = [];

    for (const file of files) {
      const res = file.url
        ? file
        : {
            ...(await uploadFile({ file, scope: customer.id }).unwrap()),
            fileType: file.fileType,
            isNew: true,
          };

      if (res.isNew) {
        changedFiles.push({
          fileId: res.id,
          type: res.fileType,
        });
      }

      if (Array.isArray(watchAll[file.fileType])) {
        if (!resultObject[file.fileType]) resultObject[file.fileType] = [];
        resultObject[file.fileType].push(res);
      } else {
        resultObject[file.fileType] = res;
      }
    }

    if (testDrive?.id) {
      await updateTestDriveFile({
        id: testDrive.id,
        files: changedFiles,
      }).unwrap();
    }

    onChange?.(resultObject);

    navigation.goBack();
  }, [
    customer?.id,
    navigation,
    onChange,
    removeFile,
    removeList,
    testDrive?.id,
    updateTestDriveFile,
    uploadFile,
    watchAll,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 disabled={loading} onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: viewOnly
        ? null
        : () => (
            <Button
              link
              paddingH-16
              disabled={loading}
              onPress={handleSubmit(handleSave)}
            >
              <Text headerAction>Lưu</Text>
            </Button>
          ),
    });
  }, [handleBack, handleSave, handleSubmit, loading, navigation, viewOnly]);

  const deleteObject = useCallback(
    (key) => {
      if (watchAll[key].id) {
        setRemoveList([...removeList, watchAll[key]]);
      }
      setValue(key, null, { shouldValidate: true });
    },
    [removeList, setValue, watchAll]
  );

  const deleteRow = useCallback(
    (key, deleteIndex) => {
      const item = watchAll[key][deleteIndex];
      if (item.id) {
        setRemoveList((pre) => [
          ...pre,
          {
            ...item,
            fileType: key,
          },
        ]);
      }

      setValue(key, [
        ...watchAll[key].filter((_, index) => index !== deleteIndex),
      ]);
    },
    [setValue, watchAll]
  );

  const handleChoosePhoto = useCallback(
    (key, type) => {
      launchImageLibrary(
        {
          mediaType: "photo",
          quality: 1,
        },
        (response) => {
          if (response.didCancel) return;

          if (type === "array") {
            setValue(
              key,
              [
                ...getValues(key),
                {
                  ...response.assets[0],
                  fileType: key,
                },
              ],
              { shouldValidate: true }
            );
          } else {
            setValue(
              key,
              {
                ...response.assets[0],
                fileType: key,
              },
              { shouldValidate: true }
            );
          }
        }
      );
    },
    [getValues, setValue]
  );

  return (
    <BasePage loading={loading}>
      <View paddingT-8>
        <View paddingH-16 paddingV-8 row bg-primary50>
          <Text subtitle1>CMND/CCCD</Text>
          <Text subtitle1 stateRedDefault>
            *
          </Text>
        </View>

        <View row bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          <View flex padding-16 center>
            <Text body2 primary900={Boolean(errors.identityCardFront)}>
              Mặt trước
            </Text>
            <UploadCard
              data={watchAll.identityCardFront}
              onPress={() => handleChoosePhoto("identityCardFront")}
              onDelete={() => deleteObject("identityCardFront")}
              viewOnly={viewOnly}
            />
          </View>
          <View width={1} bg-divider />

          <View flex padding-16 center>
            <Text body2 primary900={Boolean(errors.identityCardBack)}>
              Mặt sau
            </Text>
            <UploadCard
              data={watchAll.identityCardBack}
              onPress={() => handleChoosePhoto("identityCardBack")}
              onDelete={() => deleteObject("identityCardBack")}
              viewOnly={viewOnly}
            />
          </View>
        </View>

        <View paddingH-16 paddingV-8 row bg-primary50 marginT-12>
          <Text subtitle1>Bằng lái</Text>
          <Text subtitle1 stateRedDefault>
            *
          </Text>
        </View>

        <View row bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          <View flex padding-16 center>
            <Text body2 primary900={Boolean(errors.driveLicenseFront)}>
              Mặt trước
            </Text>
            <UploadCard
              data={watchAll.driveLicenseFront}
              onPress={() => handleChoosePhoto("driveLicenseFront")}
              onDelete={() => deleteObject("driveLicenseFront")}
              viewOnly={viewOnly}
            />
          </View>
          <View width={1} bg-divider />

          <View flex padding-16 center>
            <Text body2 primary900={Boolean(errors.driveLicenseBack)}>
              Mặt sau
            </Text>
            <UploadCard
              data={watchAll.driveLicenseBack}
              onPress={() => handleChoosePhoto("driveLicenseBack")}
              onDelete={() => deleteObject("driveLicenseBack")}
              viewOnly={viewOnly}
            />
          </View>
        </View>

        <Headline
          label="Giấy miễn trừ trách nhiệm"
          onPress={
            viewOnly ? null : () => handleChoosePhoto("disclaimers", "array")
          }
        />

        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {watchAll.disclaimers.map((e, i) => (
            <DocumentItem
              key={e.uri || e.url}
              style={[gStyles.borderB, i === 0 && gStyles.borderT]}
              file={e}
              onDelete={() => deleteRow("disclaimers", i)}
            />
          ))}
        </View>

        <Headline
          label="Khác"
          onPress={viewOnly ? null : () => handleChoosePhoto("other", "array")}
        />

        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {watchAll.other.map((e, i) => (
            <DocumentItem
              key={e.uri || e.url}
              style={[gStyles.borderB, i === 0 && gStyles.borderT]}
              file={e}
              onDelete={() => deleteRow("other", i)}
            />
          ))}
        </View>
      </View>
    </BasePage>
  );
};

PhotoEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      files: PropTypes.object,
      onChange: PropTypes.func,
      testDrive: PropTypes.object,
      viewOnly: PropTypes.bool,
    }),
  }),
};

export default PhotoEditor;
