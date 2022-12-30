import React from "react";
import PropTypes from "prop-types";

import { Text, View } from "react-native-ui-lib";
import gStyles from "../../configs/gStyles";

const PriceSummaryCard = ({ price, discount, total }) => {
  return (
    <View
      paddingV-12
      paddingH-20
      bg-surface
      style={[gStyles.shadowUp, gStyles.border]}
    >
      <View row centerV spread>
        <Text body2 textBlackMedium>
          Giá thành
        </Text>
        <Text>{price}</Text>
      </View>
      <View row centerV spread marginT-2>
        <Text body2 textBlackMedium>
          Giảm giá
        </Text>
        <Text>- {discount}</Text>
      </View>

      <View marginT-8 style={gStyles.borderT} />
      <View row centerV spread marginT-8>
        <Text subtitle1 textBlackHigh>
          Tổng
        </Text>
        <Text headline primary900>
          {total}
        </Text>
      </View>
    </View>
  );
};

PriceSummaryCard.propTypes = {
  discount: PropTypes.any,
  price: PropTypes.any,
  total: PropTypes.any,
};

export default PriceSummaryCard;
