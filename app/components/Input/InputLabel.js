import PropTypes from "prop-types";
import React from "react";
import { Colors, Text } from "react-native-ui-lib";

const InputLabel = ({ text, required }) => {
  return (
    <Text
      flex
      body2
      neutral400
      highlightString="*"
      highlightStyle={{ color: Colors.stateRedDefault }}
    >
      {text}
      {required && "*"}
    </Text>
  );
};

InputLabel.propTypes = {
  required: PropTypes.bool,
  text: PropTypes.string,
};

export default InputLabel;
