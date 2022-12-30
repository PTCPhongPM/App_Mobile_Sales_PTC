import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { Linking, RefreshControl, ScrollView } from "react-native";
import { Button, Colors, View } from "react-native-ui-lib";

import Headline from "../../../components/Header/Headline";
import TextRow from "../../../components/TextRow";

import gStyles from "../../../configs/gStyles";

import {
  SolidCall,
  SolidDocumentDismiss,
  SolidSms,
} from "../../../configs/assets";
import {
  ContractCancelStateObject,
  ContractStateObject,
} from "../../../helper/constants";
import { dateFormatter, getCustomerName } from "../../../helper/utils";

const ContractProductTab = ({
  contract,
  isNotMe,
  hasBottomActions,
  refetch,
  loading,
}) => {
  const navigation = useNavigation();

  const holderInfo = useMemo(
    () => [
      {
        label: "Họ và tên",
        value: getCustomerName(contract.request.holderInfo),
      },
      {
        label: "Số điện thoại",
        value: isNotMe == true ? contract.request.holderInfo.phoneNumber.slice(0, -3) + "xxx" : contract.request.holderInfo.phoneNumber, 
      },
      {
        label: "Tỉnh/ Thành phố",
        value: contract.request.holderInfo.province.name,
      },
      {
        label: "Quận/ Huyện",
        value: contract.request.holderInfo.district.name,
      },
      {
        label: "Địa chỉ",
        value: contract.request.holderInfo.address,
      },
      {
        label: "Số CCCD/CMT",
        value: contract.request.holderInfo.citizenIdentity,
      },
      {
        label: "Nơi cấp",
        value: contract.request.holderInfo.issuedPlace,
      },
      {
        label: "Ngày cấp",
        value: dateFormatter(contract.request.holderInfo.issuedDate),
      },
    ],
    [contract.request.holderInfo]
  );

  const contactInfo = useMemo(
    () => [
      {
        label: "Họ và tên",
        value: getCustomerName(contract.request.contactInfo),
      },
      {
        label: "Số điện thoại",
        value: isNotMe == true ? contract.request.contactInfo.phoneNumber.slice(0, -3) + "xxx" : contract.request.contactInfo.phoneNumber,
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

  const handleCancelContract = useCallback(
    () => navigation.navigate("ContractCancelEditor", { contract }),
    [contract, navigation]
  );

  const renderBottomActions = useCallback(() => {
    if (hasBottomActions) {
      const buttons = [
        {
          id: "SolidSms",
          icon: SolidSms,
          onPress: () =>
            Linking.openURL(`sms:${contract.request?.holderInfo.phoneNumber}`),
        },
        {
          id: "SolidCall",
          icon: SolidCall,
          onPress: () =>
            Linking.openURL(`tel:${contract.request?.holderInfo.phoneNumber}`),
        },
      ];

      if (contract.state === ContractStateObject.approved) {
        if (
          !contract.cancelState ||
          contract.cancelState === ContractCancelStateObject.unconfirmed
        ) {
          buttons.push({
            id: "SolidDocumentDismiss",
            icon: SolidDocumentDismiss,
            onPress: handleCancelContract,
          });
        }
      }

      return (
        <View
          center
          bg-surface
          paddingV-8
          style={[gStyles.shadowUp, gStyles.borderT]}
        >
          <View
            bg-neutral100
            br60
            center
            paddingV-8
            row
            style={[gStyles.shadow, gStyles.border]}
          >
            {buttons.map((element) => (
              <Button
                key={element.id}
                link
                paddingH-24
                onPress={element.onPress}
              >
                <element.icon fill={Colors.black} />
              </Button>
            ))}
          </View>
        </View>
      );
    }
  }, [
    contract.cancelState,
    contract.request?.holderInfo.phoneNumber,
    contract.state,
    handleCancelContract,
    hasBottomActions,
  ]);

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
        <Headline label="Thông tin người đứng Hợp Đồng" />
        <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {holderInfo.map(renderItem)}
        </View>

        <Headline label="Thông tin người liên hệ" />
        <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {contactInfo.map(renderItem)}
        </View>
      </ScrollView>

      {renderBottomActions()}
    </View>
  );
};

ContractProductTab.propTypes = {
  contract: PropTypes.shape({
    cancelState: PropTypes.string,
    request: PropTypes.shape({
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
      holderInfo: PropTypes.shape({
        address: PropTypes.string,
        citizenIdentity: PropTypes.string,
        district: PropTypes.shape({
          name: PropTypes.string,
        }),
        issuedDate: PropTypes.string,
        issuedPlace: PropTypes.string,
        phoneNumber: PropTypes.string,
        province: PropTypes.shape({
          name: PropTypes.string,
        }),
      }),
    }),
    state: PropTypes.string,
  }),
  hasBottomActions: PropTypes.bool,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default ContractProductTab;
