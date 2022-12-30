import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigation } from "@react-navigation/native";

import { ActionSheet, Button, Colors, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../../components/Base/BasePage";
import HorizontalButtonTab from "../../../components/Button/HorizontalButtonTab";
import QuotationCard from "../../../components/Card/QuotationCard";
import RequestCard from "../../../components/Card/RequestCard";
import Headline from "../../../components/Header/Headline";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import {
  SolidDelete,
  SolidDescription,
  SolidPDF,
} from "../../../configs/assets";

import gStyles from "../../../configs/gStyles";
import {
  useDeleteQuotationMutation,
  useGetQuotationListAllQuery,
  useGetQuotationTemplatesQuery,
} from "../../../store/api/quotation";

import { showDeleteAlert } from "../../../helper/alert";
import { RequestStateObject } from "../../../helper/constants";
import { downloadPDF } from "../../../helper/file";
import { checkSaleActive, formatDate } from "../../../helper/utils";
import { useNotification } from "../../../providers/NotificationProvider";
import {
  useDeleteRequestMutation,
  useDuplicateRequestMutation,
  useGetRequestListAllQuery,
  useGetRequestTemplatesQuery,
} from "../../../store/api/request";

const RequestSwipeWrapper = ({ children, onDelete }) => (
  <SwipeWrapper
    leftActions={[
      {
        text: "Xoá",
        color: Colors.stateRedDefault,
        icon: <SolidDelete fill={Colors.surface} />,
        onPress: onDelete,
      },
    ]}
  >
    {children}
  </SwipeWrapper>
);

const Request = ({ customer }) => {
  const navigation = useNavigation();
  const notification = useNotification();
  const sale = customer.sales[0];

  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedQuotation, setSelectedQuotation] = useState({});
  const [selectedRequest, setSelectedRequest] = useState({});

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [requestActionSheetShown, setRequestActionSheetShown] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);

  const {
    data: requests = [],
    isFetching: isFetchingRequests,
    refetch,
  } = useGetRequestListAllQuery({ saleId: sale?.id }, { skip: !sale?.id });

  const [
    deleteRequest,
    { isLoading: isRequestDeleting, isSuccess: isDeleteRequestSuccess },
  ] = useDeleteRequestMutation();

  const [
    duplicateRequest,
    { isLoading: isDuplicating, isSuccess: isDuplicated },
  ] = useDuplicateRequestMutation();

  const {
    data: quotations = [],
    isFetching: isFetchingQuotations,
    refetch: refetchQuotation,
  } = useGetQuotationListAllQuery({ saleId: sale?.id }, { skip: !sale?.id });

  const [
    deleteQuotation,
    { isLoading: isQuotationDeleting, isSuccess: isDeleteQuotationSuccess },
  ] = useDeleteQuotationMutation();

  const { data: templates = [] } = useGetQuotationTemplatesQuery();
  const { data: requestTemplates = [] } = useGetRequestTemplatesQuery();

  const loading =
    isFetchingQuotations ||
    isFetchingRequests ||
    isRequestDeleting ||
    isQuotationDeleting ||
    isDownloading ||
    isDuplicating;

  useEffect(() => {
    if (isDeleteRequestSuccess) {
      notification.showMessage(
        "Xoá đề xuất bán hàng thành công",
        Toast.presets.SUCCESS
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteRequestSuccess]);

  useEffect(() => {
    if (isDuplicated) {
      notification.showMessage("Nhân bản thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDuplicated]);

  useEffect(() => {
    if (isDeleteQuotationSuccess) {
      notification.showMessage("Xoá báo giá thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteQuotationSuccess]);

  const count = useMemo(() => {
    if (!requests) return null;

    const obj = {
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
      completed: 0,
    };

    requests.forEach((e) => obj[e.state]++);
    return obj;
  }, [requests]);

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

  const handleCreateRequest = useCallback(
    () => navigation.navigate("RequestEditor", { customer }),
    [customer, navigation]
  );

  const handleCreateQuotation = useCallback(
    () => navigation.navigate("QuotationEditor", { customer }),
    [customer, navigation]
  );

  const list = useMemo(() => {
    if (isFetchingRequests) return [];
    if (selectedTab === "all") return requests;

    return requests.filter((item) => item.state === selectedTab);
  }, [isFetchingRequests, requests, selectedTab]);

  const handleQuotationPressed = useCallback(
    (quotation) =>
      navigation.navigate("QuotationDetails", { quotation, customer }),
    [customer, navigation]
  );

  const handleRequestsPressed = useCallback(
    (request) => navigation.navigate("RequestDetails", { request, customer }),
    [customer, navigation]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(() => {
    setActionSheetShown(false);
    setRequestActionSheetShown(false);
  }, []);

  const actionSheetOptions = useMemo(() => {
    const arr = templates.map((template) => ({
      label: template.name,
      onPress: async () => {
        setIsDownloading(true);
        await downloadPDF("/quotation/pdf", "quotation", {
          code: selectedQuotation.code,
          id: selectedQuotation.id,
          template: template.code,
        });
        setIsDownloading(false);
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [selectedQuotation.code, selectedQuotation.id, templates]);

  const requestActionSheetOptions = useMemo(() => {
    const arr = requestTemplates.map((template) => ({
      label: template.name,
      onPress: async () => {
        setIsDownloading(true);
        await downloadPDF("/request/pdf", "quotation", {
          code: selectedRequest.code,
          id: selectedRequest.id,
          template: template.code,
        });
        setIsDownloading(false);
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [requestTemplates, selectedRequest.code, selectedRequest.id]);

  const renderRequest = useCallback(
    (request) => {
      const rightActions = [];
      const leftActions = [
        {
          text: "Duplicate",
          color: Colors.stateOrangeDefault,
          icon: <SolidDescription fill={Colors.surface} />,
          onPress: () =>
            duplicateRequest({
              id: request.id,
            }),
        },
      ];

      if (isSaleActive) {
        if (
          request.state === RequestStateObject.draft ||
          request.state === RequestStateObject.rejected
        ) {
          rightActions.push({
            text: "Xoá",
            color: Colors.stateRedDefault,
            icon: <SolidDelete fill={Colors.surface} />,
            onPress: () =>
              showDeleteAlert(
                "Xoá đề xuất bán hàng",
                "Bạn có chắc chắn muốn xoá đề xuất bán hàng?",
                () =>
                  deleteRequest({
                    id: request.id,
                  })
              ),
          });
        }

        if (request.state === RequestStateObject.approved) {
          rightActions.push({
            text: "Xuất PDF",
            color: Colors.stateBlueDefault,
            icon: <SolidPDF fill={Colors.surface} />,
            onPress: () => {
              setSelectedRequest(request);
              setRequestActionSheetShown(true);
            },
          });
        }
      }

      return (
        <SwipeWrapper
          key={request.id}
          leftActions={leftActions}
          rightActions={rightActions}
        >
          <RequestCard
            request={request}
            onPress={() => handleRequestsPressed(request)}
          />
        </SwipeWrapper>
      );
    },
    [deleteRequest, duplicateRequest, handleRequestsPressed, isSaleActive]
  );

  const renderQuotation = useCallback(
    (quotation) => (
      <SwipeWrapper
        key={quotation.id}
        rightActions={[
          {
            text: "Xuất PDF",
            color: Colors.stateBlueDefault,
            icon: <SolidPDF fill={Colors.surface} />,
            onPress: () => {
              setSelectedQuotation(quotation);
              handleActionSheetShow();
            },
          },
        ]}
        leftActions={[
          {
            text: "Xoá",
            color: Colors.stateRedDefault,
            icon: <SolidDelete fill={Colors.surface} />,
            onPress: () =>
              showDeleteAlert(
                "Xoá báo giá?",
                "Hành động này không thể hoàn tác",
                () => deleteQuotation({ id: quotation.id })
              ),
          },
        ]}
      >
        <QuotationCard
          title={quotation.code}
          time={formatDate(quotation.createdAt)}
          car={quotation.favoriteProduct.favoriteModel.model.description}
          onPress={() => handleQuotationPressed(quotation)}
        />
      </SwipeWrapper>
    ),
    [deleteQuotation, handleActionSheetShow, handleQuotationPressed]
  );

  return (
    <BasePage loading={loading}>
      <Headline
        label="Đề xuất"
        marginT-8
        onPress={
          Boolean(requests.length) && isSaleActive ? handleCreateRequest : null
        }
      />

      {requests.length ? (
        <>
          <HorizontalButtonTab
            buttons={buttons}
            selected={selectedTab}
            onPress={(id) => {
              setSelectedTab(id);
              refetch();
              refetchQuotation();
            }}
          />
          {list.map(renderRequest)}
        </>
      ) : (
        <View
          paddingV-16
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa có đề xuất!
          </Text>
          <Button
            borderRadius={4}
            outline
            outlineColor={Colors.primary900}
            marginT-8
            onPress={handleCreateRequest}
          >
            <Text primary900 button>
              Tạo đề xuất
            </Text>
          </Button>
        </View>
      )}

      <Headline
        label="Báo giá"
        onPress={
          Boolean(quotations.length) && isSaleActive
            ? handleCreateQuotation
            : null
        }
      />

      {quotations.length ? (
        <View style={[gStyles.borderV, gStyles.shadow]}>
          {quotations.map(renderQuotation)}
        </View>
      ) : (
        <View
          paddingV-16
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa có báo giá!
          </Text>
          <Button
            borderRadius={4}
            outline
            outlineColor={Colors.primary900}
            marginT-8
            onPress={handleCreateQuotation}
          >
            <Text primary900 button>
              Tạo báo giá
            </Text>
          </Button>
        </View>
      )}

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        title="Chọn mẫu báo giá bạn muốn tạo PDF"
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={requestActionSheetOptions.length}
        title="Chọn mẫu đề xuất bạn muốn tạo PDF"
        visible={requestActionSheetShown}
        options={requestActionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </BasePage>
  );
};

RequestSwipeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};

Request.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number,
    sales: PropTypes.array,
  }),
};

export default Request;
