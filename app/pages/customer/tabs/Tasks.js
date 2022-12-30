import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { RefreshControl, SectionList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import dayjs from "dayjs";

import TaskCard from "../../../components/Card/TaskCard";
import { useNotification } from "../../../providers/NotificationProvider";

import {
  checkSaleActive,
  checkTaskExpired,
  groupByKey,
} from "../../../helper/utils";

import {
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../../../store/api/task";
import Fab from "../../../components/Button/Fab";

const Tasks = ({ customer , isNotMe}) => {
  const navigation = useNavigation();
  const notification = useNotification();

  const [doneTaskShown, setDoneTaskShown] = useState(false);

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetTasksQuery({
    saleId: customer.sales[0].id,
  });

  const [updateTask, { isLoading: isUpdating, isSuccess }] =
    useUpdateTaskMutation();

  const handleCreateTask = useCallback(
    () =>
      navigation.navigate("TaskEditor", {
        customer,
      }),
    [customer, navigation]
  );

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleUpdateTask = useCallback(
    (task) =>
      updateTask({
        ...task,
        isDone: !task.isDone,
      }),
    [updateTask]
  );

  const handleTaskPress = useCallback(
    (task) => navigation.navigate("TaskDetails", { task }),
    [navigation]
  );

  const toggleDoneTaskShown = useCallback(
    () => setDoneTaskShown((pre) => !pre),
    []
  );

  const list = useMemo(() => {
    const arr = [];

    data.forEach((element) => {
      const time = dayjs(element.date).format("MM/YYYY");

      if (doneTaskShown) {
        arr.push({
          ...element,
          time,
        });
      } else {
        if (!element.isDone) {
          arr.push({
            ...element,
            time,
          });
        }
      }
    });

    return groupByKey(arr, "time", "desc");
  }, [data, doneTaskShown]);

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  return (
    <View bg-background flex>
      <View bg-surface>
        <SectionList
          sections={list || []}
          refreshControl={
            <RefreshControl
              colors={[Colors.primary900]}
              tintColor={Colors.primary900}
              onRefresh={refetch}
              refreshing={isFetching || isUpdating}
            />
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard
              checked={item.isDone}
              title={item.content}
              checkDisabled={item.sale.state !== "active"}
              expired={checkTaskExpired(
                item.isDone,
                item.date,
                item.endingTime
              )}
              time={dayjs(item.date).format("DD/MM")}
              onCheck={() => handleUpdateTask(item)}
              onPress={() => handleTaskPress(item)}
            />
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View paddingH-16 paddingT-16 bg-surface>
              <Text subtitle1 primary900>
                Tháng {title}
              </Text>
            </View>
          )}
          ListFooterComponent={() => {
            if (isFetching || !data || !data.length) return null;
            return (
              <Button paddingV-16 link onPress={toggleDoneTaskShown}>
                <Text subtitle2 primary900>
                  {doneTaskShown ? "Ẩn" : "Hiện"} việc đã hoàn thành
                </Text>
              </Button>
            );
          }}
        />
      </View>
      {isSaleActive &&  !isNotMe && (
        <Fab onPress={handleCreateTask} color={Colors.primary900} />
      )}
    </View>
  );
};

Tasks.propTypes = {
  customer: PropTypes.object,
};

export default Tasks;
