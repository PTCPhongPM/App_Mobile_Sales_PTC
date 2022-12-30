import React, { memo } from "react";
import PropTypes from "prop-types";

import { Text, View } from "react-native-ui-lib";
import BasePage from "../../components/Base/BasePage";

const ReasonReject = ({ route }) => (
  <BasePage>
    <View bg-surface padding-16>
      <Text>{route.params.reason}</Text>
    </View>
  </BasePage>
);

ReasonReject.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      reason: PropTypes.string,
    }),
  }),
};

export default memo(ReasonReject);
