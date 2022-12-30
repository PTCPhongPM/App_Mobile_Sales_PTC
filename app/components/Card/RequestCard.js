import React, { memo } from "react";
import PropTypes from "prop-types";

import { Pressable } from "react-native";
import { Text, View } from "react-native-ui-lib";

import StateIcon from "../State/StateIcon";

import gStyles from "../../configs/gStyles";
import { formatDate } from "../../helper/utils";
import {
  RequestStateIconColors,
  RequestStateIcons,
} from "../../helper/constants";

const RequestCard = ({ request, onPress, showSale }) => {
  const { account, code, createdAt, favoriteProduct, paymentMethod, state } =
    request;

  return (
    <Pressable onPress={onPress} style={gStyles.borderB}>
      <View row centerV bg-surface padding-16>
        <StateIcon
          icon={RequestStateIcons[state]}
          color={RequestStateIconColors[state]}
        />
        <View marginL-16 flex>
          <View row spread>
            <Text uppercase>{code}</Text>
            <Text caption1 textBlackMedium>
              {formatDate(createdAt)}
            </Text>
          </View>

          {showSale && (
            <Text numberOfLines={1} flex>
              <Text body2>Nhân viên: </Text>
              <Text body2 textBlackMedium style={gStyles.capitalize}>
                {account.name}
              </Text>
            </Text>
          )}

          <View row>
            <Text numberOfLines={1} flex>
              <Text body2>Hình thức: </Text>
              <Text body2 textBlackMedium>
                {paymentMethod}
              </Text>
            </Text>
            {favoriteProduct && (
              <Text flex numberOfLines={1}>
                <Text body2>Xe mua: </Text>
                <Text body2 textBlackMedium>
                  {`${
                    favoriteProduct.favoriteModel?.model?.description ||
                    favoriteProduct.product?.model?.description
                  } ${favoriteProduct.product?.name}`}
                </Text>
              </Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

RequestCard.propTypes = {
  onPress: PropTypes.func,
  request: PropTypes.shape({
    account: PropTypes.shape({
      name: PropTypes.string,
    }),
    code: PropTypes.string,
    createdAt: PropTypes.string,
    favoriteProduct: PropTypes.shape({
      favoriteModel: PropTypes.shape({
        model: PropTypes.shape({
          description: PropTypes.string,
        }),
        name: PropTypes.string,
      }),
      product: PropTypes.shape({
        model: PropTypes.shape({
          description: PropTypes.string,
        }),
        name: PropTypes.string,
      }),
    }),
    paymentMethod: PropTypes.string,
    state: PropTypes.string,
  }),
  showSale: PropTypes.bool,
};

export default memo(RequestCard);
