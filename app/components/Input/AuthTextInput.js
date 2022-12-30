import PropTypes from "prop-types";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Colors, Incubator, View } from "react-native-ui-lib";
import { colors, typography } from "../../configs/themes";

const styles = StyleSheet.create({
  helper: {
    ...typography.caption1,
    marginTop: 3,
  },
  helperError: {
    color: colors.stateRedDark,
  },
  labelStyle: {
    ...typography.subtitle2,
    color: colors.black,
  },
  pr60: {
    paddingRight: 60,
  },
  style: {
    ...typography.body1,
    backgroundColor: colors.neutral50,
    borderRadius: 8,
    height: 48,
    padding: 12,
  },
  styleDisabled: {
    backgroundColor: colors.neutral200,
    borderWidth: 0,
    color: colors.textBlackLow,
  },
  styleError: {
    borderColor: colors.stateRedDefault,
    borderWidth: 1,
  },
  styleFocus: {
    backgroundColor: colors.transparent,
    borderColor: colors.black,
    borderWidth: 1,
  },
});

const { TextField } = Incubator;

const AuthTextInput = ({
  style,
  labelStyle,
  placeholderTextColor,
  helperStyle,
  helper,
  isError,
  disabled,
  trailingAccessory,
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
        Boolean(trailingAccessory) && styles.pr60,
        isError && styles.styleError,
        disabled && styles.styleDisabled,
      ]}
      labelStyle={[styles.labelStyle, labelStyle]}
      placeholderTextColor={placeholderTextColor}
      validationMessage={helper}
      validationMessageStyle={[
        styles.helper,
        !disabled && isError && styles.helperError,
        helperStyle,
      ]}
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
      trailingAccessory={<View absR>{trailingAccessory}</View>}
      {...props}
    />
  );
};

AuthTextInput.defaultProps = {
  disabled: false,
  isError: false,
  helper: "",
  helperStyle: {},
  labelStyle: {},
  onBlur: () => {},
  onFocus: () => {},
  placeholderTextColor: Colors.textBlackMedium,
};

AuthTextInput.propTypes = {
  disabled: PropTypes.bool,
  isError: PropTypes.bool,
  helper: PropTypes.string,
  helperStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholderTextColor: PropTypes.string,
  style: PropTypes.object,
  trailingAccessory: PropTypes.any,
};

export default AuthTextInput;
