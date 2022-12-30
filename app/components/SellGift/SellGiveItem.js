import PropTypes from "prop-types";
import React, { memo } from "react";
import { Pressable } from "react-native";

import { Colors, Text, View } from "react-native-ui-lib";
import { SolidDelete } from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { showDeleteAlert } from "../../helper/alert";
import {
  ExtendedFormalities,
  ExtendedFormalityObj,
} from "../../helper/constants";
import { currencyFormatter } from "../../helper/utils";
import SwipeWrapper from "../Swipe/SwipeWrapper";

const SellGiveItem = ({
  name,
  formality,
  amount,
  total,
  years,
  duration,
  note,
  onPress,
  onDelete,
}) => (
  <SwipeWrapper
    rightActions={
      onDelete
        ? [
            {
              text: "Xóa",
              color: Colors.stateRedDefault,
              icon: <SolidDelete fill={Colors.surface} />,
              onPress: () =>
                showDeleteAlert("Xóa", "Bạn có chắc chắn muốn xoá?", onDelete),
            },
          ]
        : []
    }
  >
    <Pressable onPress={onPress}>
      <View row paddingH-16 paddingV-12 bg-surface style={gStyles.borderB}>
        <View flex>
          <View row spread>
            <Text subtitle2>{name}</Text>
            {amount && (
              <Text body2 textBlackMedium>
                SL: x{amount}
              </Text>
            )}
            {years && (
              <Text body2 textBlackMedium>
                Số năm: {years}
              </Text>
            )}
            {duration && (
              <Text body2 textBlackMedium>
                Thời hạn: {duration}
              </Text>
            )}
          </View>

          <View row spread marginT-2>
            {note && (
              <Text body2 textBlackMedium>
                Ghi chú: ${note}
              </Text>
            )}
            {formality && (
              <Text body2 textBlackMedium>
                Hình thức: {ExtendedFormalities[formality]}
              </Text>
            )}
            <Text>
              {formality &&
                (formality === ExtendedFormalityObj.sell ? "+" : "-")}
              {currencyFormatter(total)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  </SwipeWrapper>
);

SellGiveItem.propTypes = {
  amount: PropTypes.number,
  duration: PropTypes.number,
  formality: PropTypes.string,
  name: PropTypes.string,
  note: PropTypes.string,
  onDelete: PropTypes.func,
  onPress: PropTypes.func,
  total: PropTypes.number,
  years: PropTypes.number,
};

export default memo(SellGiveItem);
