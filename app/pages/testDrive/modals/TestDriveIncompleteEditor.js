import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { Button, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { useNotification } from "../../../providers/NotificationProvider";

import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import BottomWheelPicker from "../../../components/Picker/BottomWheelPicker";

import { IncompleteTestDriveReasons } from "../../../helper/constants";
import { arr2WheelItems } from "../../../helper/utils";

import gStyles from "../../../configs/gStyles";
import { useIncompleteTestDriveMutation } from "../../../store/api/testDrive";

const schema = yup.object().shape({
  incompleteReason: yup.string().nullable(true),
});

const TestDriveIncompleteEditor = ({ navigation, route: { params } }) => {
  const notification = useNotification();
  const { getValues, handleSubmit, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const [actionConfig, setActionConfig] = useState({});
  const [actionShown, setActionShown] = useState(false);

  const [incompleteTestDrive, { isLoading, isSuccess }] =
    useIncompleteTestDriveMutation();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleDismiss = useCallback(() => setActionShown(false), []);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleSave = useCallback(
    (data) => {
      incompleteTestDrive({
        ...data,
        id: params.testDrive.id,
      });
    },
    [params.testDrive.id, incompleteTestDrive]
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

  const handleChooseReason = useCallback(() => {
    setActionConfig({
      key: "incompleteReason",
      items: arr2WheelItems(IncompleteTestDriveReasons),
      onChange: (value) =>
        setValue("incompleteReason", value, { shouldValidate: true }),
      onCancel: () => setValue("incompleteReason", null),
    });

    setActionShown(true);
  }, [setValue]);

  return (
    <BasePage loading={isLoading}>
      <View
        bg-surface
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        <View row centerV>
          <InputLabel text="Lý do" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={getValues("incompleteReason")}
            onPress={handleChooseReason}
          />
        </View>
      </View>

      <BottomWheelPicker
        key={actionConfig.key}
        initialValue={getValues(actionConfig.key)}
        visible={actionShown}
        items={actionConfig.items}
        onChange={actionConfig.onChange}
        onCancel={actionConfig.onCancel}
        onDismiss={handleDismiss}
      />
    </BasePage>
  );
};

TestDriveIncompleteEditor.propTypes = {
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

export default TestDriveIncompleteEditor;
