/* eslint-disable react-native/no-unused-styles */
import React, { memo } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";

import { colors } from "../../configs/themes";

const container = StyleSheet.create({
  blue: {
    backgroundColor: colors.stateBlueLight,
    borderColor: colors.stateBlueDefault,
    borderWidth: 0.5,
  },
  green: {
    backgroundColor: colors.stateGreenLight,
    borderColor: colors.stateGreenDefault,
    borderWidth: 0.5,
  },
  neutral: {
    backgroundColor: colors.neutral50,
    borderColor: colors.neutral400,
    borderWidth: 0.5,
  },
  orange: {
    backgroundColor: colors.stateOrangeLight,
    borderColor: colors.stateOrangeDefault,
    borderWidth: 0.5,
  },
  red: {
    backgroundColor: colors.stateRedLight,
    borderColor: colors.stateRedDefault,
    borderWidth: 0.5,
  },
});

const iconColors = {
  neutral: colors.neutral600,
  red: colors.stateRedDefault,
  orange: colors.stateOrangeDefault,
  green: colors.stateGreenDefault,
  blue: colors.stateBlueDefault,
};

const StateIcon = ({ color, icon: _Icon }) => (
  <View center br100 width={40} height={40} style={container[color]}>
    <_Icon fill={iconColors[color]} />
  </View>
);

StateIcon.defaultProps = {
  color: "neutral",
};
StateIcon.propTypes = {
  color: PropTypes.oneOf(["blue", "green", "orange", "red", "neutral"]),
  icon: PropTypes.any,
};

export default memo(StateIcon);
