import React, { memo, useState } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";
import { Incubator } from "react-native-ui-lib";
import { colors, typography } from "../../configs/themes";

const styles = StyleSheet.create({
  style: {
    ...typography.body1,
    borderRadius: 2,
    minHeight: 32,
    padding: 6,
  },
  styleDisabled: {
    backgroundColor: colors.transparent,
    borderWidth: 0,
    color: colors.textBlackLow,
  },
  styleError: {
    backgroundColor: colors.neutral50,
    borderBottomWidth: 1,
    borderColor: colors.stateRedDefault,
  },
  styleFocus: {
    backgroundColor: colors.neutral50,
    borderBottomWidth: 1,
    borderColor: colors.stateBlueDefault,
  },
});

const { TextField } = Incubator;

const TextInput = ({
  disabled,
  isError,
  placeholderTextColor,
  style,
  onBlur,
  onFocus,
  ...props
}) => {
  const [isFocus, setFocus] = useState(false);

  return (
    <TextField
      style={[
        styles.style,
        isFocus && styles.styleFocus,
        style,
        isError && styles.styleError,
        disabled && styles.styleDisabled,
      ]}
      placeholderTextColor={
        disabled ? colors.textBlackLow : placeholderTextColor
      }
      editable={!disabled}
      // selectTextOnFocus={!disabled}
      onFocus={() => {
        setFocus(true);
        onFocus();
      }}
      onBlur={() => {
        setFocus(false);
        onBlur();
      }}
      {...props}
    />
  );
};

TextInput.defaultProps = {
  disabled: false,
  isError: false,
  onBlur: () => {},
  onFocus: () => {},
  placeholderTextColor: colors.textBlackMedium,
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  isError: PropTypes.bool,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholderTextColor: PropTypes.string,
  style: PropTypes.object,
};

export default memo(TextInput);
