import React, { memo } from "react";
import PropTypes from "prop-types";

import { Text, View } from "react-native-ui-lib";

import gStyles from "../configs/gStyles";
import InputLabel from "./Input/InputLabel";

const TextRow = ({
  capitalize,
  left,
  leftRequired,
  right,
  rightDisabled,
  rightProps,
  ...props
}) => (
  <View row centerV marginT-5 style={gStyles.minHeight32} {...props}>
    <InputLabel text={left} required={leftRequired} />
    <View flex-2 paddingL-8 {...rightProps}>
      <Text
        textBlackLow={rightDisabled}
        style={capitalize && gStyles.capitalize}
      >
        {right}
      </Text>
    </View>
  </View>
);

TextRow.defaultProps = {
  leftRequired: false,
  capitalize: false,
  rightDisabled: false,
};
TextRow.propTypes = {
  capitalize: PropTypes.bool,
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  leftRequired: PropTypes.bool,
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rightDisabled: PropTypes.bool,
  rightProps: PropTypes.any,
};

export default memo(TextRow);
