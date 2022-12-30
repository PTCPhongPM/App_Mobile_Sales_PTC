import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";

import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import dayjs from "dayjs";

import BasePage from "../../components/Base/BasePage";
import Fab from "../../components/Button/Fab";

import calendarTheme from "../../configs/calendarTheme";
import gStyles from "../../configs/gStyles";

import DeliveryScheduleCard from "../../components/Card/DeliveryScheduleCard";
import { DeliveryStateObject } from "../../helper/constants";
import { computeMarkedDate } from "../../helper/utils";
import { useGetCompartmentsQuery } from "../../store/api/compartment";
import {
  useGetDeliveryMarkedDateQuery,
  useGetDeliverySchedulesQuery,
} from "../../store/api/delivery";

const styles = StyleSheet.create({
  border: {
    ...gStyles.border,
    borderColor: Colors.primary900,
  },
});

const DeliveryScheduleCompany = ({ navigation }) => {
  const [compartment, setCompartment] = useState();

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const { data: compartments = [], isFetching } = useGetCompartmentsQuery(
    {},
    { skip: compartment }
  );

  const {
    data = [],
    isFetching: isDeliveryFetching,
    refetch,
  } = useGetDeliverySchedulesQuery({
    state: DeliveryStateObject.approved,
    from: dayjs(selectedDate).toISOString(),
  });

  const {
    data: markedDates,
    isFetching: isMarkedDateFetching,
    refetch: refetchMarkedDate,
  } = useGetDeliveryMarkedDateQuery({
    from: dayjs(selectedMonth).toISOString(),
  });

  const loading = isFetching || isDeliveryFetching || isMarkedDateFetching;

  useEffect(() => {
    if (!compartment && compartments.length) {
      setCompartment(compartments[0]);
    }
  }, [compartment, compartments]);

  const onDateChanged = useCallback((date) => setSelectedDate(date), []);
  const onMonthChange = useCallback(
    (date) => setSelectedMonth(date.dateString),
    []
  );

  const renderItem = useCallback(
    ({ item }) => <DeliveryScheduleCard delivery={item} />,
    []
  );

  const handleCreateDelivery = useCallback(
    () => navigation.navigate("GeneralDeliveryScheduleEditor", {}),
    [navigation]
  );

  const handleChooseCompartment = useCallback(
    () =>
      navigation.navigate("CompartmentPicker", {
        selected: compartment,
        onSelect: (compartment) => setCompartment(compartment),
      }),
    [navigation, compartment]
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
    <BasePage hasScroll={false} bg-surface>
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
          <TouchableOpacity onPress={handleChooseCompartment}>
            <View
              bg-primary50
              paddingV-4
              marginV-8
              br10
              center
              style={styles.border}
            >
              <Text subtitle1>{compartment?.name}</Text>
            </View>
          </TouchableOpacity>

          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                colors={[Colors.primary900]}
                tintColor={Colors.primary900}
                onRefresh={() => {
                  refetch();
                  refetchMarkedDate();
                }}
                refreshing={loading}
              />
            }
            renderItem={renderItem}
            ListHeaderComponent={() => {
              if (!data.length) return null;

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
                <Text body2>Không có lịch giao xe</Text>
              </View>
            )}
          />
        </View>

        <Fab onPress={handleCreateDelivery} color={Colors.primary900} />
      </CalendarProvider>
    </BasePage>
  );
};

DeliveryScheduleCompany.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default DeliveryScheduleCompany;
