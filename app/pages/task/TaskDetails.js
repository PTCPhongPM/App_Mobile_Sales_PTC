import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Toast } from "react-native-ui-lib/src/incubator";
import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";

import {
  useDeleteTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
} from "../../store/api/task";
import {
  ChevronRightSmall,
  Delete,
  Edit,
  RadioChecked,
  RadioUnChecked,
} from "../../configs/assets";

import { showDeleteAlert } from "../../helper/alert";
import { useNotification } from "../../providers/NotificationProvider";
import {
  checkTaskExpired,
  formatDate,
  formatTime,
  getCustomerName,
} from "../../helper/utils";
import gStyles from "../../configs/gStyles";

const TaskDetails = ({ navigation, route: { params } }) => {
  const { task } = params;
  const notification = useNotification();

  const { data, isFetching } = useGetTaskQuery({ id: task.id });

  const [updateTask, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateTaskMutation();

  const [deleteTask, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteTaskMutation();

  const taskDetails = useMemo(() => data || task, [data, task]);

  const loading = isFetching || isDeleting || isUpdating;

  const handleEditPressed = useCallback(
    () => navigation.navigate("TaskEditor", { task: taskDetails }),
    [taskDetails, navigation]
  );

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá lịch làm việc",
        "Bạn có chắc chắn muốn xoá lịch làm việc?",
        () => deleteTask({ id: taskDetails.id })
      ),
    [deleteTask, taskDetails.id]
  );

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const canHandleTask = useMemo(() => {
    if (taskDetails.sale) {
      // check sale is active
      return taskDetails.sale?.state === "active";
    } else {
      return true;
    }
  }, [taskDetails.sale]);

  useEffect(() => {
    if (canHandleTask) {
      navigation.setOptions({
        headerRight: () => (
          <View row>
            <Button
              link
              paddingH-8
              disabled={loading}
              onPress={handleEditPressed}
            >
              <Edit fill={Colors.surface} />
            </Button>
            <Button
              link
              paddingR-16
              paddingL-8
              disabled={loading}
              onPress={handleDelete}
            >
              <Delete fill={Colors.surface} />
            </Button>
          </View>
        ),
      });
    }
  }, [canHandleTask, handleDelete, handleEditPressed, loading, navigation]);

  const handleUpdateTask = useCallback(
    () =>
      updateTask({
        id: taskDetails.id,
        isDone: !taskDetails.isDone,
      }),
    [taskDetails, updateTask]
  );

  const handleCustomerPressed = useCallback(
    () =>
      navigation.navigate("CustomerDetails", {
        customer: taskDetails.sale?.customer,
      }),
    [navigation, taskDetails.sale?.customer]
  );

  return (
    <BasePage loading={loading}>
      <View paddingV-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        <View row paddingH-16 paddingV-12 top>
          <Button
            link
            marginR-8
            padding-6
            disabled={!canHandleTask}
            onPress={handleUpdateTask}
          >
            {taskDetails.isDone ? (
              <RadioChecked
                width={32}
                height={32}
                fill={canHandleTask ? Colors.primary900 : Colors.textBlackLow}
              />
            ) : (
              <RadioUnChecked
                width={32}
                height={32}
                fill={
                  canHandleTask ? Colors.textBlackHigh : Colors.textBlackLow
                }
              />
            )}
          </Button>
          <View flex>
            <Text>{taskDetails.content}</Text>
            <View row marginT-4>
              <Text body2>Thời gian: </Text>
              <Text
                body2
                textBlackMedium
                primary900={checkTaskExpired(
                  taskDetails.isDone,
                  taskDetails.date,
                  taskDetails.endingTime
                )}
              >
                {formatTime(taskDetails.startingTime)}-
                {formatTime(taskDetails.endingTime)},{" "}
                {formatDate(taskDetails.date)}
              </Text>
            </View>
            {taskDetails.sale && (
              <TouchableOpacity
                flex
                spread
                row
                centerV
                marginT-20
                onPress={handleCustomerPressed}
              >
                <View>
                  <Text body1 stateBlueDefault>
                    {getCustomerName(taskDetails.sale?.customer)}
                  </Text>
                  <Text body2 textBlackMedium>
                    Khách hàng
                  </Text>
                </View>
                <ChevronRightSmall
                  fill={Colors.stateBlueDefault}
                  width={32}
                  height={32}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </BasePage>
  );
};

TaskDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      task: PropTypes.object,
    }),
  }),
};

export default TaskDetails;
