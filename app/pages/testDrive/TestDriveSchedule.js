import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

import { FlatList, RefreshControl } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import Fab from "../../components/Button/Fab";
import TestDriveScheduleCard from "../../components/Card/TestDriveScheduleCard";
import ProductImage from "../../components/ProductImage";

import calendarTheme from "../../configs/calendarTheme";
import gStyles from "../../configs/gStyles";

import { computeMarkedDate } from "../../helper/utils";
import {
  useGetTestDriveListAllQuery,
  useGetTestDriveMarkedDateQuery,
} from "../../store/api/testDrive";

import { TestDriveStateObject } from "../../helper/constants";
import {
  getSelectProduct,
  setSelectedProduct,
} from "../../store/slices/testDrive";

const TestDriveSchedule = ({ navigation }) => {
  const dispatch = useDispatch();

  const selectProduct = useSelector(getSelectProduct);

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const onDateChanged = useCallback((date) => setSelectedDate(date), []);
  const onMonthChange = useCallback(
    (date) => setSelectedMonth(date.dateString),
    []
  );

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetTestDriveListAllQuery({
    from: dayjs(selectedDate).toISOString(),
    states: [TestDriveStateObject.approved, TestDriveStateObject.done],
  });

  const { data: markedDates, isFetching: isMarkedDateFetching } =
    useGetTestDriveMarkedDateQuery({
      from: dayjs(selectedMonth).toISOString(),
    });

  const loading = isFetching || isMarkedDateFetching;

  useEffect(() => {
    if (data.length && !selectProduct.id) {
      dispatch(setSelectedProduct(data[0].testProduct));
    }
  }, [data, dispatch, selectProduct]);

  const list = useMemo(
    () => data.filter((item) => item.testProduct.id === selectProduct?.id),
    [data, selectProduct?.id]
  );

  const handleCreateTestDrive = useCallback(
    () => navigation.navigate("GeneralTestDriveEditor", {}),
    [navigation]
  );

  const handleProductPress = useCallback(
    () =>
      navigation.navigate("TestDrivePicker", {
        selected: selectProduct,
        onSelect: (product) => dispatch(setSelectedProduct(product)),
      }),
    [dispatch, navigation, selectProduct]
  );

  const toTestDriveDetails = useCallback(
    (testDrive) =>
      navigation.navigate("TestDriveDetails", {
        testDrive,
      }),
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
        closeOnDayPress={false}
        markedDates={computeMarkedDate(markedDates)}
        renderHeader={renderHeader}
      />
      <View paddingH-16 bg-surface flex style={gStyles.borderT}>
        <TouchableOpacity bg-surface onPress={handleProductPress}>
          <ProductImage
            uri={selectProduct.model?.photo?.url}
            name={selectProduct.model?.description}
          />
        </TouchableOpacity>
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
            <TestDriveScheduleCard
              testDrive={item}
              onPress={() => toTestDriveDetails(item)}
            />
          )}
          ListHeaderComponent={() => {
            if (!list.length) return null;

            const temporaries = selectedDate.split("-");
            return (
              <View paddingH-16 marginV-8>
                <Text body2>
                  Ngày {temporaries[2]} tháng {temporaries[1]}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View flex center paddingV-16>
              <Text body2>Không có lịch lái thử</Text>
            </View>
          )}
        />
      </View>
      <Fab onPress={handleCreateTestDrive} color={Colors.primary900} />
    </CalendarProvider>
  );
};

TestDriveSchedule.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default TestDriveSchedule;
