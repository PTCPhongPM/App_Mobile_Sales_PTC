import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ContextMenu from "react-native-context-menu-view";
import {
  ActionSheet,
  Avatar,
  Button,
  Colors,
  Dialog,
  LoaderScreen,
  TabController,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import { Alert, Linking } from "react-native";
import { Edit, More, SolidPhone } from "../../configs/assets";
import { showDeleteAlert } from "../../helper/alert";
import {
  useApproveRequestMutation,
  useDeleteRequestMutation,
  useGetRequestQuery,
  useGetRequestTemplatesQuery,
  useSendRequestToApproverMutation,
} from "../../store/api/request";

import { checkSaleActive } from "../../helper/utils";
import { useNotification } from "../../providers/NotificationProvider";

import { RequestStateObject } from "../../helper/constants";

import { useDirectorRole } from "../../helper/hooks";

import BasePage from "../../components/Base/BasePage";
import ApprovalButtons from "../../components/Button/ApprovalButtons";
import NormalChip from "../../components/Chip/NormalChip";
import StateChip from "../../components/Chip/StateChip";
import StateIcon from "../../components/State/StateIcon";

import gStyles from "../../configs/gStyles";

import { downloadPDF } from "../../helper/file";
import RequestCustomerDetailsTab from "./tabs/RequestCustomerDetailsTab";
import RequestProductDetailsTab from "./tabs/RequestProductDetailsTab";

const tabs = [
  { label: "Thông tin KH", component: RequestCustomerDetailsTab },
  { label: "Thông tin xe", component: RequestProductDetailsTab },
];

const RequestDetails = ({ navigation, route }) => {
  const { request, customer = {}, isNotMe } = route.params;

  const notification = useNotification();
  const isDirector = useDirectorRole();

  const [dialogShown, setDialogShown] = useState(false);

  const { data, isFetching, refetch } = useGetRequestQuery({
    id: request.id,
  });

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const requestDetails = useMemo(() => data || request, [data, request]);

  const isSaleActive = useMemo(
    () => (isDirector ? false : checkSaleActive(customer)),
    [customer, isDirector]
  );

  const [deleteRequest, { isLoading: isDeleting, isSuccess: isDeleteSuccess }] =
    useDeleteRequestMutation();

  const [
    sendRequestToApprover,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useSendRequestToApproverMutation();

  const [
    approveRequest,
    { isLoading: isApproving, isSuccess: isApproveSuccess },
  ] = useApproveRequestMutation();

  const { data: templates = [] } = useGetRequestTemplatesQuery();

  const loading =
    isFetching || isUpdating || isDeleting || isApproving || isExporting;

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage(
        "Gửi duyệt đề xuất bán hàng thành công",
        Toast.presets.SUCCESS
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage(
        "Xoá đề xuất bán hàng thành công",
        Toast.presets.SUCCESS
      );
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  useEffect(() => {
    if (isApproveSuccess) {
      notification.showMessage("Phê duyệt thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá đề xuất bán hàng",
        "Bạn có chắc chắn muốn xoá đề xuất bán hàng?",
        () => deleteRequest({ id: request.id })
      ),
    [deleteRequest, request.id]
  );

  const handleUpdate = useCallback(
    () =>
      sendRequestToApprover({
        id: requestDetails.id,
      }),
    [requestDetails.id, sendRequestToApprover]
  );

  const handleEditPressed = useCallback(
    () =>
      navigation.navigate("RequestEditor", {
        request: requestDetails,
        customer,
      }),
    [customer, requestDetails, navigation]
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const contextActions = useMemo(
    () =>
      requestDetails.state === RequestStateObject.draft
        ? [
            {
              title: "Gửi quản lý duyệt",
              onPress: handleUpdate,
            },
            {
              title: "Xuất PDF",
              onPress: handleActionSheetShow,
            },
            {
              title: "Xoá đề xuất bán hàng",
              destructive: true,
              onPress: handleDelete,
            },
          ]
        : [
            {
              title: "Xuất PDF",
              onPress: handleActionSheetShow,
            },
          ],
    [handleActionSheetShow, handleDelete, handleUpdate, requestDetails.state]
  );

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => contextActions[index].onPress(),
    [contextActions]
  );

  useEffect(() => {
    if (isSaleActive && !isDirector && !isNotMe) {
      navigation.setOptions({
        headerRight: () =>
          requestDetails.state === RequestStateObject.draft ? (
            <View row>
              <Button
                link
                paddingH-8
                disabled={loading}
                onPress={handleEditPressed}
              >
                <Edit fill={Colors.white} />
              </Button>
              <ContextMenu
                actions={contextActions}
                dropdownMenuMode
                previewBackgroundColor="transparent"
                onPress={handelMenuPressed}
              >
                <View paddingR-16 paddingL-8>
                  <More fill={Colors.surface} />
                </View>
              </ContextMenu>
            </View>
          ) : (
            <ContextMenu
              actions={contextActions}
              dropdownMenuMode
              previewBackgroundColor="transparent"
              onPress={handelMenuPressed}
            >
              <View paddingR-16 paddingL-8>
                <More fill={Colors.surface} />
              </View>
            </ContextMenu>
          ),
      });
    }
  }, [
    contextActions,
    handelMenuPressed,
    handleEditPressed,
    isDirector,
    isSaleActive,
    loading,
    navigation,
    requestDetails.state,
  ]);

  const handleReject = useCallback(
    () =>
      navigation.navigate("ReasonRejectEditor", {
        id: requestDetails.id,
        type: "request",
      }),
    [navigation, requestDetails.id]
  );

  const handleApprove = useCallback(
    () =>
      Alert.alert(
        "Phê duyệt đề xuất?",
        "Bạn sẽ phê duyệt đề xuất này cho nhân viên kinh doanh",
        [
          {
            text: "Trở lại",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => approveRequest({ id: requestDetails.id }),
          },
        ],
        { cancelable: true }
      ),
    [approveRequest, requestDetails.id]
  );

  const toggleDialog = useCallback(() => setDialogShown((pre) => !pre), []);

  const actionSheetOptions = useMemo(() => {
    const arr = templates.map((template) => ({
      label: template.name,
      onPress: async () => {
        setIsExporting(true);
        await downloadPDF("/request/pdf", "request", {
          id: request.id,
          code: request.code,
          template: template.code,
        });
        setIsExporting(false);
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [request.code, request.id, templates]);

  if (!requestDetails.account) return null;

  return (
    <BasePage hasScroll={false}>
      <View padding-16 paddingT-4 row bg-primary900>
        <View flex>
          <Text subtitle1 uppercase textWhiteHigh>
            {requestDetails.code}
          </Text>
          <View row>
            {[requestDetails.paymentMethod, requestDetails.buyingType].map(
              (e) => (
                <NormalChip marginR-4 key={e} label={e} />
              )
            )}

            <StateChip state={requestDetails.state} />
          </View>
        </View>
        {isDirector && (
          <TouchableOpacity onPress={toggleDialog}>
            <Avatar
              source={{ uri: requestDetails.account.avatar?.url }}
              size={40}
              resizeMode="cover"
              name={requestDetails.account.name}
            />
          </TouchableOpacity>
        )}

        <View />
      </View>

      <TabController items={tabs}>
        <TabController.TabBar />
        <View flex style={gStyles.borderT}>
          {tabs.map(({ label, component: TabPanel }, index) => (
            <TabController.TabPage
              key={label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <TabPanel
                navigation={navigation}
                route={route}
                request={requestDetails}
                customer={customer}
                refetch={refetch}
                loading={loading}
              />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        title="Chọn mẫu đề xuất trước khi tạo PDF"
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />

      {isDirector && requestDetails.state === RequestStateObject.pending && (
        <>
          <ApprovalButtons onReject={handleReject} onApprove={handleApprove} />
          <Dialog
            containerStyle={gStyles.dialog}
            bottom
            width="100%"
            visible={dialogShown}
            onDismiss={toggleDialog}
          >
            <View row paddingV-10 center>
              <View absL paddingH-16>
                <Button link onPress={toggleDialog}>
                  <Text button stateBlueDefault>
                    Trở lại
                  </Text>
                </Button>
              </View>
              <Text subtitle1>Nhân viên kinh doanh</Text>
            </View>
            <View padding-16>
              <Text subtitle1>Thông tin</Text>
              <View row centerV marginT-16 marginB-24>
                <Avatar
                  source={{ uri: requestDetails.account.avatar?.url }}
                  size={56}
                  resizeMode="cover"
                  name={requestDetails.account.name}
                />

                <View flex marginL-8>
                  <Text>{requestDetails.account.name}</Text>
                  <Text body2>{requestDetails.account.email}</Text>
                </View>
                <TouchableOpacity
                  disabled={!requestDetails.account.phoneNumber}
                  onPress={() =>
                    Linking.openURL(`tel:${requestDetails.sale.phoneNumber}`)
                  }
                >
                  <StateIcon
                    icon={SolidPhone}
                    color={
                      requestDetails.account.phoneNumber ? "blue" : "neutral"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Dialog>
        </>
      )}
    </BasePage>
  );
};

RequestDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      request: PropTypes.object,
    }),
  }),
};

export default RequestDetails;
