import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { Colors, Text, View } from "react-native-ui-lib";

import { NorthEast, SouthWest } from "../../configs/assets";
import { computeResultTotal, currencyFormatter } from "../../helper/utils";

const SellGiftFooter = ({ items }) => {
  const numbers = useMemo(() => computeResultTotal(items), [items]);

  return (
    <View row paddingV-8>
      <View flex row spread paddingH-16>
        <View row>
          <NorthEast fill={Colors.stateGreenDefault} width={20} height={20} />
          <Text marginL-4 body2 textBlackMedium>
            Bán:
          </Text>
        </View>
        <Text body2>{currencyFormatter(numbers.sell)}</Text>
      </View>
      <View flex row spread paddingH-16>
        <View row>
          <SouthWest fill={Colors.stateOrangeDefault} width={20} height={20} />
          <Text marginL-4 body2 textBlackMedium>
            Tặng:
          </Text>
        </View>
        <Text body2>{currencyFormatter(numbers.gift)}</Text>
      </View>
    </View>
  );
};

SellGiftFooter.propTypes = {
  items: PropTypes.array,
};

export default SellGiftFooter;
