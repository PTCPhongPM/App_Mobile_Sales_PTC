import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Button, Colors, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";
import TextRow from "../../components/TextRow";

import { useNotification } from "../../providers/NotificationProvider";
import {
  useDeleteAccessoryBranchMutation,
  useGetAccessoryBranchQuery,
} from "../../store/api/request";

import { DiscountTypes, ExtendedFormalities } from "../../helper/constants";
import { Delete, Edit } from "../../configs/assets";
import { showDeleteAlert } from "../../helper/alert";
import { currencyFormatter, discountFormatter } from "../../helper/utils";

import gStyles from "../../configs/gStyles";

const BranchAccessoryDetails = ({ navigation, route: { params } }) => {
  const { branchAccessory } = params;
  const notification = useNotification();

  const { data: fetchedData, isFetching } = useGetAccessoryBranchQuery({
    id: branchAccessory.id,
  });

  const [
    deleteAccessory,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess },
  ] = useDeleteAccessoryBranchMutation();

  const data = useMemo(
    () => fetchedData || branchAccessory,
    [branchAccessory, fetchedData]
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
    navigation.navigate("BranchAccessoryEditor", { branchAccessory: data });
  }, [data, navigation]);

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá phụ kiện đại lý",
        "Bạn có chắc chắn muốn xoá phụ kiện đại lý này?",
        () => deleteAccessory({ id: branchAccessory.id })
      ),
    [branchAccessory.id, deleteAccessory]
  );

  const info = useMemo(
    () => [
      {
        label: "Hình thức",
        value: ExtendedFormalities[data.formality],
      },
      {
        label: "Mã phụ kiện",
        value: data.accessory.code,
      },
      {
        label: "Tên phụ kiện",
        value: data.accessory.name,
      },
      {
        label: "Đơn vị",
        value: data.accessory.unit,
      },
      {
        label: "Đơn giá",
        value: currencyFormatter(data.accessory.price),
      },
      {
        label: "Số lượng",
        value: data.amount,
      },
      {
        label: "Loại giảm giá",
        value: DiscountTypes[data.discountType],
      },
      {
        label: "Giảm giá",
        value: discountFormatter(data.discount, data.discountType),
      },
      {
        label: "Thành tiền",
        value: currencyFormatter(data.total),
      },
    ],
    [data]
  );

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
      <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        {info.map((e, i) => (
          <TextRow
            key={e.label}
            left={e.label}
            right={e.value}
            marginT-0={i === 0}
          />
        ))}
      </View>
    </BasePage>
  );
};

BranchAccessoryDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      branchAccessory: PropTypes.object,
    }),
  }),
};

export default BranchAccessoryDetails;
