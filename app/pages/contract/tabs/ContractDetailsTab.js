import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { Linking, RefreshControl, ScrollView } from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";

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
  RequestStateObject,
} from "../../../helper/constants";

import { currencyFormatter, formatDate } from "../../../helper/utils";

const ContractDetailsTab = ({
  contract,
  hasBottomActions,
  refetch,
  loading,
}) => {
  const navigation = useNavigation();

  const information = useMemo(
    () => [
      {
        label: "Số hợp đồng 1",
        value: contract.code?.toUpperCase(),
      },
      {
        label: "Số hợp đồng 2",
        value: contract.code2?.toUpperCase(),
      },
      {
        label: "Loại hợp đồng",
        value: contract.type,
      },
      {
        label: "Hình thức thanh toán",
        value: contract.paymentMethod,
      },
      {
        label: "Ngân hàng",
        value: contract.bank?.name,
      },
      {
        label: "Số tiền vay",
        value: currencyFormatter(contract.loanAmount),
      },
      {
        label: "Ngày ký",
        value: formatDate(contract.signingDate),
      },
      {
        label: "Người ký",
        value: contract.signer,
      },
      {
        label: "Tài khoản NH",
        value: contract.bankAccount?.accountNumber,
      },
      {
        label: "Tiền đặt cọc",
        value: currencyFormatter(contract.deposit),
      },
      {
        label: "Thanh toán lần 2",
        value: currencyFormatter(contract.secondAmount),
      },
      {
        label: "Còn lại",
        value: currencyFormatter(contract.remainingAmount),
      },
    ],
    [
      contract.bank?.name,
      contract.bankAccount?.accountNumber,
      contract.code,
      contract.code2,
      contract.deposit,
      contract.loanAmount,
      contract.paymentMethod,
      contract.remainingAmount,
      contract.secondAmount,
      contract.signer,
      contract.signingDate,
      contract.type,
    ]
  );

  const renderItem = useCallback(
    (item) => <TextRow key={item.label} left={item.label} right={item.value} />,
    []
  );

  const handleCancelContract = useCallback(
    () =>
      navigation.navigate("ContractCancelEditor", {
        contract,
      }),
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

  const handleReasonRejectPressed = useCallback(
    () =>
      navigation.navigate("ReasonReject", {
        reason: contract.reason,
      }),
    [contract.reason, navigation]
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
        <Headline label="Thông tin hợp đồng" />
        <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
          {information.map(renderItem)}
        </View>
        {contract.state === RequestStateObject.rejected && (
          <Button
            borderRadius={4}
            marginH-16
            marginT-16
            outline
            outlineColor={Colors.primary900}
            paddingV-16
            onPress={handleReasonRejectPressed}
          >
            <Text button primary900>
              Xem lý do từ chối
            </Text>
          </Button>
        )}
      </ScrollView>
      {renderBottomActions()}
    </View>
  );
};

ContractDetailsTab.propTypes = {
  contract: PropTypes.shape({
    bank: PropTypes.shape({
      name: PropTypes.string,
    }),
    bankAccount: PropTypes.shape({
      accountNumber: PropTypes.string,
    }),
    cancelState: PropTypes.string,
    code: PropTypes.string,
    code2: PropTypes.string,
    deposit: PropTypes.number,
    loanAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    reason: PropTypes.string,
    remainingAmount: PropTypes.number,
    request: PropTypes.shape({
      holderInfo: PropTypes.shape({
        phoneNumber: PropTypes.string,
      }),
    }),
    secondAmount: PropTypes.number,
    signer: PropTypes.string,
    signingDate: PropTypes.string,
    state: PropTypes.string,
    type: PropTypes.string,
  }),
  hasBottomActions: PropTypes.bool,
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default ContractDetailsTab;
