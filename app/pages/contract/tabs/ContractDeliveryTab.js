import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import { ActionSheet, Button, Colors, Text, View } from "react-native-ui-lib";

import { Toast } from "react-native-ui-lib/src/incubator";
import AllocationProductCard from "../../../components/Card/AllocationProductCard";
import DeliveryCard from "../../../components/Card/DeliveryCard";
import Headline from "../../../components/Header/Headline";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import {
  Calendar,
  Empty,
  SolidCheckedCircle,
  SolidDelete,
} from "../../../configs/assets";

import gStyles from "../../../configs/gStyles";

import {
  AllocationStates,
  DeliveryStateObject,
} from "../../../helper/constants";
import { useNotification } from "../../../providers/NotificationProvider";
import { useGetAllocationProductsQuery } from "../../../store/api/allocation";

import { showDeleteAlert } from "../../../helper/alert";
import {
  useDeleteDeliveryMutation,
  useGetDeliverySchedulesQuery,
} from "../../../store/api/delivery";

const ContractDeliveryTab = ({ contract, refetch, loading }) => {
  const navigation = useNavigation();
  const notification = useNotification();

  const {
    data: allocationProducts = [],
    isFetching,
    refetch: refetchAllocation,
  } = useGetAllocationProductsQuery({
    contractId: contract.id,
  });

  const {
    data: deliverySchedules = [],
    isFetching: isDeliveryFetching,
    refetch: refetchDelivery,
  } = useGetDeliverySchedulesQuery({
    contractId: contract.id,
  });

  const [deleteDelivery, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteDeliveryMutation();

  const isLoading = loading || isFetching || isDeliveryFetching || isDeleting;

  useEffect(() => {
    if (isDeleted) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted]);

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState();

  // state === ready
  const canCreateDeliverySchedule = useMemo(
    () => allocationProducts.some((e) => e.state === AllocationStates[2]),
    [allocationProducts]
  );

  const renderAllocationProducts = useCallback(
    (item) =>
      item.state === "ready" ? (
        <SwipeWrapper
          key={item.id}
          rightActions={[
            {
              text: "Tạo lịch giao",
              color: Colors.stateBlueDefault,
              icon: <Calendar fill={Colors.surface} />,
              onPress: () =>
                navigation.navigate("DeliveryScheduleEditor", {
                  deliverySchedule: {
                    ...item,
                    contract,
                  },
                }),
            },
          ]}
        >
          <AllocationProductCard item={item} />
        </SwipeWrapper>
      ) : (
        <AllocationProductCard key={item.id} item={item} />
      ),
    [contract, navigation]
  );

  const toDeliveryScheduleEditor = useCallback(
    () => navigation.navigate("DeliveryScheduleEditor", { contract }),
    [contract, navigation]
  );

  const renderDeliveryScheduleSection = useCallback(() => {
    if (!deliverySchedules.length) {
      return (
        <View
          bg-surface
          center
          paddingV-16
          style={[gStyles.border, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Bạn chưa có lịch giao xe
          </Text>
          <View row center>
            <Button
              borderRadius={4}
              outline
              outlineColor={Colors.primary900}
              paddingV-8
              marginT-8
              onPress={toDeliveryScheduleEditor}
            >
              <Text button primary900>
                Tạo lịch giao xe
              </Text>
            </Button>
          </View>
        </View>
      );
    }

    return deliverySchedules.map((item) => {
      const rightActions = [];
      const leftActions = [];

      if (item.state === DeliveryStateObject.approved) {
        rightActions.push({
          text: "Cập nhật",
          color: Colors.stateBlueDefault,
          icon: <SolidCheckedCircle fill={Colors.surface} />,
          onPress: () => {
            handleActionSheetShow();
            setSelectedDelivery(item);
          },
        });
      }

      if (
        item.state === DeliveryStateObject.draft ||
        item.state === DeliveryStateObject.rejected
      ) {
        leftActions.push({
          text: "Xóa",
          color: Colors.stateRedDefault,
          icon: <SolidDelete fill={Colors.surface} />,
          onPress: () =>
            showDeleteAlert(
              "Xóa lịch giao xe",
              "Bạn có chắc chắn muốn xoá lịch giao xe này?",
              () => deleteDelivery({ id: item.id })
            ),
        });
      }

      return (
        <SwipeWrapper
          key={item.id}
          rightActions={rightActions}
          leftActions={leftActions}
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
      );
    });
  }, [
    deleteDelivery,
    deliverySchedules,
    handleActionSheetShow,
    navigation,
    toDeliveryScheduleEditor,
  ]);

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const actionSheetOptions = useMemo(
    () => [
      {
        label: "Không hoàn thành",
        onPress: () =>
          navigation.navigate("DeliveryIncompleteEditor", {
            delivery: selectedDelivery,
          }),
      },
      {
        label: "Hoàn thành",
        onPress: () =>
          navigation.navigate("DeliveryCompleteEditor", {
            delivery: selectedDelivery,
          }),
      },
      { label: "Trở lại" },
    ],
    [navigation, selectedDelivery]
  );

  if (!allocationProducts.length) {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            refreshing={isLoading}
            onRefresh={() => {
              refetch();
              refetchAllocation();
              refetchDelivery();
            }}
          />
        }
      >
        <View
          bg-surface
          center
          paddingV-16
          style={[gStyles.border, gStyles.shadow]}
        >
          <Empty />
          <Text primary900 marginT-8>
            Không có thông tin
          </Text>
          <Text textBlackMedium marginT-8>
            Hợp đồng của bạn chưa được duyệt
          </Text>
          <Text textBlackMedium marginT-8>
            Hoặc Admin chưa phân xe cho bạn
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
            refetchAllocation();
            refetchDelivery();
          }}
        />
      }
    >
      <Headline label="Chi tiết phân xe" />

      {allocationProducts.map(renderAllocationProducts)}

      <Headline
        label="Lịch giao xe"
        onPress={
          canCreateDeliverySchedule && deliverySchedules.length
            ? toDeliveryScheduleEditor
            : undefined
        }
      />

      {canCreateDeliverySchedule ? (
        renderDeliveryScheduleSection()
      ) : (
        <View
          bg-surface
          center
          paddingV-16
          style={[gStyles.border, gStyles.shadow]}
        >
          <Empty />
          <Text primary900 marginT-8>
            Bạn không thể tạo lịch giao xe
          </Text>
          <Text textBlackMedium marginT-8>
            Xe chưa sẵn sàng để giao
          </Text>
        </View>
      )}

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </ScrollView>
  );
};

ContractDeliveryTab.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.number,
  }),
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default ContractDeliveryTab;
