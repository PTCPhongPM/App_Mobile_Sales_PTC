import React from "react";
import PropTypes from "prop-types";

import { Chip, Colors, Typography } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";

const NormalChip = ({ label, ...props }) => {
  if (!label) return null;

  return (
    <Chip
      label={label}
      labelStyle={Typography.body2}
      backgroundColor={Colors.neutral100}
      containerStyle={gStyles.border0}
      {...props}
    />
  );
};

NormalChip.propTypes = {
  label: PropTypes.string,
};

export default NormalChip;
