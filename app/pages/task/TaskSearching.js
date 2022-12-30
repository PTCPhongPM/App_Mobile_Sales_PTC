import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";

import { Close } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

import TaskCard from "../../components/Card/TaskCard";
import {
  checkTaskExpired,
  formatTime,
  getCustomerName,
  removeAccents,
} from "../../helper/utils";
import { useGetTasksQuery, useUpdateTaskMutation } from "../../store/api/task";

const TaskSearching = ({ navigation }) => {
  const [filter, setFilter] = useState("");

  const { data = [], isFetching, refetch } = useGetTasksQuery();
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const loading = isFetching || isLoading;

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => (
        <Incubator.TextField
          autoFocus
          placeholder="Tìm kiếm"
          selectionColor={Colors.surface}
          style={[gStyles.search, { color: Colors.surface }]}
          placeholderTextColor={Colors.textWhiteMedium}
          value={filter}
          onChangeText={setFilter}
        />
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          disabled={!filter}
          onPress={() => setFilter("")}
        >
          <Close fill={filter ? Colors.surface : Colors.textWhiteMedium} />
        </Button>
      ),
    });
  }, [filter, navigation]);

  const handleUpdateTask = useCallback(
    (task) =>
      updateTask({
        ...task,
        isDone: !task.isDone,
      }),
    [updateTask]
  );

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());

    return data.filter((e) =>
      removeAccents(getCustomerName(e.customer).toLowerCase()).includes(_filter)
    );
  }, [data, filter]);

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={loading}
        />
      }
      renderItem={({ item }) => (
        <TaskCard
          bg-surface
          checked={item.isDone}
          title={item.content}
          name={item?.sale ? getCustomerName(item?.sale?.customer) : ""}
          expired={checkTaskExpired(item.isDone, item.date, item.endingTime)}
          time={formatTime(item.startingTime)}
          onCheck={() => handleUpdateTask(item)}
          // onPress={() => handleTaskPress(item)}
        />
      )}
      ListEmptyComponent={() => (
        <View flex center paddingV-16>
          <Text body2>Không có lịch làm việc</Text>
        </View>
      )}
    />
  );
};

TaskSearching.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }),
};

export default TaskSearching;
