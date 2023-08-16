import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Alert, StyleSheet } from "react-native";
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

import { ChevronRightSmall, Edit, More, Print } from "../../configs/assets";

import { showDeleteAlert } from "../../helper/alert";
import {
  formatDate,
  formatTime,
  getCustomerName,
  getFile,
} from "../../helper/utils";
import { useNotification } from "../../providers/NotificationProvider";

import {
  useApproveTestDriveMutation,
  useDeleteTestDriveMutation,
  useGetTestDriveQuery,
  useSendTestDriveToApproverMutation,
} from "../../store/api/testDrive";

import gStyles from "../../configs/gStyles";
import { TestDriveStateObject, TestDriveStates } from "../../helper/constants";
import { useDirectorRole } from "../../helper/hooks";
import { downloadPDF } from "../../helper/file";

const styles = StyleSheet.create({
  br2: {
    borderRadius: 2,
  },
});

const TestDriveDetails = ({ navigation, route: { params } }) => {
  const notification = useNotification();
  const { testDrive, moveToCustomer = true, isNotMe } = params;

  const isDirector = useDirectorRole();

  const [actionSheetShown, setActionSheetShown] = useState(false);

  const { data, isFetching } = useGetTestDriveQuery({
    id: testDrive.id,
  });

  const testDriveDetails = useMemo(() => data || testDrive, [data, testDrive]);
  const [isExporting, setIsExporting] = useState(false);

  const [deleteTestDrive, { isSuccess, isLoading }] =
    useDeleteTestDriveMutation();

  const [
    sendTestDriveToApprover,
    { isSuccess: isSendToApproverSuccess, isLoading: isSending },
  ] = useSendTestDriveToApproverMutation();

  const [
    approveTestDrive,
    { isSuccess: isApproveSuccess, isLoading: isApproving },
  ] = useApproveTestDriveMutation();

  const loading = isLoading || isFetching || isSending || isApproving || isExporting;

  const handleDeleteTestDrive = useCallback(
    () =>
      showDeleteAlert(
        "Xoá lịch lái thử",
        "Bạn có chắc chắn muốn xoá lịch lái thử?",
        () => deleteTestDrive({ id: testDriveDetails.id })
      ),
    [deleteTestDrive, testDriveDetails.id]
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const toTestDriveIncompleteEditor = useCallback(
    () =>
      navigation.navigate("TestDriveIncompleteEditor", {
        testDrive: testDriveDetails,
      }),
    [navigation, testDriveDetails]
  );

  const toTestDriveComplete = useCallback(
    () =>
      navigation.navigate("TestDriveCompleteEditor", {
        testDrive: testDriveDetails,
      }),
    [navigation, testDriveDetails]
  );

  const handleEditTestDrive = useCallback(
    () =>
      navigation.navigate("TestDriveEditor", {
        customer: testDriveDetails.customer,
        testDrive: testDriveDetails,
      }),
    [navigation, testDriveDetails]
  );

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (isSendToApproverSuccess) {
      notification.showMessage("Gửi duyệt thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSendToApproverSuccess]);

  useEffect(() => {
    if (isApproveSuccess) {
      notification.showMessage("Phê duyệt thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess]);

  const contextActions = useMemo(
    () => [
      {
        title: "Gửi duyệt",
        onPress: () =>
          sendTestDriveToApprover({
            id: testDriveDetails.id,
          }),
      },
      {
        title: "Xuất PDF",
        // todo
        onPress: async () => {
          setIsExporting(true);
          await downloadPDF("/testdrive/pdf", "testdrive", {
            id: testDriveDetails.id,
            template: 'testdrive',
          });
          setIsExporting(false);
        },
      },
      {
        title: "Xóa lịch",
        destructive: true,
        onPress: handleDeleteTestDrive,
      },
    ],
    [handleDeleteTestDrive, sendTestDriveToApprover, testDriveDetails.id]
  );

  const rejectContextActions = useMemo(
    () => [
      {
        title: "In phiếu",
        // todo
        onPress: () => {},
      },
      {
        title: "Xóa lịch",
        destructive: true,
        onPress: handleDeleteTestDrive,
      },
    ],
    [handleDeleteTestDrive]
  );

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => {
      contextActions[index].onPress();
    },
    [contextActions]
  );

  const handelRejectMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => {
      rejectContextActions[index].onPress();
    },
    [rejectContextActions]
  );
  const exportPdf=async ()=>{
    setIsExporting(true);
          await downloadPDF("/testdrive/pdf", "testdrive", {
            id: testDriveDetails.id,
            template: 'testdrive',
          });
          setIsExporting(false);
  }
  useEffect(() => {
    if (testDrive.state === TestDriveStateObject.draft) {
      navigation.setOptions({
        headerRight: () => (
          <View row right>
            <Button
              link
              disabled={loading}
              paddingR-8
              onPress={handleEditTestDrive}
            >
              <Edit fill={Colors.white} />
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
    } else if (testDrive.state === TestDriveStateObject.rejected) {
      navigation.setOptions({
        headerRight: () => (
          <View row right>
            <ContextMenu
              actions={rejectContextActions}
              dropdownMenuMode={true}
              previewBackgroundColor="transparent"
              onPress={handelRejectMenuPressed}
            >
              <View paddingR-16 paddingL-8>
                <More fill={Colors.white} />
              </View>
            </ContextMenu>
          </View>
        ),
      });
    } else if (
      [
        TestDriveStateObject.approved,
        TestDriveStateObject.done,
        TestDriveStateObject.incomplete,
      ].includes(testDrive.state)
    ) {
      navigation.setOptions({
        headerRight: () => (
          <Button link disabled={loading} paddingR-16 onPress={exportPdf}>
            <Print fill={Colors.white} />
          </Button>
        ),
      });
    } else {
      navigation.setOptions({
        headerRight: null,
      });
    }
  }, [
    contextActions,
    handelMenuPressed,
    handelRejectMenuPressed,
    handleEditTestDrive,
    loading,
    navigation,
    rejectContextActions,
    testDrive.state,
  ]);

  const information = useMemo(() => {
    const arr = [
      {
        label: "Ngày hẹn",
        value: formatDate(testDriveDetails.drivingDate),
      },
      {
        label: "Bắt đầu",
        value: formatTime(testDriveDetails.startingTime),
      },
      {
        label: "Kết thúc",
        value: formatTime(testDriveDetails.endingTime),
      },
      {
        label: "Người hỗ trợ",
        value: testDriveDetails.supporter?.name,
      },
      // {
      //   label: "Địa điểm",
      //   value: testDriveDetails.place,
      // },
      {
        label: "Cung đường",
        value: testDriveDetails.road,
      },
      {
        label: "Ghi chú",
        value: testDriveDetails.note,
      },
    ];

    if (testDriveDetails.state === TestDriveStateObject.done) {
      arr.push({
        label: "Trạng thái",
        value: TestDriveStates.done,
      });
      arr.push({
        label: "Ý kiến khách hàng",
        value: testDriveDetails.review,
      });
    }

    if (testDriveDetails.state === TestDriveStateObject.incomplete) {
      arr.push({
        label: "Trạng thái",
        value: TestDriveStates.incomplete,
      });
      arr.push({
        label: "Lý do",
        value: testDriveDetails.incompleteReason,
      });
    }

    return arr;
  }, [
    testDriveDetails.drivingDate,
    testDriveDetails.endingTime,
    testDriveDetails.incompleteReason,
    testDriveDetails.note,
    testDriveDetails.place,
    testDriveDetails.review,
    testDriveDetails.road,
    testDriveDetails.startingTime,
    testDriveDetails.state,
    testDriveDetails.supporter?.name,
  ]);

  const files = useMemo(
    () => ({
      identityCardFront: getFile(testDriveDetails.files, "identityCardFront"),
      identityCardBack: getFile(testDriveDetails.files, "identityCardBack"),
      driveLicenseFront: getFile(testDriveDetails.files, "driveLicenseFront"),
      driveLicenseBack: getFile(testDriveDetails.files, "driveLicenseBack"),
      disclaimers: (
        testDriveDetails.files?.filter((e) => e.type === "disclaimers") || []
      ).map((e) => ({ ...e.file, fileType: "disclaimers" })),
      other: (
        testDriveDetails.files?.filter((e) => e.type === "other") || []
      ).map((e) => ({ ...e.file, fileType: "other" })),
    }),
    [testDriveDetails.files]
  );

  const handlePhotoPressed = useCallback(() => {
    navigation.navigate("PhotoEditor", {
      customer: testDriveDetails.customer,
      files,
      testDrive: data,
      viewOnly: true,
    });
  }, [data, files, navigation, testDriveDetails.customer]);

  const toCustomerPage = useCallback(
    () =>
      navigation.navigate("CustomerDetails", {
        customer: testDriveDetails.customer,
      }),
    [navigation, testDriveDetails.customer]
  );

  const handleReject = useCallback(
    () =>
      navigation.navigate("ReasonRejectEditor", {
        id: testDriveDetails.id,
        type: "testDrive",
      }),
    [navigation, testDriveDetails.id]
  );

  const handleApprove = useCallback(
    () =>
      Alert.alert(
        "Phê duyệt lịch lái thử?",
        "Bạn sẽ phê duyệt lịch lái thử này cho nhân viên kinh doanh",
        [
          {
            text: "Trở lại",
            style: "cancel",
          },
          {
            text: "Đồng ý",
            onPress: () => approveTestDrive({ id: testDriveDetails.id }),
          },
        ],
        { cancelable: true }
      ),
    [approveTestDrive, testDriveDetails.id]
  );

  return (
    <BasePage loading={loading}>
      <View flex spread>
        <View bg-surface paddingV-16 style={[gStyles.borderV, gStyles.shadow]}>
          <View center paddingV-8 row>
            <ProductImage
              uri={testDriveDetails.testProduct?.product?.photo?.url}
              name={testDriveDetails.testProduct?.model?.description + '-' + testDriveDetails.testProduct?.product?.name}
            />
          </View>
          <View bg-surface paddingH-16 paddingT-8>
            <View row centerV>
              <InputLabel text="Khách hàng" />
              <TouchableOpacity
                row
                flex-2
                centerV
                paddingT-5
                paddingL-6
                disabled={!moveToCustomer}
                onPress={moveToCustomer ? toCustomerPage : undefined}
              >
                <Text flex stateBlueDefault={moveToCustomer}>
                  {getCustomerName(testDriveDetails.customer)}
                </Text>
                {moveToCustomer && (
                  <ChevronRightSmall
                    fill={
                      moveToCustomer
                        ? Colors.stateBlueDefault
                        : Colors.textBlackMedium
                    }
                  />
                )}
              </TouchableOpacity>
            </View>

            <View row centerV marginT-8>
              <InputLabel text="Hình ảnh giấy tờ" />
              <TouchableOpacity
                row
                flex-2
                centerV
                paddingT-5
                paddingL-6
                onPress={handlePhotoPressed}
              >
                <Text flex stateBlueDefault>
                  {Number(testDriveDetails.files?.length)} hình ảnh
                </Text>
                <ChevronRightSmall fill={Colors.stateBlueDefault} />
              </TouchableOpacity>
            </View>

            {information.map((e) => (
              <TextRow key={e.label} left={e.label} right={e.value} />
            ))}
          </View>
        </View>

        {testDriveDetails.state === TestDriveStateObject.approved && 
          !isDirector && !isNotMe &&(
            <View paddingH-16 paddingT-10 bg-surface>
              <Button
                bg-primary900
                disabled={loading}
                fullWidth
                paddingV-16
                style={styles.br2}
                onPress={handleActionSheetShow}
              >
                <Text button textWhiteHigh>
                  Cập nhật
                </Text>
              </Button>
              <ActionSheet
                useNativeIOS
                useSafeArea
                destructiveButtonIndex={2}
                cancelButtonIndex={2}
                title="Cập nhật tình trạng lái thử"
                visible={actionSheetShown}
                options={[
                  {
                    label: "Không hoàn thành",
                    onPress: toTestDriveIncompleteEditor,
                  },
                  {
                    label: "Hoàn thành",
                    onPress: toTestDriveComplete,
                  },
                  {
                    label: "Trở lại",
                  },
                ]}
                onDismiss={handleActionSheetDismiss}
              />
            </View>
          )}

        {isDirector &&
          testDriveDetails.state === TestDriveStateObject.created && (
            <ApprovalButtons
              onReject={handleReject}
              onApprove={handleApprove}
            />
          )}
      </View>
    </BasePage>
  );
};

TestDriveDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      moveToCustomer: PropTypes.bool,
      testDrive: PropTypes.shape({
        id: PropTypes.number,
        state: PropTypes.string,
        files: PropTypes.array,
      }),
    }),
  }),
};

export default TestDriveDetails;
