import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { Button, Colors, Text, View } from "react-native-ui-lib";
import { RefreshControl, SectionList } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";
import Fab from "../../components/Button/Fab";
import Headline from "../../components/Header/Headline";
import HorizontalButtonTab from "../../components/Button/HorizontalButtonTab";
import SwipeWrapper from "../../components/Swipe/SwipeWrapper";
import TestDriveCard from "../../components/Card/TestDriveCard";

import { useNotification } from "../../providers/NotificationProvider";

import {
  Search,
  SolidCheckedCircle,
  SolidDelete,
  SolidPrint,
  Tune,
} from "../../configs/assets";

import { TestDriveStateObject } from "../../helper/constants";
import {
  useDeleteTestDriveMutation,
  useGetTestDriveListAllQuery,
} from "../../store/api/testDrive";
import { groupTestDrives } from "../../helper/utils";
import { selectQuery, setQuery } from "../../store/slices/testDrive";
import { showDeleteAlert } from "../../helper/alert";
import { useStatusBar } from "../../helper/hooks";

const TestDriveManagement = ({ navigation }) => {
  useStatusBar("light-content");
  const dispatch = useDispatch();
  const notification = useNotification();

  const { sortby, orderby, ...otherQuery } = useSelector(selectQuery);

  const { data = [], isFetching, refetch } = useGetTestDriveListAllQuery({});
  const [deleteTestDrive, { isSuccess, isLoading: isDeleting }] =
    useDeleteTestDriveMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const loading = isFetching || isDeleting;

  const toFilterPage = useCallback(
    () => navigation.navigate("TestDriveFilterSettings"),
    [navigation]
  );

  const toSearchPage = useCallback(
    () => navigation.navigate("TestDriveSearching"),
    [navigation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Lái thử",
      headerTitleAlign: "center",
      headerLeft: () => (
        <Button link paddingH-16 onPress={toFilterPage}>
          <Tune fill={Colors.white} />
        </Button>
      ),
      headerRight: () => (
        <Button link paddingH-16 onPress={toSearchPage}>
          <Search fill={Colors.white} />
        </Button>
      ),
    });
  }, [navigation, toFilterPage, toSearchPage]);

  const count = useMemo(() => {
    if (!data) return null;

    const obj = {
      approved: 0,
      created: 0,
      rejected: 0,
      draft: 0,
    };
    data.forEach((e) => {
      if (
        [
          TestDriveStateObject.approved,
          TestDriveStateObject.done,
          TestDriveStateObject.incomplete,
        ].includes(e.state)
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
        id: "created",
        label: "Chờ duyệt",
        value: count["created"],
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

  const list = useMemo(
    () => groupTestDrives(data, sortby, orderby, otherQuery),
    [data, orderby, otherQuery, sortby]
  );

  const handleDelete = useCallback(
    (item) =>
      showDeleteAlert(
        "Xoá lịch lái thử",
        "Bạn có chắc chắn muốn xoá lịch lái thử này?",
        () => deleteTestDrive({ id: item.id })
      ),
    [deleteTestDrive]
  );

  const toCreateTestDrivePage = useCallback(
    () => navigation.navigate("GeneralTestDriveEditor", {}),
    [navigation]
  );

  const toTestDriveDetails = useCallback(
    (testDrive) =>
      navigation.navigate("TestDriveDetails", {
        testDrive,
      }),
    [navigation]
  );

  const toSchedulePage = useCallback(
    () => navigation.navigate("TestDriveSchedule", {}),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const isLast = index === list.length;

      if (item.state === TestDriveStateObject.draft) {
        return (
          <View marginT-5={Boolean(index)} paddingB-100={isLast}>
            <SwipeWrapper
              leftActions={[
                {
                  text: "Xoá",
                  color: Colors.stateRedDefault,
                  icon: <SolidDelete fill={Colors.surface} />,
                  onPress: () => handleDelete(item),
                },
              ]}
              rightActions={[
                {
                  text: "In phiếu",
                  color: Colors.stateOrangeDefault,
                  icon: <SolidPrint fill={Colors.surface} />,
                  // todo pdf
                  onPress: () => {},
                },
              ]}
            >
              <TestDriveCard
                isGeneralMode
                testDrive={item}
                onPress={() => toTestDriveDetails(item)}
              />
            </SwipeWrapper>
          </View>
        );
      }

      return (
        <View marginT-5={Boolean(index)} paddingB-100={isLast}>
          <SwipeWrapper
            rightActions={[
              {
                text: "Câp nhật",
                color: Colors.stateBlueDefault,
                icon: <SolidCheckedCircle fill={Colors.surface} />,
                onPress: () =>
                  navigation.navigate("TestDriveEditor", {
                    customer: item.customer,
                    testDrive: item,
                  }),
              },
              {
                text: "In phiếu",
                color: Colors.stateOrangeDefault,
                icon: <SolidPrint fill={Colors.surface} />,
                // todo pdf
                onPress: () => {},
              },
            ]}
          >
            <TestDriveCard
              isGeneralMode
              testDrive={item}
              onPress={() => toTestDriveDetails(item)}
            />
          </SwipeWrapper>
        </View>
      );
    },
    [handleDelete, list.length, navigation, toTestDriveDetails]
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
        initialNumToRender={20}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View paddingT-12 bg-background>
            <Headline label={title} marginT-0 />
          </View>
        )}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có lịch lái thử</Text>
          </View>
        )}
        ListFooterComponent={() => <View height={148} />}
      />

      <Fab isCalendar onPress={toSchedulePage} color={Colors.stateBlueDark} />
      <Fab onPress={toCreateTestDrivePage} color={Colors.primary900} />
    </BasePage>
  );
};

TestDriveManagement.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default TestDriveManagement;
