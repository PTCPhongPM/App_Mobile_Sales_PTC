import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import { RefreshControl, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Text, View } from "react-native-ui-lib";

import Headline from "../../../components/Header/Headline";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";

import {
  computeResultTotal,
  currencyFormatter,
  dateFormatter,
  getCustomerName,
} from "../../../helper/utils";

import ProductImage from "../../../components/ProductImage";
import SellGiveItem from "../../../components/SellGift/SellGiveItem";
import SellGiftFooter from "../../../components/SellGift/SellGiftFooter";
import InsuranceCard from "../../../components/Card/InsuranceCard";

const ContractProductTab = ({ contract, refetch, loading }) => {
  const navigation = useNavigation();

  const productInfo = useMemo(
    () => [
      {
        label: "Loại xe",
        value: contract.request.favoriteProduct.favoriteModel.model.description,
      },
      {
        label: "MTO",
        value: contract.request.favoriteProduct.product.name,
      },
      {
        label: "Màu ngoại thât",
        value: contract.request.favoriteProduct.exteriorColor.name,
      },
      {
        label: "Màu nội thất",
        value: contract.request.favoriteProduct.interiorColor?.name,
      },
      {
        label: "Chính sách",
        value: contract.request.policy.name,
      },
      {
        label: "Số lượng",
        value: contract.request.quantity,
      },
      {
        label: "Giao xe từ",
        value: dateFormatter(contract.request.fromDate),
      },
      {
        label: "Đến ngày",
        value: dateFormatter(contract.request.toDate),
      },
      {
        label: "Giá niêm yết",
        value: currencyFormatter(
          contract.request.favoriteProduct.product.listedPrice
        ),
      },
      {
        label: "Giảm giá",
        value: currencyFormatter(contract.request.discount),
      },
      {
        label: "Tiền đặt cọc",
        value: currencyFormatter(contract.request.deposit),
      },
      {
        label: "Hạn đặt cọc",
        value: dateFormatter(contract.request.depositDate),
      },
      {
        label: "Hình thức thanh toán",
        value: contract.request.paymentMethod,
      },
      {
        label: "Ngân hàng",
        value: contract.request.bank?.name,
      },
      {
        label: "Số tiền vay",
        value: currencyFormatter(contract.request.loanAmount),
      },
      {
        label: "Mục đích sử dụng",
        value: contract.request.intendedUse,
      },
      {
        label: "Hình thức mua xe",
        value: contract.request.buyingType,
      },
      {
        label: "Đăng ký xe",
        value: contract.request.registration,
      },
      {
        label: "Giao xe",
        value: contract.request.deliveryPlace,
      },
      {
        label: "Ghi chú",
        value: contract.request.note,
      },
    ],
    [
      contract.request.bank?.name,
      contract.request.buyingType,
      contract.request.deliveryPlace,
      contract.request.deposit,
      contract.request.depositDate,
      contract.request.discount,
      contract.request.favoriteProduct.exteriorColor.name,
      contract.request.favoriteProduct.favoriteModel.model.description,
      contract.request.favoriteProduct.interiorColor?.name,
      contract.request.favoriteProduct.product.listedPrice,
      contract.request.favoriteProduct.product.name,
      contract.request.fromDate,
      contract.request.intendedUse,
      contract.request.loanAmount,
      contract.request.note,
      contract.request.paymentMethod,
      contract.request.policy.name,
      contract.request.quantity,
      contract.request.registration,
      contract.request.toDate,
    ]
  );

  const contactInfo = useMemo(
    () => [
      {
        label: "Họ và tên",
        value: getCustomerName(contract.request.contactInfo),
      },
      {
        label: "Số điện thoại",
        value: contract.request.contactInfo.phoneNumber,
      },
      {
        label: "Tỉnh/ Thành phố",
        value: contract.request.contactInfo.province.name,
      },
      {
        label: "Quận/ Huyện",
        value: contract.request.contactInfo.district.name,
      },
      {
        label: "Địa chỉ",
        value: contract.request.contactInfo.address,
      },
    ],
    [contract.request.contactInfo]
  );

  const renderItem = useCallback(
    (item) => <TextRow key={item.label} left={item.label} right={item.value} />,
    []
  );

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
        // customer,
      });
    },
    [navigation]
  );

  const numbers = useMemo(
    () =>
      computeResultTotal([
        ...(contract.request.requestBrandAccessories || []),
        ...(contract.request.requestBranchAccessories || []),
        ...(contract.request.insurances || []),
        ...(contract.request.routineMaintenances || []),
        ...(contract.request.extendedMaintenances || []),
        ...(contract.request.requestPromotions || []),
      ]),
    [
      contract.request.extendedMaintenances,
      contract.request.insurances,
      contract.request.requestBranchAccessories,
      contract.request.requestBrandAccessories,
      contract.request.requestPromotions,
      contract.request.routineMaintenances,
    ]
  );

  return (
    <View flex spread>
      <ScrollView
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
        <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          <ProductImage
            name={contract.request.favoriteProduct.product.name}
            uri={contract.request.favoriteProduct.product?.photo?.url}
          />
          {productInfo.map(renderItem)}
        </View>

        <Headline label="Thông tin người liên hệ" />
        <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contactInfo.map(renderItem)}
        </View>

        <Headline
          label={`Phụ kiện hãng (${contract.request.requestBrandAccessories.length})`}
        />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.requestBrandAccessories.map((item) => (
            <SellGiveItem
              key={item.id}
              name={item.accessory.name}
              formality={item.formality}
              amount={item.amount}
              total={item.total}
              onPress={() => handleBrandAccessoryPressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.requestBrandAccessories} />
        </View>

        <Headline
          label={`Phụ kiện đại lý (${contract.request.requestBranchAccessories.length})`}
        />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.requestBranchAccessories.map((item) => (
            <SellGiveItem
              key={item.id}
              name={item.accessory.name}
              formality={item.formality}
              amount={item.amount}
              total={item.total}
              onPress={() => handleBranchAccessoryPressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.requestBranchAccessories} />
        </View>

        <Headline label="Bảo hiểm" />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.insurances.map((item) => (
            <InsuranceCard
              key={item.id}
              insurance={item}
              canPress
              onPress={() => handleInsurancePressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.insurances} />
        </View>

        <Headline label="Bảo dưỡng định kỳ" />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.routineMaintenances?.map((item) => (
            <SellGiveItem
              key={item.id}
              name={item.maintenance?.description}
              formality={item.formality}
              duration={item.duration}
              total={item.total}
              onPress={() => handleRoutineMaintenancePressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.routineMaintenances} />
        </View>

        <Headline label="Gia hạn bảo hành" />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.extendedMaintenances.map((item) => (
            <SellGiveItem
              key={item.id}
              name={item.maintenance?.description}
              formality={item.formality}
              duration={item.duration}
              total={item.total}
              onPress={() => handleExtendedMaintenancePressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.extendedMaintenances} />
        </View>

        <Headline label="Khuyến mại khác" />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contract.request.requestPromotions?.map((item) => (
            <SellGiveItem
              key={item.id}
              name={item.promotion?.description}
              formality={item.formality}
              amount={item.amount}
              total={item.total}
              onPress={() => handlePromotionPressed(item)}
            />
          ))}
          <SellGiftFooter items={contract.request.requestPromotions} />
        </View>

        <Headline label="Hoa hồng" />
        <View bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          <SellGiveItem
            name="Chi phí môi giới"
            formality="brandPresent"
            total={contract.request.requestBroker?.amount}
            onPress={() =>
              handleRequestBrokerPressed(contract.request.requestBroker)
            }
          />
        </View>
      </ScrollView>
      <View
        paddingV-12
        paddingH-20
        bg-surface
        style={[gStyles.shadowUp, gStyles.borderT]}
      >
        <View row spread>
          <Text body2 textBlackMedium>
            Tổng bán
          </Text>
          <Text body2 textBlackMedium>
            {currencyFormatter(numbers.sell)}
          </Text>
        </View>
        <View row spread>
          <Text body2 textBlackMedium>
            Tổng tặng
          </Text>
          <Text body2 textBlackMedium>
            {currencyFormatter(numbers.gift)}
          </Text>
        </View>
        <View row spread>
          <Text body2 textBlackMedium>
            Khung BH
          </Text>
          <Text body2 textBlackMedium>
            Khung BH
          </Text>
        </View>
      </View>
    </View>
  );
};

ContractProductTab.propTypes = {
  contract: PropTypes.shape({
    request: PropTypes.shape({
      bank: PropTypes.shape({
        name: PropTypes.string,
      }),
      buyingType: PropTypes.string,
      contactInfo: PropTypes.shape({
        address: PropTypes.string,
        district: PropTypes.shape({
          name: PropTypes.string,
        }),
        phoneNumber: PropTypes.string,
        province: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
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
      quantity: PropTypes.number,
      registration: PropTypes.string,
      requestBranchAccessories: PropTypes.array,
      requestBrandAccessories: PropTypes.array,
      requestBroker: PropTypes.shape({
        amount: PropTypes.number,
      }),
      requestPromotions: PropTypes.array,
      routineMaintenances: PropTypes.array,
      toDate: PropTypes.string,
    }),
  }),
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default ContractProductTab;
