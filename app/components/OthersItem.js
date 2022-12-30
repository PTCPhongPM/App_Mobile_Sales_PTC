import React, { memo } from "react";
import PropTypes from "prop-types";

import { Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";

import gStyles from "../configs/gStyles";

const OthersItem = ({ icon: Icon, text, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      paddingH-16
      paddingV-12
      row
      centerV
      bg-surface
      style={gStyles.borderB}
    >
      <Icon fill={Colors.textBlackHigh} />
      <Text marginL-8>{text}</Text>
    </View>
  </TouchableOpacity>
);

OthersItem.propTypes = {
  icon: PropTypes.any,
  onPress: PropTypes.func,
  text: PropTypes.string,
};

export default memo(OthersItem);
