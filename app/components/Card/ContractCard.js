import PropTypes from "prop-types";
import React, { memo, useMemo } from "react";

import { Pressable } from "react-native";
import { Text, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";

import {
  AllocationStates,
  ContractStateIconColors,
  ContractStateIcons,
  ContractStateObject,
} from "../../helper/constants";

import { formatDate, getCustomerName } from "../../helper/utils";

import ContractStepper from "../Process/ContractStepper";
import StateIcon from "../State/StateIcon";

const ContractCard = ({ contract, customerShown, onPress }) => {
  const showStepper = useMemo(
    () =>
      [ContractStateObject.approved, ContractStateObject.completed].includes(
        contract.state
      ),
    [contract.state]
  );

  const stepperValue = useMemo(() => {
    if (contract.allocations?.length) {
      const done = contract.allocations?.every(
        (e) => e.state === AllocationStates[3]
      );

      if (done) {
        return "Hoàn tất giao xe";
      } else {
        return "Phân xe cho HĐ";
      }
    }
    return null;
  }, [contract.allocations]);

  return (
    <Pressable onPress={onPress} style={[gStyles.borderB, gStyles.shadow]}>
      <View row centerV bg-surface paddingH-16 height={92}>
        <StateIcon
          icon={ContractStateIcons[contract.state]}
          color={ContractStateIconColors[contract.state]}
        />
        <View flex marginL-16>
          <View row spread centerV>
            <Text uppercase>{contract.code}</Text>
            <Text caption1 textBlackMedium>
              {formatDate(contract.createdAt)}
            </Text>
          </View>
          {customerShown && (
            <View row>
              <Text body2>Khách hàng: </Text>
              <Text body2 textBlackMedium>
                {getCustomerName(contract.request.holderInfo)}
              </Text>
            </View>
          )}
          <View row>
            <Text flex numberOfLines={1}>
              <Text body2>Hình thức: </Text>
              <Text body2 textBlackMedium>
                {contract.paymentMethod}
              </Text>
            </Text>
            <Text flex numberOfLines={1}>
              <Text body2>Xe mua: </Text>
              <Text body2 textBlackMedium>
                {
                  contract.request.favoriteProduct.favoriteModel.model
                    .description
                }
              </Text>
            </Text>
          </View>
          {showStepper && <ContractStepper value={stepperValue} />}
        </View>
      </View>
    </Pressable>
  );
};

ContractCard.defaultProps = {
  contract: {
    state: "draft",
  },
};

ContractCard.propTypes = {
  contract: PropTypes.shape({
    allocations: PropTypes.array,
    code: PropTypes.string,
    createdAt: PropTypes.string,
    paymentMethod: PropTypes.string,
    request: PropTypes.shape({
      favoriteProduct: PropTypes.shape({
        favoriteModel: PropTypes.shape({
          model: PropTypes.shape({
            description: PropTypes.string,
          }),
        }),
      }),
      holderInfo: PropTypes.object,
    }),
    state: PropTypes.string,
  }),
  customerShown: PropTypes.bool,
  onPress: PropTypes.func,
  state: PropTypes.string,
};

export default memo(ContractCard);
