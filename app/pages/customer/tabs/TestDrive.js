import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { ActionSheet, Colors, Text, View } from "react-native-ui-lib";
import { RefreshControl, FlatList } from "react-native";
import { Toast } from "react-native-ui-lib/src/incubator";

import Fab from "../../../components/Button/Fab";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";
import TestDriveCard from "../../../components/Card/TestDriveCard";

import {
  SolidCheckedCircle,
  SolidDelete,
  SolidPrint,
} from "../../../configs/assets";

import {
  useDeleteTestDriveMutation,
  useGetTestDriveListAllQuery,
} from "../../../store/api/testDrive";

import { useNotification } from "../../../providers/NotificationProvider";

import { TestDriveStateObject } from "../../../helper/constants";
import { showDeleteAlert } from "../../../helper/alert";
import { checkSaleActive } from "../../../helper/utils";
import HorizontalButtonTab from "../../../components/Button/HorizontalButtonTab";

const TestDrive = ({ customer }) => {
  const navigation = useNavigation();
  const notification = useNotification();
  const sale = customer.sales[0];

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetTestDriveListAllQuery({ saleId: sale?.id }, { skip: !sale?.id });

  const [deleteTestDrive, { isSuccess }] = useDeleteTestDriveMutation();

  const [selected, setSelected] = useState({});
  const [actionSheetShown, setActionSheetShown] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleCreateTestDrive = useCallback(
    () => navigation.navigate("TestDriveEditor", { customer }),
    [customer, navigation]
  );

  const toTestDriveDetails = useCallback(
    (testDrive) =>
      navigation.navigate("TestDriveDetails", {
        testDrive,
        moveToCustomer: false,
      }),
    [navigation]
  );

  const [selectedTab, setSelectedTab] = useState("all");

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
        id: "all",
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

  const list = useMemo(() => {
    if (isFetching) return [];
    if (selectedTab === "all") return data;

    if (selectedTab === TestDriveStateObject.approved) {
      return data.filter((e) =>
        [
          TestDriveStateObject.approved,
          TestDriveStateObject.done,
          TestDriveStateObject.incomplete,
        ].includes(e.state)
      );
    }

    return data.filter((item) => item.state === selectedTab);
  }, [data, isFetching, selectedTab]);

  const handleDelete = useCallback(
    (item) =>
      showDeleteAlert(
        "Xoá lịch lái thử",
        "Bạn có chắc chắn muốn xoá lịch lái thử này?",
        () => deleteTestDrive({ id: item.id })
      ),
    [deleteTestDrive]
  );

  const toSchedulePage = useCallback(
    () => navigation.navigate("TestDriveSchedule", {}),
    [navigation]
  );

  const actionSheetOptions = useMemo(
    () => [
      {
        label: "Không hoàn thành",
        onPress: () =>
          navigation.navigate("TestDriveIncompleteEditor", {
            testDrive: selected,
          }),
      },
      {
        label: "Hoàn thành",
        onPress: () =>
          navigation.navigate("TestDriveCompleteEditor", {
            testDrive: selected,
          }),
      },
      { label: "Trở lại" },
    ],
    [navigation, selected]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      if (isSaleActive) {
        const leftActions = [];
        const rightActions = [
          {
            text: "In phiếu",
            color: Colors.stateOrangeDefault,
            icon: <SolidPrint fill={Colors.surface} />,
            // todo
            onPress: () => {},
          },
        ];

        if (
          item.state === TestDriveStateObject.draft ||
          item.state === TestDriveStateObject.rejected
        ) {
          leftActions.push({
            text: "Xoá",
            color: Colors.stateRedDefault,
            icon: <SolidDelete fill={Colors.surface} />,
            onPress: () => handleDelete(item),
          });
        } else if (item.state === TestDriveStateObject.approved) {
          rightActions.push({
            text: "Cập nhật",
            color: Colors.stateBlueDefault,
            icon: <SolidCheckedCircle fill={Colors.surface} />,
            onPress: () => {
              handleActionSheetShow();
              setSelected(item);
            },
          });
        }

        return (
          <SwipeWrapper leftActions={leftActions} rightActions={rightActions}>
            <TestDriveCard
              testDrive={item}
              onPress={() => toTestDriveDetails(item)}
            />
          </SwipeWrapper>
        );
      }

      return (
        <TestDriveCard
          testDrive={item}
          onPress={() => toTestDriveDetails(item)}
        />
      );
    },
    [handleActionSheetShow, handleDelete, isSaleActive, toTestDriveDetails]
  );

  return (
    <View flex>
      <HorizontalButtonTab
        buttons={buttons}
        selected={selectedTab}
        onPress={(id) => {
          setSelectedTab(id);
          refetch();
        }}
      />
      <FlatList
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        data={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={isFetching}
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có lịch lái thử</Text>
          </View>
        )}
        ListFooterComponent={() => isSaleActive && <View height={148} />}
      />

      {isSaleActive && (
        <>
          <Fab
            isCalendar
            onPress={toSchedulePage}
            color={Colors.stateBlueDark}
          />
          <Fab onPress={handleCreateTestDrive} color={Colors.primary900} />
        </>
      )}

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </View>
  );
};

TestDrive.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number,
    sales: PropTypes.array,
  }),
};

export default TestDrive;
