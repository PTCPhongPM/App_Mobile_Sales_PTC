import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import { FlatList, RefreshControl } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import {
  Button,
  Colors,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import TaskCard from "../../components/Card/TaskCard";
import Fab from "../../components/Button/Fab";

import calendarTheme from "../../configs/calendarTheme";
import gStyles from "../../configs/gStyles";

import {
  useGetMarkedDateQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
} from "../../store/api/task";

import { Search } from "../../configs/assets";
import {
  checkTaskExpired,
  computeMarkedDate,
  formatTime,
  getCustomerName,
} from "../../helper/utils";
import { useNotification } from "../../providers/NotificationProvider";
import { useStatusBar } from "../../helper/hooks";

const tabs = [{ label: "Đang thực hiện" }, { label: "Đã hoàn thành" }];

const TaskManagement = ({ navigation }) => {
  useStatusBar("light-content");
  const notification = useNotification();

  const [isDone, setIsDone] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetTasksQuery({
    isDone,
    from: dayjs(selectedDate).toISOString(),
  });

  const { data: markedDates } = useGetMarkedDateQuery({
    from: dayjs(selectedMonth).toISOString(),
  });

  const [updateTask, { isSuccess }] = useUpdateTaskMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleSearchPressed = useCallback(
    () => navigation.navigate("TaskSearching"),
    [navigation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Quản lý công việc",
      headerRight: () => (
        <View row>
          <Button
            link
            paddingH-8
            disabled={isFetching}
            onPress={handleSearchPressed}
          >
            <Search fill={Colors.surface} />
          </Button>
        </View>
      ),
    });
  }, [handleSearchPressed, isFetching, navigation]);

  const onDateChanged = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const onMonthChange = useCallback((date) => {
    setSelectedMonth(date.dateString);
  }, []);

  const handleCreateTask = useCallback(
    () => navigation.navigate("GeneralTaskEditor", {}),
    [navigation]
  );

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

  const handleTodayPressed = useCallback(() => {
    setSelectedDate(dayjs().format("YYYY-MM-DD"));
  }, []);

  const renderHeader = useCallback(
    (date) => {
      return (
        <View flex spread row paddingV-8 paddingH-16>
          <Text subtitle1 style={gStyles.capitalize}>
            {dayjs(date).format("MMMM, YYYY")}
          </Text>
          <Button link onPress={handleTodayPressed}>
            <Text button primary900>
              Hôm nay
            </Text>
          </Button>
        </View>
      );
    },
    [handleTodayPressed]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TaskCard
        checked={item.isDone}
        title={item.content}
        checkDisabled={item.sale ? item.sale?.state !== "active" : false}
        name={getCustomerName(item.sale?.customer)}
        expired={checkTaskExpired(item.isDone, item.date, item.endingTime)}
        time={formatTime(item.startingTime)}
        onCheck={() => handleUpdateTask(item)}
        onPress={() => handleTaskPress(item)}
      />
    ),
    [handleTaskPress, handleUpdateTask]
  );

  return (
    <CalendarProvider
      date={selectedDate}
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      disabledOpacity={0.8}
    >
      <ExpandableCalendar
        hideArrows
        firstDay={1}
        theme={calendarTheme}
        // animateScroll
        allowShadow={false}
        calendarHeight={600}
        closeOnDayPress={false}
        markedDates={computeMarkedDate(markedDates)}
        renderHeader={renderHeader}
      />
      <TabController
        items={tabs}
        onChangeIndex={(index) => setIsDone(Boolean(index))}
      >
        <TabController.TabBar />
        <View flex bg-surface style={gStyles.borderT}>
          {tabs.map((tab, index) => (
            <TabController.TabPage
              key={tab.label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                extraData={data}
                refreshControl={
                  <RefreshControl
                    colors={[Colors.primary900]}
                    tintColor={Colors.primary900}
                    onRefresh={refetch}
                    refreshing={false}
                  />
                }
                renderItem={renderItem}
                ListEmptyComponent={() => (
                  <View flex center paddingV-16>
                    <Text body2>Không có lịch làm việc</Text>
                  </View>
                )}
              />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
      <Fab onPress={handleCreateTask} color={Colors.primary900} />
    </CalendarProvider>
  );
};

TaskManagement.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default TaskManagement;
