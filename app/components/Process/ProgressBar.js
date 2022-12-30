import PropTypes from "prop-types";
import React, { memo, useMemo } from "react";

import { Text, View } from "react-native-ui-lib";

const ProgressBar = ({ value, target, ...props }) => {
  const process = useMemo(
    () => (target ? `${Math.round((value / target) * 100)}%` : "0%"),
    [target, value]
  );

  return (
    <View bg-stateBlueLight br10 {...props}>
      <View
        bg-stateBlueDefault
        br10
        centerV
        flex
        height={32}
        paddingH-12
        right
        width={process}
      >
        <Text subtitle2 textWhiteHigh>
          {process}
        </Text>
      </View>
    </View>
  );
};

ProgressBar.defaultProps = {
  target: 0,
  value: 0,
};

ProgressBar.propTypes = {
  target: PropTypes.number,
  value: PropTypes.number,
};

export default memo(ProgressBar);
