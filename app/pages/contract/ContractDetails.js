import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { Alert, ScrollView } from "react-native";
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

import BasePage from "../../components/Base/BasePage";
import ApprovalButtons from "../../components/Button/ApprovalButtons";
import NormalChip from "../../components/Chip/NormalChip";
import StateChip from "../../components/Chip/StateChip";

import { Edit, More } from "../../configs/assets";
import { useNotification } from "../../providers/NotificationProvider";

import gStyles from "../../configs/gStyles";
import {
  ContractCancelStateObject,
  ContractStateObject,
} from "../../helper/constants";
import { useDirectorRole } from "../../helper/hooks";

import {
  useApproveContractMutation,
  useConfirmCancelContractMutation,
  useGetContractQuery,
  useGetContractTemplatesQuery,
  useSendContractToApproverMutation,
  useUnConfirmCancelContractMutation,
} from "../../store/api/contract";

import { getLoadState } from "../../store/slices/file";

import { downloadPDF } from "../../helper/file";
import ContractCustomerTab from "./tabs/ContractCustomerTab";
import ContractDeliveryTab from "./tabs/ContractDeliveryTab";
import ContractDetailsTab from "./tabs/ContractDetailsTab";
import ContractGallery from "./tabs/ContractGallery";
import ContractProductTab from "./tabs/ContractProductTab";

const tabs = [
  { label: "Thông tin HĐ", component: ContractDetailsTab },
  { label: "Thông tin KH", component: ContractCustomerTab },
  { label: "Thông tin xe", component: ContractProductTab },
  { label: "Lịch giao xe", component: ContractDeliveryTab },
  { label: "Thư viện", component: ContractGallery },
];

const ContractDetails = ({ navigation, route }) => {
  const { contract, hasBottomActions } = route.params;

  const fileLoading = useSelector(getLoadState);

  const notification = useNotification();
  const isDirector = useDirectorRole();

  const [dialogShown, setDialogShown] = useState(false);

  const { data, isFetching, refetch } = useGetContractQuery({
    id: contract.id,
  });

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [sendContractToApprover, { isLoading: isSending, isSuccess: isSent }] =
    useSendContractToApproverMutation();

  const [approveContract, { isLoading: isApproving, isSuccess: isApproved }] =
    useApproveContractMutation();

  const [
    confirmCancelContract,
    { isLoading: isConfirming, isSuccess: isConfirmSuccess },
  ] = useConfirmCancelContractMutation();

  const [
    unConfirmCancelContract,
    { isLoading: isUnConfirming, isSuccess: isUnConfirmSuccess },
  ] = useUnConfirmCancelContractMutation();

  const { data: templates = [] } = useGetContractTemplatesQuery();

  const loading =
    isFetching ||
    isSending ||
    isApproving ||
    fileLoading ||
    isConfirming ||
    isUnConfirming ||
    isExporting;

  const contractDetails = useMemo(() => data || contract, [data, contract]);

  useEffect(() => {
    if (isSent) {
      notification.showMessage("Gửi duyệt thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSent]);

  useEffect(() => {
    if (isApproved || isConfirmSuccess || isUnConfirmSuccess) {
      notification.showMessage("Phê duyệt thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproved, isConfirmSuccess, isUnConfirmSuccess, navigation]);

  const handleEditPressed = useCallback(
    () => navigation.navigate("ContractEditor", { contract: contractDetails }),
    [contractDetails, navigation]
  );

  const handleCancelContract = useCallback(
    () => navigation.navigate("ContractCancelEditor", { contract }),
    [contract, navigation]
  );

  const handleApproval = useCallback(
    () =>
      sendContractToApprover({
        id: contractDetails.id,
      }),
    [contractDetails.id, sendContractToApprover]
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const contextActions = useMemo(() => {
    const arr = [];

    if (contractDetails.state === ContractStateObject.draft) {
      arr.push({
        title: "Gửi duyệt",
        onPress: handleApproval,
      });
    }

    arr.push({
      title: "Xuất PDF",
      onPress: handleActionSheetShow,
    });

    if (contractDetails.state === ContractStateObject.approved) {
      if (
        !contractDetails.cancelState ||
        contractDetails.cancelState === ContractCancelStateObject.unconfirmed
      ) {
        arr.push({
          title: "Hủy hợp đồng",
          destructive: true,
          onPress: handleCancelContract,
        });
      }
    }

    return arr;
  }, [
    contractDetails.cancelState,
    contractDetails.state,
    handleActionSheetShow,
    handleApproval,
    handleCancelContract,
  ]);

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => {
      contextActions[index].onPress();
    },
    [contextActions]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (
          !isDirector &&
          contractDetails.state !== ContractStateObject.draft
        ) {
          return (
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
          );
        }

        return (
          <View row>
            <Button link paddingH-8 onPress={handleEditPressed}>
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
        );
      },
    });
  }, [
    contextActions,
    contractDetails,
    handelMenuPressed,
    handleEditPressed,
    isDirector,
    navigation,
  ]);

  const handleReject = useCallback(() => {
    if (
      contractDetails.state === ContractStateObject.approved &&
      contractDetails.cancelState === ContractCancelStateObject.pending
    ) {
      unConfirmCancelContract({
        id: contractDetails.id,
      });
    } else {
      navigation.navigate("ReasonRejectEditor", {
        id: contractDetails.id,
        type: "contract",
      });
    }
  }, [
    contractDetails.cancelState,
    contractDetails.id,
    contractDetails.state,
    navigation,
    unConfirmCancelContract,
  ]);

  const handleApprove = useCallback(
    () =>
      Alert.alert(
        "Phê duyệt hợp đồng?",
        "Bạn sẽ phê duyệt thao tác này của nhân viên kinh doanh",
        [
          {
            text: "Trở lại",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => {
              if (
                contractDetails.state === ContractStateObject.approved &&
                contractDetails.cancelState ===
                  ContractCancelStateObject.pending
              ) {
                confirmCancelContract({
                  id: contractDetails.id,
                });
              } else {
                approveContract({
                  id: contractDetails.id,
                });
              }
            },
          },
        ],
        { cancelable: true }
      ),
    [
      approveContract,
      confirmCancelContract,
      contractDetails.cancelState,
      contractDetails.id,
      contractDetails.state,
    ]
  );

  const toggleDialog = useCallback(() => setDialogShown((pre) => !pre), []);

  const actionSheetOptions = useMemo(() => {
    const arr = templates.map((template) => ({
      label: template.name,
      onPress: async () => {
        setIsExporting(true);
        await downloadPDF("/contract/pdf", "contract", {
          id: contract.id,
          code: contract.code,
          template: template.code,
        });
        setIsExporting(false);
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [contract.code, contract.id, templates]);

  const renderApprovalButtons = useCallback(() => {
    if (
      contractDetails.state === ContractStateObject.pending ||
      contractDetails.cancelState === ContractCancelStateObject.pending
    )
      return (
        <ApprovalButtons onReject={handleReject} onApprove={handleApprove} />
      );

    return null;
  }, [
    contractDetails.cancelState,
    contractDetails.state,
    handleApprove,
    handleReject,
  ]);

  return (
    <BasePage hasScroll={false}>
      <View padding-16 paddingT-4 row bg-primary900>
        <View flex>
          <Text subtitle1 uppercase textWhiteHigh>
            {contractDetails.code}
          </Text>
          <View row>
            {[
              contractDetails.paymentMethod,
              contractDetails.request?.buyingType,
            ].map((e, index) => (
              <NormalChip marginR-4 key={`${e}-${index}`} label={e} />
            ))}

            <StateChip state={contractDetails.state} />
          </View>
        </View>
        {isDirector && (
          <TouchableOpacity onPress={toggleDialog}>
            <Avatar
              name={contractDetails.account?.name}
              resizeMode="cover"
              size={40}
              source={{ uri: contractDetails.account?.avatar?.url }}
            />
          </TouchableOpacity>
        )}

        <View />
      </View>
      <TabController items={tabs}>
        <ScrollView scrollEnabled={false} style={gStyles.tabBarScroll}>
          <TabController.TabBar faderProps={{ size: 0 }} />
        </ScrollView>
        <View flex style={gStyles.borderT}>
          {tabs.map(({ label, component: TabPanel }, index) => (
            <TabController.TabPage
              key={label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <TabPanel
                contract={contractDetails}
                hasBottomActions={hasBottomActions}
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
        title="Chọn mẫu hợp đồng trước khi tạo PDF"
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />

      {isDirector && renderApprovalButtons()}
      {isDirector && (
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
                source={{ uri: contractDetails.account?.avatar?.url }}
                size={56}
                name={contractDetails.account?.name}
                resizeMode="cover"
              />

              <View flex marginL-8>
                <Text style={gStyles.capitalize}>
                  {contractDetails.account?.name}
                </Text>
                <Text body2>{contractDetails.account?.email}</Text>
              </View>
            </View>
          </View>
        </Dialog>
      )}
    </BasePage>
  );
};

ContractDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      contract: PropTypes.object,
      hasBottomActions: PropTypes.bool,
    }),
  }),
};

export default ContractDetails;
