import React, { memo } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";
import { Button, Colors } from "react-native-ui-lib";

import { Add, Calendar } from "../../configs/assets";

import { colors } from "../../configs/themes";
import gStyles from "../../configs/gStyles";

const styles = StyleSheet.create({
  calendar: {
    bottom: 80,
    height: 44,
    right: 22,
    width: 44,
  },
  fab: {
    borderRadius: 56,
    bottom: 16,
    elevation: 4,
    height: 56,
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
});

const Fab = ({ color, onPress, isCalendar, ...props }) => (
  <Button
    round
    style={[
      styles.fab,
      gStyles.shadow,
      {
        backgroundColor: color,
      },
      isCalendar && styles.calendar,
    ]}
    onPress={onPress}
    {...props}
  >
    {isCalendar ? (
      <Calendar fill={Colors.white} />
    ) : (
      <Add fill={Colors.white} />
    )}
  </Button>
);

Fab.defaultProps = {
  color: colors.textBlackHigh,
  isCalendar: false,
  onPress: () => {},
};

Fab.propTypes = {
  color: PropTypes.string,
  isCalendar: PropTypes.bool,
  onPress: PropTypes.func,
};

export default memo(Fab);
