import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";

import { Button, Text, View } from "react-native-ui-lib";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Toast } from "react-native-ui-lib/src/incubator";
import { useNotification } from "../../../providers/NotificationProvider";

import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import TextInput from "../../../components/Input/TextInput";

import gStyles from "../../../configs/gStyles";
import { useCompleteTestDriveMutation } from "../../../store/api/testDrive";

const schema = yup.object().shape({ review: yup.string().nullable(true) });

const TestDriveCompleteEditor = ({ navigation, route: { params } }) => {
  const notification = useNotification();
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const [completeTestDrive, { isLoading, isSuccess }] =
    useCompleteTestDriveMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleSave = useCallback(
    (data) => {
      completeTestDrive({
        review: data.review,
        id: params.testDrive?.id,
      });
    },
    [params.testDrive?.id, completeTestDrive]
  );

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
          disabled={isLoading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, isLoading, navigation]);

  return (
    <BasePage loading={isLoading}>
      <View
        bg-surface
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <View row centerV>
          <InputLabel text="Ý kiến khách hàng" />
          <View flex-2>
            <Controller
              name="review"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Viết ý kiến"
                  onChangeText={onChange}
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                />
              )}
            />
          </View>
        </View>
      </View>
    </BasePage>
  );
};

TestDriveCompleteEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      testDrive: PropTypes.shape({
        id: PropTypes.number,
      }),
    }),
  }),
};

export default TestDriveCompleteEditor;
