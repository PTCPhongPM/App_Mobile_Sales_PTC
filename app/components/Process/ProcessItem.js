import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { Assets, Avatar, Colors, Text } from "react-native-ui-lib";
import { Pressable, StyleSheet } from "react-native";

import gStyles from "../../configs/gStyles";

const styles = StyleSheet.create({
  active: {
    borderColor: Colors.primary900,
  },
  canPress: {
    borderColor: Colors.textBlackMedium,
  },
  container: {
    alignItems: "center",
    flex: 1,
  },
});

const ProcessItem = (props) => {
  const { icon: Icon, isActive, value, label, onPress, disabled } = props;

  const handlePressed = useCallback(() => {
    if (onPress) onPress(value);
  }, [value, onPress]);

  return (
    <Pressable
      onPress={handlePressed}
      disabled={disabled}
      style={styles.container}
    >
      <Avatar
        size={60}
        backgroundColor={Colors.transparent}
        containerStyle={[
          gStyles.border,
          !disabled && styles.canPress,
          isActive && styles.active,
        ]}
        badgePosition={isActive ? "TOP_RIGHT" : null}
        badgeProps={
          isActive
            ? {
                backgroundColor: Colors.white,
                icon: Assets.icons.checkCircle,
                size: 16.67,
                iconStyle: {},
              }
            : {
                size: 0.1,
              }
        }
      >
        <Icon fill={isActive ? Colors.primary900 : Colors.neutral600} />
      </Avatar>
      <Text caption1 marginT-2 textBlackMedium={disabled}>
        {label}
      </Text>
    </Pressable>
  );
};

ProcessItem.defaultProps = {
  disabled: false,
};
ProcessItem.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.any,
  isActive: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

export default ProcessItem;
