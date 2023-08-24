import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, SectionList } from "react-native";

import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";
import { useSelector,useDispatch } from "react-redux";

import BasePage from "../../components/Base/BasePage";
import Fab from "../../components/Button/Fab";
import DeliveryCard from "../../components/Card/DeliveryCard";
import Headline from "../../components/Header/Headline";
import SwipeWrapper from "../../components/Swipe/SwipeWrapper";
import HorizontalButtonTab from "../../components/Button/HorizontalButtonTab";
import { DeliveryStateObject } from "../../helper/constants";

import {
  Close,
  Search,
  SolidCheckedCircle,
  SolidDelete,
  Tune,
} from "../../configs/assets";
import gStyles from "../../configs/gStyles";

import { useStatusBar } from "../../helper/hooks";
import { groupDelivery } from "../../helper/utils";
import { useGetDeliverySchedulesQuery } from "../../store/api/delivery";
import { selectQuery,setQuery } from "../../store/slices/delivery";

const DeliverySchedule = ({ navigation, route }) => {
  useStatusBar("light-content");

  const { sortby, orderby, ...otherQuery } = useSelector(selectQuery);

  const [isSearchMore, setSearchMode] = useState(false);
  const [filter, setFilter] = useState("");
  const toggleSearchMode = useCallback(() => setSearchMode((pre) => !pre), []);

  const { data = [], isFetching, refetch } = useGetDeliverySchedulesQuery({accountId:route?.params?.account?.id});
  const dispatch = useDispatch();
  const handleFilter = useCallback(
    () => navigation.navigate("DeliveryFilterSettings"),
    [navigation]
  );

  const loading = isFetching;
  const count = useMemo(() => {
    const obj = {
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
    };
    data.forEach((e) => {
      if (
        [DeliveryStateObject.approved, DeliveryStateObject.completed].includes(
          e.state
        )
      ) {
        obj["approved"]++;
      } else {
        obj[e.state]++;
      }
    });

    return obj;
  }, [data]);
  const buttons = useMemo(
      () => [
        {
          id: "",
          label: "Tất cả",
        },
        {
          id: "approved",
          label: "Đã duyệt",
          value: count["approved"],
        },
        {
          id: "pending",
          label: "Chờ duyệt",
          value: count["pending"],
        },
        {
          id: "rejected",
          label: "Từ chối",
          value: count["rejected"],
        },
        {
          id: "draft",
          label: "Bản nháp",
          value: count["draft"],
        },
      ],
      [count]
    );
  useEffect(() => {
    if (isSearchMore) {
      navigation.setOptions({
        headerTitleAlign: "left",
        headerLeft: null,
        headerTitle: () => (
          <Incubator.TextField
            autoFocus
            placeholder="Tìm kiếm                                                                                                              "
            selectionColor={Colors.surface}
            style={[gStyles.search, { color: Colors.surface }]}
            leadingAccessory={<Search fill={Colors.surface} />}
            placeholderTextColor={Colors.textWhiteMedium}
            value={filter}
            onChangeText={setFilter}
          />
        ),
        headerRight: () => (
          <Button
            link
            paddingH-16
            onPress={() => {
              toggleSearchMode();
              setFilter("");
            }}
          >
            <Close fill={Colors.white} />
          </Button>
        ),
      });
    } else {
      navigation.setOptions({
        headerTitle: "Lịch giao xe",
        headerTitleAlign: "center",
        headerLeft: () => (
          <Button link paddingH-16 onPress={handleFilter}>
            <Tune fill={Colors.white} />
          </Button>
        ),
        headerRight: () => (
          <Button link paddingH-16 onPress={toggleSearchMode}>
            <Search fill={Colors.white} />
          </Button>
        ),
      });
    }
  }, [filter, handleFilter, isSearchMore, navigation, toggleSearchMode]);

  const list = useMemo(
    () => groupDelivery(data, sortby, orderby, otherQuery),
    [data, orderby, otherQuery, sortby]
  );

  const toDeliveryEditor = useCallback(
    () => navigation.navigate("GeneralDeliveryScheduleEditor", {}),
    [navigation]
  );

  const toDeliveryScheduleCompany = useCallback(
    () => navigation.navigate("DeliveryScheduleCompany"),
    [navigation]
  );

  return (
    <BasePage hasScroll={false}>
       <HorizontalButtonTab
        buttons={buttons}
        selected={otherQuery.state}
        onPress={(id) => {
          dispatch(setQuery({ state: id }));
          refetch();
        }}
      />
      <SectionList
        sections={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={loading}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View marginT-5={Boolean(index)}>
            <SwipeWrapper
              leftActions={[
                {
                  text: "Xóa",
                  color: Colors.stateRedDefault,
                  icon: <SolidDelete fill={Colors.surface} />,
                  onPress: () => {},
                },
              ]}
              rightActions={[
                {
                  text: "Cập nhật",
                  color: Colors.stateBlueDefault,
                  icon: <SolidCheckedCircle fill={Colors.surface} />,
                  onPress: () => {},
                },
              ]}
            >
              <DeliveryCard
                schedule={item}
                onPress={() =>
                  navigation.navigate("DeliveryScheduleDetails", {
                    deliverySchedule: item,
                  })
                }
              />
            </SwipeWrapper>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View paddingT-12 bg-background>
            <Headline label={title} marginT-0 />
          </View>
        )}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có lịch giao xe</Text>
          </View>
        )}
      />

      <Fab
        isCalendar
        color={Colors.stateBlueDark}
        onPress={toDeliveryScheduleCompany}
      />
      <Fab onPress={toDeliveryEditor} color={Colors.primary900} />
    </BasePage>
  );
};

DeliverySchedule.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.shape({
    params: PropTypes.shape({
      fromCustomer: PropTypes.bool,
    }),
  }),
};

export default DeliverySchedule;
