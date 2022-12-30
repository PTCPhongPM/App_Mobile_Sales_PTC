import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Alert } from "react-native";
import ContextMenu from "react-native-context-menu-view";

import {
  ActionSheet,
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";
import ApprovalButtons from "../../components/Button/ApprovalButtons";
import InputLabel from "../../components/Input/InputLabel";
import ProductImage from "../../components/ProductImage";
import TextRow from "../../components/TextRow";

import { ChevronRightSmall, Delete, Edit, More } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

import { showDeleteAlert } from "../../helper/alert";

import {
  DeliveryCompletionStates,
  DeliveryStateObject,
} from "../../helper/constants";
import { useDirectorRole } from "../../helper/hooks";
import { formatDate, formatTime, getCustomerName } from "../../helper/utils";

import { useNotification } from "../../providers/NotificationProvider";

import {
  useApproveDeliveryMutation,
  useConfirmDeliveryMutation,
  useDeleteDeliveryMutation,
  useGetDeliveryScheduleQuery,
  useSend2ApproverMutation,
  useUnConfirmDeliveryMutation,
} from "../../store/api/delivery";

const DeliveryScheduleDetails = ({ navigation, route }) => {
  const { deliverySchedule, canRedirect } = route.params;
  const notification = useNotification();

  const isDirector = useDirectorRole();

  const { data, isFetching, refetch } = useGetDeliveryScheduleQuery({
    id: deliverySchedule.id,
  });

  const [send2Approver, { isLoading, isSuccess }] = useSend2ApproverMutation();

  const [deleteDelivery, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteDeliveryMutation();

  const [approveDelivery, { isLoading: isApprove, isSuccess: isApproved }] =
    useApproveDeliveryMutation();

  const [
    unConfirmDelivery,
    { isLoading: isUnConfirming, isSuccess: isUnConfirmed },
  ] = useUnConfirmDeliveryMutation();

  const [confirmDelivery, { isLoading: isConfirming, isSuccess: isConfirmed }] =
    useConfirmDeliveryMutation();

  const loading =
    isFetching ||
    isLoading ||
    isDeleting ||
    isApprove ||
    isUnConfirming ||
    isConfirming;

  const deliveryDetails = useMemo(
    () => data || deliverySchedule,
    [data, deliverySchedule]
  );

  const [actionSheetShown, setActionSheetShown] = useState(false);

  const handleEdit = useCallback(
    () =>
      navigation.navigate("DeliveryScheduleEditor", {
        deliverySchedule: deliveryDetails,
      }),
    [deliveryDetails, navigation]
  );

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá lịch giao xe",
        "Bạn có chắc chắn muốn xoá lịch giao xe",
        () =>
          deleteDelivery({
            id: deliverySchedule.id,
          })
      ),
    [deleteDelivery, deliverySchedule.id]
  );

  const contextActions = useMemo(
    () => [
      {
        title: "Gửi duyệt",
        onPress: () => {
          send2Approver({
            id: deliverySchedule.id,
          });
        },
      },
      {
        title: "Xoá",
        destructive: true,
        onPress: handleDelete,
      },
    ],
    [deliverySchedule.id, handleDelete, send2Approver]
  );

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => {
      contextActions[index].onPress();
    },
    [contextActions]
  );

  useEffect(() => {
    if (isDirector) return;

    if (deliveryDetails.state === DeliveryStateObject.rejected) {
      navigation.setOptions({
        headerRight: () => (
          <View row>
            <Button link paddingH-16 onPress={handleDelete}>
              <Delete fill={Colors.surface} />
            </Button>
          </View>
        ),
      });
    }

    if (deliveryDetails.state !== DeliveryStateObject.draft) return;

    navigation.setOptions({
      headerRight: () => (
        <View row>
          <Button link paddingH-8 onPress={handleEdit}>
            <Edit fill={Colors.surface} />
          </Button>
          <ContextMenu
            actions={contextActions}
            dropdownMenuMode={true}
            previewBackgroundColor="transparent"
            onPress={handelMenuPressed}
          >
            <View paddingR-16 paddingL-8>
              <More fill={Colors.white} />
            </View>
          </ContextMenu>
        </View>
      ),
    });
  }, [
    contextActions,
    deliveryDetails.state,
    handelMenuPressed,
    handleDelete,
    handleEdit,
    isDirector,
    navigation,
  ]);

  useEffect(() => {
    if (
      isDirector &&
      deliveryDetails.state === DeliveryStateObject.approved &&
      deliveryDetails.completionState === "completed"
    ) {
      navigation.setOptions({
        headerTitle: "Xác nhận giao xe hoàn tất",
      });
    }
  }, [
    deliveryDetails.completionState,
    deliveryDetails.state,
    isDirector,
    navigation,
  ]);

  useEffect(() => {
    if (isDeleted) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleted, navigation]);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Gửi duyệt thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (isApproved) {
      notification.showMessage("Phê duyệt thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved, isConfirmed, isUnConfirmed]);

  useEffect(() => {
    if (isUnConfirmed || isConfirmed) {
      notification.showMessage("Phê duyệt thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed, isUnConfirmed, navigation]);

  const information = useMemo(() => {
    const arr = [
      {
        label: "Khoang xe số",
        value: deliveryDetails.compartment?.name,
      },
      {
        label: "Địa điểm",
        value: deliveryDetails.place,
      },
      {
        label: "Địa chỉ",
        value: deliveryDetails.address,
      },
      {
        label: "Ngày giao",
        value: formatDate(deliveryDetails.date),
      },
      {
        label: "Thời gian bắt đầu",
        value: deliveryDetails.startingTime
          ? formatTime(deliveryDetails.startingTime)
          : "",
      },
      {
        label: "Thời gian kết thúc",
        value: deliveryDetails.endingTime
          ? formatTime(deliveryDetails.endingTime)
          : "",
      },
      {
        label: "Người hỗ trợ",
        value: deliveryDetails.supporter?.name,
      },
    ];

    if (deliveryDetails.completionState === "completed") {
      arr.push({
        label: "Trạng thái",
        value: DeliveryCompletionStates.completionState,
      });
    } else if (deliveryDetails.completionState === "incompleted") {
      arr.push({
        label: "Trạng thái",
        value: DeliveryCompletionStates.incompleted,
      });
      arr.push({
        label: "Lý do",
        value: deliveryDetails.reason,
      });
    }

    return arr;
  }, [
    deliveryDetails.address,
    deliveryDetails.compartment?.name,
    deliveryDetails.completionState,
    deliveryDetails.date,
    deliveryDetails.endingTime,
    deliveryDetails.place,
    deliveryDetails.reason,
    deliveryDetails.startingTime,
    deliveryDetails.supporter?.name,
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
            delivery: deliveryDetails,
          }),
      },
      {
        label: "Hoàn thành",
        onPress: () =>
          navigation.navigate("DeliveryCompleteEditor", {
            delivery: deliveryDetails,
          }),
      },
      { label: "Trở lại" },
    ],
    [navigation, deliveryDetails]
  );

  const toGallery = useCallback(
    () =>
      navigation.navigate("DeliveryScheduleGallery", {
        files: deliveryDetails.files,
      }),
    [deliveryDetails.files, navigation]
  );

  const handleReject = useCallback(
    () =>
      navigation.navigate("ReasonRejectEditor", {
        id: deliveryDetails.id,
        type: "delivery",
      }),
    [deliveryDetails.id, navigation]
  );

  const handleApprove = useCallback(
    () =>
      Alert.alert(
        "Phê duyệt lịch giao xe?",
        "Bạn sẽ phê duyệt lịch giao xe này cho nhân viên kinh doanh",
        [
          {
            text: "Trở lại",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => approveDelivery({ id: deliverySchedule.id }),
          },
        ],
        { cancelable: true }
      ),
    [approveDelivery, deliverySchedule.id]
  );

  const renderButton = useCallback(() => {
    if (isDirector) return null;

    if (deliveryDetails.state !== DeliveryStateObject.approved) {
      return null;
    }

    if (deliveryDetails.completionState) return null;

    return (
      <>
        <Button
          borderRadius={4}
          marginH-16
          marginT-16
          paddingV-16
          bg-primary900
          onPress={handleActionSheetShow}
        >
          <Text button textWhiteHigh>
            Cập nhật
          </Text>
        </Button>

        <ActionSheet
          useNativeIOS
          useSafeArea
          cancelButtonIndex={actionSheetOptions.length}
          visible={actionSheetShown}
          options={actionSheetOptions}
          onDismiss={handleActionSheetDismiss}
        />
      </>
    );
  }, [
    actionSheetOptions,
    actionSheetShown,
    deliveryDetails.completionState,
    deliveryDetails.state,
    handleActionSheetDismiss,
    handleActionSheetShow,
    isDirector,
  ]);

  const handleUnConfirm = useCallback(
    () =>
      unConfirmDelivery({
        id: deliverySchedule.id,
      }),
    [deliverySchedule.id, unConfirmDelivery]
  );

  const handleConfirm = useCallback(
    () =>
      Alert.alert(
        "Xác nhận hoàn thành giao xe",
        "Bạn sẽ xác nhận rằng xe đã giao thành công",
        [
          {
            text: "Trở lại",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => confirmDelivery({ id: deliverySchedule.id }),
          },
        ],
        { cancelable: true }
      ),
    [confirmDelivery, deliverySchedule.id]
  );

  const renderApprovalButton = useCallback(() => {
    if (!isDirector) return null;
    if (deliveryDetails.state === DeliveryStateObject.pending) {
      return (
        <ApprovalButtons onReject={handleReject} onApprove={handleApprove} />
      );
    }

    if (
      deliveryDetails.state === DeliveryStateObject.approved &&
      deliveryDetails.completionState === "completed"
    ) {
      return (
        <ApprovalButtons onReject={handleUnConfirm} onApprove={handleConfirm} />
      );
    }

    return null;
  }, [
    deliveryDetails.completionState,
    deliveryDetails.state,
    handleApprove,
    handleConfirm,
    handleReject,
    handleUnConfirm,
    isDirector,
  ]);

  const handleReasonRejectPressed = useCallback(
    () =>
      navigation.navigate("ReasonReject", {
        reason: deliverySchedule.reason,
      }),
    [deliverySchedule.reason, navigation]
  );

  return (
    <BasePage loading={loading} canPullToReload onRefresh={refetch}>
      <View flex spread>
        <View>
          {canRedirect ? (
            <View
              bg-surface
              paddingH-16
              paddingT-8
              paddingB-16
              marginB-12
              style={[gStyles.borderV, gStyles.shadow]}
            >
              <View row centerV marginT-10>
                <InputLabel text="Hợp đồng" />
                <TouchableOpacity
                  row
                  flex-2
                  centerV
                  paddingT-5
                  paddingL-6
                  onPress={() =>
                    navigation.navigate("ContractDetails", {
                      contract: deliveryDetails.contract,
                    })
                  }
                >
                  <Text flex stateBlueDefault>
                    {deliveryDetails.contract.code.toUpperCase()}
                  </Text>
                  <ChevronRightSmall fill={Colors.stateBlueDefault} />
                </TouchableOpacity>
              </View>

              <View row centerV marginT-10>
                <InputLabel text="Khách hàng" />
                <TouchableOpacity
                  row
                  flex-2
                  centerV
                  paddingT-5
                  paddingL-6
                  onPress={() =>
                    navigation.navigate("CustomerDetails", {
                      customer: deliveryDetails.contract.customer,
                    })
                  }
                >
                  <Text flex stateBlueDefault>
                    {getCustomerName(deliveryDetails.contract.customer)}
                  </Text>
                  <ChevronRightSmall fill={Colors.stateBlueDefault} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View
              bg-surface
              paddingH-16
              paddingT-8
              paddingB-16
              marginB-12
              style={[gStyles.borderV, gStyles.shadow]}
            >
              <TextRow
                left="Hợp đồng"
                right={deliveryDetails.contract.code.toUpperCase()}
              />

              <TextRow
                left="Khách hàng"
                right={getCustomerName(deliveryDetails.contract.customer)}
              />
            </View>
          )}

          <View
            bg-surface
            paddingH-16
            paddingT-8
            paddingB-16
            style={[gStyles.borderV, gStyles.shadow]}
          >
            <ProductImage
              uri={
                deliverySchedule.allocation.favoriteProduct.favoriteModel.model
                  .photo.url
              }
              name={deliverySchedule.allocation.favoriteProduct.product.name}
            />
            {information.map((e) => (
              <TextRow key={e.label} left={e.label} right={e.value} />
            ))}

            {deliveryDetails.completionState === "completed" && (
              <View row centerV marginT-5 style={gStyles.minHeight32}>
                <InputLabel text="Hình ảnh giao xe" />
                <Button flex-2 link paddingL-8 onPress={toGallery}>
                  <Text flex stateBlueDefault>
                    {Number(deliveryDetails.files?.length)} hình ảnh
                  </Text>
                  <ChevronRightSmall fill={Colors.stateBlueDefault} />
                </Button>
              </View>
            )}
          </View>

          {deliverySchedule.state === DeliveryStateObject.rejected && (
            <Button
              borderRadius={4}
              marginH-16
              marginT-16
              outline
              outlineColor={Colors.primary900}
              paddingV-16
              onPress={handleReasonRejectPressed}
            >
              <Text button primary900>
                Xem lý do từ chối
              </Text>
            </Button>
          )}

          {renderButton()}
        </View>

        {renderApprovalButton()}
      </View>
    </BasePage>
  );
};

DeliveryScheduleDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      deliverySchedule: PropTypes.shape({
        id: PropTypes.number,
        state: PropTypes.string,
        reason: PropTypes.string,
        allocation: PropTypes.shape({
          favoriteProduct: PropTypes.shape({
            favoriteModel: PropTypes.shape({
              model: PropTypes.shape({
                photo: PropTypes.shape({
                  url: PropTypes.string,
                }),
              }),
            }),
            product: PropTypes.shape({
              name: PropTypes.string,
            }),
          }),
        }),
      }),
      canRedirect: PropTypes.bool,
    }),
  }),
};

export default DeliveryScheduleDetails;
