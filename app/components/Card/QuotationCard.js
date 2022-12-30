import React, { memo } from "react";
import PropTypes from "prop-types";

import { Pressable } from "react-native";
import { Text, View } from "react-native-ui-lib";
import StateIcon from "../State/StateIcon";

import { SolidRequestQuote } from "../../configs/assets";

import gStyles from "../../configs/gStyles";

const QuotationCard = ({ title, time, car, onPress }) => (
  <Pressable onPress={onPress}>
    <View row centerV bg-surface padding-16 style={gStyles.borderB}>
      <StateIcon icon={SolidRequestQuote} color="blue" />
      <View marginL-16 flex>
        <View row spread>
          <Text uppercase>{title}</Text>
          <Text caption1 textBlackMedium>
            {time}
          </Text>
        </View>

        <View row>
          <Text body2>Xe mua: </Text>
          <Text body2 textBlackMedium>
            {car}
          </Text>
        </View>
      </View>
    </View>
  </Pressable>
);

QuotationCard.propTypes = {
  car: PropTypes.string,
  onPress: PropTypes.func,
  time: PropTypes.string,
  title: PropTypes.string,
};

export default memo(QuotationCard);
