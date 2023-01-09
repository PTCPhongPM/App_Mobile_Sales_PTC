import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import { RefreshControl, ScrollView } from "react-native";
import { Colors, View } from "react-native-ui-lib";

import Headline from "../../../components/Header/Headline";
import InsuranceCard from "../../../components/Card/InsuranceCard";
import ProductImage from "../../../components/ProductImage";
import SellGiftFooter from "../../../components/SellGift/SellGiftFooter";
import SellGiveItem from "../../../components/SellGift/SellGiveItem";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";
import {
  currencyFormatter,
  dateFormatter,
  monthsFormatter,
  yearsFormatter,
} from "../../../helper/utils";
import { PaymentMethods } from "../../../helper/constants";

const RequestProductDetailsTab = ({
  navigation,
  request,
  customer,
  refetch,
  loading,
}) => {
  const carInformation = useMemo(() => {
    const result = [
      {
        label: "Loại xe",
        value: request.favoriteProduct.favoriteModel.model.description,
      },
      {
        label: "MTO",
        value: request.favoriteProduct.product.name,
      },
      {
        label: "Màu ngoại thât",
        value: request.favoriteProduct.exteriorColor.name,
      },
      {
        label: "Màu nội thất",
        value: request.favoriteProduct.interiorColor?.name,
      },
      {
        label: "Chính sách",
        value: request.policy?.name,
      },
      {
        label: "Số lượng",
        value: request.quantity,
      },
      {
        label: "Giao xe từ",
        value: dateFormatter(request.fromDate),
      },
      {
        label: "Đến ngày",
        value: dateFormatter(request.toDate),
      },
      {
        label: "Giá niêm yết",
        value: currencyFormatter(request.listedPrice),
      },
      {
        label: "Giảm giá",
        value: currencyFormatter(request.discount),
      },
      {
        label: "Tiền đặt cọc",
        value: currencyFormatter(request.deposit),
      },
      {
        label: "Hạn đặt cọc",
        value: dateFormatter(request.depositDate),
      },
      {
        label: "Hình thức thanh toán",
        value: request.paymentMethod,
      },
      {
        label: "Mục đích sử dụng",
        value: request.intendedUse,
      },
      {
        label: "Hình thức mua xe",
        value: request.buyingType,
      },
      {
        label: "Đăng ký xe",
        value: request.registration,
      },
      {
        label: "Giao xe",
        value: request.deliveryPlace,
      },
      {
        label: "Gói quà tặng",
        value: request.accessoryPack?.name,
      },
      {
        label: "Ghi chú",
        value: request.note,
      },
    ];

    // Trả góp
    if (request.paymentMethod === PaymentMethods[2]) {
      result.splice(13, 0, {
        label: "Ngân hàng",
        value: request.bank?.name,
      });

      result.splice(14, 0, {
        label: "Số tiền vay",
        value: currencyFormatter(request.loanAmount),
      });
    }

    return result;
  }, [request]);

  const handleBrandAccessoryPressed = useCallback(
    (item) => {
      navigation.navigate("BrandAccessoryDetails", { brandAccessory: item });
    },
    [navigation]
  );

  const handleBranchAccessoryPressed = useCallback(
    (item) => {
      navigation.navigate("BranchAccessoryDetails", { branchAccessory: item });
    },
    [navigation]
  );

  const handleInsurancePressed = useCallback(
    (insurance) => {
      navigation.navigate("InsuranceDetails", { insurance });
    },
    [navigation]
  );

  const handleRoutineMaintenancePressed = useCallback(
    (item) => {
      navigation.navigate("RoutineMaintenanceDetails", {
        routineMaintenance: item,
      });
    },
    [navigation]
  );

  const handleExtendedMaintenancePressed = useCallback(
    (item) => {
      navigation.navigate("ExtendedMaintenanceDetails", {
        extendedMaintenance: item,
      });
    },
    [navigation]
  );

  const handlePromotionPressed = useCallback(
    (item) => {
      navigation.navigate("PromotionDetails", {
        promotion: item,
      });
    },
    [navigation]
  );

  const handleRequestBrokerPressed = useCallback(
    (item) => {
      navigation.navigate("RequestBrokerDetails", {
        requestBroker: item,
        customer,
      });
    },
    [customer, navigation]
  );

  return (
    <ScrollView
      contentContainerStyle={gStyles.basePage}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={loading}
          onRefresh={refetch}
        />
      }
    >
      <Headline label="Thông tin xe" />
      <View bg-surface padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <ProductImage
          uri={request?.favoriteProduct.photo?.url}
          name={request?.favoriteProduct.product.name}
        />
        {carInformation.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>
      <Headline label="Phụ kiện hãng" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.requestBrandAccessories?.map((item) => (
          <SellGiveItem
            key={item.id}
            name={item.accessory.name}
            formality={item.formality}
            amount={item.amount}
            total={item.total}
            onPress={() => handleBrandAccessoryPressed(item)}
          />
        ))}
        <SellGiftFooter items={request.requestBrandAccessories} />
      </View>

      <Headline label="Phụ kiện đại lý" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.requestBranchAccessories.map((item) => (
          <SellGiveItem
            key={item.id}
            name={item.accessory.name}
            formality={item.formality}
            amount={item.amount}
            total={item.total}
            onPress={() => handleBranchAccessoryPressed(item)}
          />
        ))}
        <SellGiftFooter items={request.requestBranchAccessories} />
      </View>

      <Headline label="Bảo hiểm" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.insurances?.map((item) => (
          <InsuranceCard
            key={item.id}
            insurance={item}
            canPress
            onPress={() => handleInsurancePressed(item)}
          />
        ))}
        <SellGiftFooter items={request.insurances} />
      </View>

      <Headline label="Bảo dưỡng định kỳ" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.routineMaintenances?.map((item) => (
          <SellGiveItem
            key={item.id}
            name={item.maintenance?.description}
            formality={item.formality}
            duration={monthsFormatter(item.duration)}
            total={item.total}
            onPress={() => handleRoutineMaintenancePressed(item)}
          />
        ))}
        <SellGiftFooter items={request.routineMaintenances} />
      </View>

      <Headline label="Gia hạn bảo hành" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.extendedMaintenances.map((item) => (
          <SellGiveItem
            key={item.id}
            name={item.maintenance?.description}
            formality={item.formality}
            duration={yearsFormatter(item.duration)}
            total={item.total}
            onPress={() => handleExtendedMaintenancePressed(item)}
          />
        ))}
        <SellGiftFooter items={request.extendedMaintenances} />
      </View>

      <Headline label="Khuyến mại khác" />
      <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        {request.requestPromotions?.map((item) => (
          <SellGiveItem
            key={item.id}
            name={item.promotion?.description}
            formality={item.formality}
            amount={item.amount}
            total={item.total}
            onPress={() => handlePromotionPressed(item)}
          />
        ))}
        <SellGiftFooter items={request.requestPromotions} />
      </View>

      {request.requestBroker && (
        <>
          <Headline label="Hoa hồng" />
          <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
            <SellGiveItem
              name={"Chi phí môi giới"}
              formality={"brandPresent"}
              total={request.requestBroker.amount}
              onPress={() => handleRequestBrokerPressed(request.requestBroker)}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

RequestProductDetailsTab.propTypes = {
  customer: PropTypes.object,
  loading: PropTypes.bool,
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  refetch: PropTypes.func,
  request: PropTypes.shape({
    bank: PropTypes.shape({
      name: PropTypes.string,
    }),
    buyingType: PropTypes.string,
    deliveryPlace: PropTypes.string,
    deposit: PropTypes.number,
    depositDate: PropTypes.string,
    discount: PropTypes.number,
    extendedMaintenances: PropTypes.array,
    favoriteProduct: PropTypes.shape({
      exteriorColor: PropTypes.shape({
        name: PropTypes.string,
      }),
      favoriteModel: PropTypes.shape({
        model: PropTypes.shape({
          description: PropTypes.string,
          photo: PropTypes.shape({
            url: PropTypes.string,
          }),
        }),
      }),
      interiorColor: PropTypes.shape({
        name: PropTypes.string,
      }),
      product: PropTypes.shape({
        listedPrice: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
    fromDate: PropTypes.string,
    insurances: PropTypes.array,
    intendedUse: PropTypes.string,
    loanAmount: PropTypes.number,
    note: PropTypes.string,
    paymentMethod: PropTypes.string,
    policy: PropTypes.shape({
      name: PropTypes.string,
    }),
    accessoryPack: PropTypes.shape({
      name: PropTypes.string,
    }),
    quantity: PropTypes.number,
    registration: PropTypes.any,
    requestBranchAccessories: PropTypes.array,
    requestBrandAccessories: PropTypes.array,
    requestBroker: PropTypes.object,
    requestPromotions: PropTypes.array,
    routineMaintenances: PropTypes.array,
    toDate: PropTypes.string,
  }),
};

export default RequestProductDetailsTab;
