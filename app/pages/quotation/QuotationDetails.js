import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";

import { ScrollView } from "react-native";
import { ActionSheet, Button, Colors, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import ContextMenu from "react-native-context-menu-view";

import BasePage from "../../components/Base/BasePage";
import Headline from "../../components/Header/Headline";
import InsuranceCard from "../../components/Card/InsuranceCard";
import NormalChip from "../../components/Chip/NormalChip";
import ProductImage from "../../components/ProductImage";
import TextRow from "../../components/TextRow";

import {
  useDeleteQuotationMutation,
  useGetQuotationQuery,
  useGetQuotationTemplatesQuery,
} from "../../store/api/quotation";

import { Edit, More } from "../../configs/assets";
import { useNotification } from "../../providers/NotificationProvider";

import { DiscountTypeObject, YesNos, YesNosEn } from "../../helper/constants";
import { showDeleteAlert } from "../../helper/alert";
import {
  checkSaleActive,
  currencyFormatter,
  dateFormatter,
  monthsFormatter,
  percentageFormatter,
} from "../../helper/utils";
import gStyles from "../../configs/gStyles";
import { getLoadState, setLoading } from "../../store/slices/file";
import { downloadPDF } from "../../helper/file";

const QuotationDetails = ({ navigation, route: { params } }) => {
  const { quotation, customer } = params;
  const notification = useNotification();
  const dispatch = useDispatch();

  const fileLoading = useSelector(getLoadState);

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  const { data, isFetching } = useGetQuotationQuery({ id: quotation.id });

  const [
    deleteQuotation,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess },
  ] = useDeleteQuotationMutation();

  const { data: templates = [], isFetching: isFetchingTemplate } =
    useGetQuotationTemplatesQuery();

  const loading = useMemo(
    () => isFetching || isDeleting || isFetchingTemplate || fileLoading,
    [fileLoading, isDeleting, isFetching, isFetchingTemplate]
  );

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  const [actionSheetShown, setActionSheetShown] = useState(false);

  const handleEditPressed = useCallback(
    () => navigation.navigate("QuotationEditor", { quotation: data, customer }),
    [customer, data, navigation]
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const contextActions = useMemo(
    () => [
      {
        title: "Xuất PDF",
        onPress: handleActionSheetShow,
      },
      {
        title: "Xoá báo giá",
        destructive: true,
        onPress: () =>
          showDeleteAlert(
            "Xoá báo giá?",
            "Hành động này không thể hoàn tác",
            () => deleteQuotation({ id: quotation.id })
          ),
      },
    ],
    [deleteQuotation, handleActionSheetShow, quotation.id]
  );

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => {
      contextActions[index].onPress();
    },
    [contextActions]
  );

  useEffect(() => {
    if (isSaleActive) {
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
            <ContextMenu
              actions={loading ? [] : contextActions}
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
    }
  }, [
    contextActions,
    handelMenuPressed,
    handleEditPressed,
    isSaleActive,
    loading,
    navigation,
  ]);

  const carInformation = useMemo(() => {
    if (!data) return [];

    return [
      {
        label: "Loại xe",
        value: data.favoriteProduct.favoriteModel.model.description,
      },
      {
        label: "Mẫu xe",
        value: data.favoriteProduct.product.name,
      },
      {
        label: "Màu ngoại thât",
        value: data.favoriteProduct.exteriorColor.name,
      },
      {
        label: "Màu nội thất",
        value: data.favoriteProduct.interiorColor?.name,
      },
      {
        label: "Chính sách",
        value: data.policy?.name,
      },
      {
        label: "Tỉnh",
        value: data.province.name,
      },
      {
        label: "Mục đích sử dụng",
        value: data.intendedUse,
      },
      {
        label: "Giá niêm yết",
        value: currencyFormatter(data.favoriteProduct.product.listedPrice),
      },
      {
        label: "Giảm giá",
        value: currencyFormatter(data.discount),
      },
      {
        label: "Thời gian giao xe dự kiến",
        value: dateFormatter(data.deliveryDate),
      },
      {
        label: "Lệ phí trước bạ",
        value: currencyFormatter(data.registrationTax),
      },
      {
        label: "Giảm giá lệ phí trước bạ",
        value:
          data.registrationTaxDiscountType === DiscountTypeObject.percentage
            ? percentageFormatter(data.registrationTaxDiscount)
            : currencyFormatter(data.registrationTaxDiscount),
      },
      {
        label: "Lệ phí biển số",
        value: currencyFormatter(data.licensePlateFee),
      },
      {
        label: "Lệ phí đăng kiểm",
        value: currencyFormatter(data.registrationFee),
      },
      {
        label: "Phí lưu hành nội bộ",
        value: currencyFormatter(data.internalCirculationFee),
      },
      {
        label: "Phí dịch vụ đăng ký xe",
        value: currencyFormatter(data.serviceFee),
      },
    ];
  }, [data]);

  const financialSolutionInfo = useMemo(() => {
    if (!data || !data.hasFinancialSolution) return [];

    return [
      {
        label: "Ngân hàng",
        value: data.bank.name,
      },
      {
        label: "% trả trước",
        value: percentageFormatter(data.prepayPercent),
      },
      {
        label: "Thời hạn vay",
        value: monthsFormatter(data.months),
      },
      {
        label: "Lãi suất ưu đãi",
        value: percentageFormatter(data.preferentialInterestRate),
      },
      {
        label: "Số tháng ưu đãi",
        value: monthsFormatter(data.preferentialMonths),
      },
      {
        label: "Lãi suất sau ưu đãi",
        value: percentageFormatter(data.interestRate),
      },
    ];
  }, [data]);

  const handleInsurancePressed = useCallback(
    (insurance) => {
      navigation.navigate("InsuranceDetails", { insurance });
    },
    [navigation]
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const actionSheetOptions = useMemo(() => {
    const arr = templates.map((template) => ({
      label: template.name,
      onPress: async () => {
        dispatch(setLoading(true));
        await downloadPDF("/quotation/pdf", "quotation", {
          code: quotation.code,
          id: quotation.id,
          template: template.code,
        });
        dispatch(setLoading(false));
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [dispatch, quotation.code, quotation.id, templates]);

  return (
    <BasePage hasScroll={false} loading={loading}>
      <ScrollView bounces={false}>
        <View paddingH-16 paddingT-4 paddingB-12 bg-primary900>
          <Text subtitle1 textWhiteHigh marginB-4 uppercase>
            {data?.code}
          </Text>
          <View row marginT-6>
            <NormalChip label={data?.favoriteProduct.product.name} />
          </View>
        </View>
        <Headline label="Thông tin xe" marginT-8 />
        <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <ProductImage
            uri={data?.favoriteProduct.favoriteModel.model.photo?.url}
            name={data?.favoriteProduct.product.name}
          />
          {carInformation.map((e) => (
            <TextRow key={e.label} left={e.label} right={e.value} />
          ))}
        </View>
        <Headline label="Quà tặng" />
        <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
          <TextRow
            left="Quà tặng theo xe"
            right={YesNos[YesNosEn[data?.hasPresent]]}
            marginT-8={false}
          />
          <TextRow left="Quà tặng khác" right={data?.otherPresents} />
        </View>

        <Headline label="Bảo hiểm" />
        {Boolean(data?.insurances.length) && (
          <View style={[gStyles.borderV, gStyles.shadow]}>
            {data?.insurances.map((item) => (
              <InsuranceCard
                key={item.id}
                insurance={item}
                onPress={() => handleInsurancePressed(item)}
              />
            ))}
          </View>
        )}

        {data?.hasFinancialSolution && (
          <>
            <Headline label="Giải pháp tài chính" />
            <View
              bg-surface
              padding-16
              style={[gStyles.borderV, gStyles.shadow]}
            >
              {financialSolutionInfo.map((e, i) => (
                <TextRow
                  key={e.label}
                  left={e.label}
                  right={e.value}
                  marginT-0={i === 0}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        title="Chọn mẫu báo giá bạn muốn tạo PDF"
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </BasePage>
  );
};

QuotationDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      quotation: PropTypes.object.isRequired,
      customer: PropTypes.object,
    }),
  }),
};

export default QuotationDetails;
