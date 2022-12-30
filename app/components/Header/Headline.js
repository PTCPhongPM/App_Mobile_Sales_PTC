import React from "react";
import PropTypes from "prop-types";

import { Button, Text, View } from "react-native-ui-lib";
import { AddBtn } from "../../configs/assets";

import gStyles from "../../configs/gStyles";

const Headline = ({ label, onPress, ...props }) => (
  <View
    row
    spread
    paddingH-16
    paddingV-6
    marginT-12
    centerV
    bg-primary50
    style={gStyles.borderT}
    {...props}
  >
    <Text subtitle1>{label}</Text>
    {onPress && (
      <Button link onPress={onPress}>
        <AddBtn />
      </Button>
    )}
  </View>
);

Headline.propTypes = {
  canPress: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

export default Headline;
