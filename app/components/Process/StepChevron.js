import PropTypes from "prop-types";
import React, { memo } from "react";
import Svg, { Path, Rect } from "react-native-svg";

import { colors } from "../../configs/themes";

const StepChevron = ({ start, end, ...props }) => (
  <Svg
    width={12}
    height={38}
    viewBox="0 0 12 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={12} height={38} fill="white" />
    <Rect x={4} width={8} height={38} fill={end} />
    <Path d="M4 0L12 19L4 38V0Z" fill="white" />
    <Path d="M0 0L8 19L0 38V0Z" fill={start} />
  </Svg>
);

StepChevron.defaultProps = {
  start: colors.stateGreenDark,
  end: colors.neutral300,
};

StepChevron.propTypes = {
  end: PropTypes.string,
  start: PropTypes.string,
};

export default memo(StepChevron);
