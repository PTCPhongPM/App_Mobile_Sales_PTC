import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Button, Colors, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import BasePage from "../../components/Base/BasePage";
import TextRow from "../../components/TextRow";

import {
  useDeleteInsuranceMutation,
  useGetInsuranceQuery,
} from "../../store/api/insurance";

import { DiscountTypes, ExtendedFormalities } from "../../helper/constants";
import { Delete, Edit } from "../../configs/assets";
import { showDeleteAlert } from "../../helper/alert";

import { useNotification } from "../../providers/NotificationProvider";
import {
  currencyFormatter,
  discountFormatter,
  yearsFormatter,
} from "../../helper/utils";
import gStyles from "../../configs/gStyles";

const InsuranceDetails = ({ navigation, route: { params } }) => {
  const { insurance } = params;
  const notification = useNotification();

  const { data: insuranceFromApi, isFetching } = useGetInsuranceQuery({
    id: insurance.id,
  });

  const data = useMemo(
    () => insuranceFromApi || insurance,
    [insurance, insuranceFromApi]
  );

  const handleEditPressed = useCallback(() => {
    navigation.navigate("InsuranceEditor", { insurance: data });
  }, [data, navigation]);

  const [
    deleteInsurance,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess },
  ] = useDeleteInsuranceMutation();

  const loading = isFetching || isDeleting;

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  const handleDelete = useCallback(
    () =>
      showDeleteAlert(
        "Xoá bảo hiểm",
        "Bạn có chắc chắn muốn xoá bảo hiểm",
        () => deleteInsurance({ id: insurance.id })
      ),
    [deleteInsurance, insurance.id]
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

  const info = useMemo(
    () => [
      {
        label: "Hình thức",
        value: ExtendedFormalities[data.method],
      },
      {
        label: "Loại bảo hiểm",
        value: data.type,
      },
      {
        label: "Tên loại bảo hiểm",
        value: data.name,
      },
      {
        label: "Số năm",
        value: yearsFormatter(data.years),
      },
      {
        label: "Giá thành",
        value: currencyFormatter(data.price),
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

InsuranceDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      insurance: PropTypes.object,
    }),
  }),
};

export default InsuranceDetails;
