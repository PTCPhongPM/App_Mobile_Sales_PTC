import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
  Button,
  Colors,
  DateTimePicker,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import BasePage from "../../../components/Base/BasePage";
import InputLabel from "../../../components/Input/InputLabel";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";
import { Calendar, Time } from "../../../configs/assets";
import { getCustomerName, toDate, toISO } from "../../../helper/utils";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../../store/api/task";
import { useNotification } from "../../../providers/NotificationProvider";

const formatTime = (time) => dayjs(time).format("HH:mm");

const taskSchema = yup.object().shape({
  date: yup.string().required(),
  startingTime: yup.string().required(),
  endingTime: yup.string().required(),
  content: yup.string().required(),
});

const TaskEditor = ({ navigation, route }) => {
  const { customer, task } = route.params;
  const notification = useNotification();

  const defaultValues = useMemo(() => {
    if (!task) return {};
    return {
      ...task,
      startingTime: dayjs(task.startingTime, "HH:mm").toDate(),
      endingTime: dayjs(task.endingTime, "HH:mm").toDate(),
    };
  }, [task]);

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues,
  });

  const startingTime = watch("startingTime");
  const endingTime = watch("endingTime");

  const [createTask, { isLoading, isSuccess }] = useCreateTaskMutation();

  const [updateTask, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateTaskMutation();

  const loading = isLoading || isUpdating;

  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      notification.showMessage("Thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isUpdateSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      if (task && task.id) {
        updateTask({
          ...data,
          id: task.id,
          date: toISO(data.date),
          startingTime: formatTime(data.startingTime),
          endingTime: formatTime(data.endingTime),
        });
      } else {
        createTask({
          ...data,
          date: toISO(data.date),
          startingTime: formatTime(data.startingTime),
          endingTime: formatTime(data.endingTime),
          saleId: customer?.sales[0].id,
        });
      }
    },
    [createTask, customer?.sales, task, updateTask]
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
          disabled={loading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, loading, navigation]);

  return (
    <BasePage loading={loading}>
      <View
        bg-white
        padding-16
        paddingT-8
        style={[gStyles.borderV, gStyles.shadow]}
      >
        {(task?.sale || customer) && (
          <TextRow
            capitalize
            left="Khách hàng"
            leftRequired
            rightDisabled
            right={getCustomerName(task ? task?.sale?.customer : customer)}
          />
        )}

        <View row centerV marginT-10>
          <InputLabel text="Nội dung" required />
          <View flex-2>
            <Controller
              name="content"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập nội dung"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Ngày hẹn" required />
          <View flex-2>
            <Controller
              name="date"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="date"
                  title="Ngày hẹn"
                  value={toDate(value)}
                  dateFormat="DD/MM/YYYY"
                  minimumDate={new Date()}
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn ngày"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={
                        <Calendar fill={Colors.textBlackHigh} />
                      }
                    />
                  )}
                />
              )}
            />
          </View>
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Bắt đầu từ" required />
          <View flex-2>
            <Controller
              name="startingTime"
              defaultValue={null}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="time"
                  title="Bắt đầu từ"
                  value={value}
                  maximumDate={endingTime}
                  timeFormat="HH:mm"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn giờ"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={<Time fill={Colors.textBlackHigh} />}
                    />
                  )}
                />
              )}
            />
          </View>
        </View>

        <View row centerV marginT-10>
          <InputLabel text="Kết thúc" required />
          <View flex-2>
            <Controller
              name="endingTime"
              defaultValue={null}
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <DateTimePicker
                  mode="time"
                  title="Kết thúc"
                  value={value}
                  minimumDate={startingTime}
                  timeFormat="HH:mm"
                  onChange={onChange}
                  renderInput={({ value }) => (
                    <TextInput
                      placeholder="Chọn giờ"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      trailingAccessory={<Time fill={Colors.textBlackHigh} />}
                    />
                  )}
                />
              )}
            />
          </View>
        </View>
      </View>
    </BasePage>
  );
};

TaskEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      task: PropTypes.object,
    }),
  }),
};

export default TaskEditor;
