import React, { memo } from "react";
import PropTypes from "prop-types";

import { Chip as _Chip } from "react-native-ui-lib";

import { Hot, Warm, Cold16 } from "../../configs/assets";

import { colors, typography } from "../../configs/themes";
import gStyles from "../../configs/gStyles";

const stateChips = {
  hot: {
    icon: Hot,
    label: "Hot",
    labelStyle: {
      ...typography.body2,
      color: colors.stateRedDefault,
    },
    containerStyle: {
      backgroundColor: colors.stateRedLight,
    },
  },
  warm: {
    icon: Warm,
    label: "Warm",
    labelStyle: {
      ...typography.body2,
      color: colors.stateOrangeDefault,
    },
    containerStyle: {
      backgroundColor: colors.stateOrangeLight,
    },
  },
  cold: {
    icon: Cold16,
    label: "Cold",
    labelStyle: {
      ...typography.body2,
      color: colors.stateBlueDefault,
    },
    containerStyle: {
      backgroundColor: colors.stateBlueLight,
    },
  },
};

const CustomerStateChip = ({ state, ...props }) => {
  if (!state) return null;

  return (
    <_Chip
      paddingL-8
      label={stateChips[state].label}
      labelStyle={stateChips[state].labelStyle}
      containerStyle={[gStyles.border0, stateChips[state].containerStyle]}
      iconSource={stateChips[state].icon}
      {...props}
    />
  );
};

CustomerStateChip.propTypes = {
  state: PropTypes.oneOf(["hot", "warm", "cold"]),
};

export default memo(CustomerStateChip);
