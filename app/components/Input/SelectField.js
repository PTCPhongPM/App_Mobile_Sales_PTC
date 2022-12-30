import PropTypes from "prop-types";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, TouchableOpacity } from "react-native-ui-lib";
import { ChevronRightSmall } from "../../configs/assets";
import { colors } from "../../configs/themes";

const styles = StyleSheet.create({
  error: {
    borderBottomColor: colors.stateRedDefault,
    borderBottomWidth: 1,
    borderRadius: 2,
  },
});

const SelectField = ({
  disabled,
  error,
  label,
  placeholder,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      row
      spread
      centerV
      paddingV-6
      paddingL-9
      onPress={onPress}
      disabled={disabled}
      style={error && styles.error}
      {...props}
    >
      <Text
        flex
        textBlackMedium={!label && !disabled && Boolean(placeholder)}
        textBlackLow={disabled}
      >
        {label || placeholder}
      </Text>
      <ChevronRightSmall
        fill={disabled ? colors.textBlackLow : colors.textBlackHigh}
      />
    </TouchableOpacity>
  );
};

SelectField.defaultProps = {
  disabled: false,
  error: false,
  placeholder: "",
  onPress: () => {},
};

SelectField.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  label: PropTypes.string,
  onPress: PropTypes.func,
  placeholder: PropTypes.string,
};

export default SelectField;
