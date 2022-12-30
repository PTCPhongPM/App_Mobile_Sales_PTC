import React from "react";

import PropTypes from "prop-types";
import { Text, View } from "react-native-ui-lib";

const ScoreCard = ({ title, number, icon, ...props }) => (
  <View flex br30 paddingT-8 paddingL-8 {...props}>
    <Text subtitle2 textWhiteHigh>
      {title}
    </Text>
    <View row spread centerV>
      <Text title textWhiteHigh>
        {number || 0}
      </Text>
      <View height={60} bottom>
        {icon}
      </View>
    </View>
  </View>
);

ScoreCard.propTypes = {
  icon: PropTypes.any,
  number: PropTypes.number,
  title: PropTypes.string,
};

export default ScoreCard;
