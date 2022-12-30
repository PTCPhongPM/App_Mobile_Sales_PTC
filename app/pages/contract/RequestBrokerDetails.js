import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Button, Colors, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";
import Headline from "../../components/Header/Headline";
import TextRow from "../../components/TextRow";

import { useNotification } from "../../providers/NotificationProvider";
import {
  useDeleteRequestBrokerMutation,
  useGetRequestBrokerQuery,
} from "../../store/api/request";

import { showDeleteAlert } from "../../helper/alert";
import { dateFormatter } from "../../helper/utils";
import { Delete, Edit } from "../../configs/assets";

const RequestBrokerDetails = ({ navigation, route: { params } }) => {
  const { requestBroker } = params;
  const notification = useNotification();

  const { data: fetchedData, isFetching } = useGetRequestBrokerQuery({
    id: requestBroker.id,
  });

  const [
    deleteRequestBroker,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess },
  ] = useDeleteRequestBrokerMutation();

  const data = useMemo(
    () => fetchedData || requestBroker,
    [requestBroker, fetchedData]
  );

  const loading = isFetching || isDeleting;

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  const handleEditPressed = useCallback(() => {
    navigation.navigate("RequestBrokerEditor", { requestBroker: data });
  }, [data, navigation]);

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá phụ kiện hãng",
        "Bạn có chắc chắn muốn xoá phụ kiện hãng này?",
        () => deleteRequestBroker({ id: requestBroker.id })
      ),
    [deleteRequestBroker, requestBroker.id]
  );

  const info = useMemo(() => {
    return [
      {
        label: "Họ và tên",
        value: data.brokerInfo.name,
      },
      {
        label: "CMT/CCCD",
        value: data.brokerInfo.citizenIdentity,
      },
      {
        label: "Nơi cấp",
        value: data.brokerInfo.issuedPlace,
      },
      {
        label: "Ngày cấp",
        value: dateFormatter(data.brokerInfo.issuedDate),
      },
      {
        label: "Quan hệ với KH",
        value: data.brokerInfo.relationship,
      },
      {
        label: "Số điện thoại",
        value: data.brokerInfo.phoneNumber,
      },
      {
        label: "Địa chỉ",
        value: data.brokerInfo.address,
      },
      {
        label: "Ngân hàng",
        value: data.brokerInfo.bank?.name,
      },
      {
        label: "Số tài khoản",
        value: data.brokerInfo.bankAccount,
      },
    ];
  }, [data]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View row>
          <Button
            link
            paddingH-8
            disabled={loading}
            onPress={handleEditPressed}
          >
            <Edit fill={Colors.white} />
          </Button>
          <Button
            link
            paddingR-16
            paddingL-8
            disabled={loading}
            onPress={handleDelete}
          >
            <Delete fill={Colors.white} />
          </Button>
        </View>
      ),
    });
  }, [handleDelete, handleEditPressed, loading, navigation]);

  return (
    <BasePage hasScroll={false} loading={loading}>
      <Headline label="Thông tin môi giới" />
      <View bg-surface padding-16>
        {info.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>
      <Headline label="Hoa hồng" />
      <View bg-surface padding-16>
        <TextRow left="Giá trị" right={data.amount} />
        <TextRow left="Ghi chú" right={data.note} />
      </View>
    </BasePage>
  );
};

RequestBrokerDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      requestBroker: PropTypes.object,
    }),
  }),
};

export default RequestBrokerDetails;
