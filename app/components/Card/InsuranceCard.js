import PropTypes from "prop-types";
import React, { memo } from "react";

import { Text, TouchableOpacity, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";
import { ExtendedFormalities } from "../../helper/constants";
import { currencyFormatter, formatDate } from "../../helper/utils";

const InsuranceCard = ({ insurance, onPress, canPress }) => {
  const Container = canPress ? TouchableOpacity : View;

  return (
    <Container
      paddingH-16
      paddingV-12
      bg-surface
      style={gStyles.borderB}
      onPress={onPress}
    >
      <View flex row spread centerV>
        <Text subtitle2>{insurance.name}</Text>
        <Text body2>{formatDate(insurance.createdAt)}</Text>
      </View>
      <View flex row spread centerV>
        <Text body2>{ExtendedFormalities[insurance.method]}</Text>
        <Text body1>{currencyFormatter(insurance.total)}</Text>
      </View>
    </Container>
  );
};

InsuranceCard.defaultProps = {
  canPress: true,
  onPress: () => {},
};

InsuranceCard.propTypes = {
  canPress: PropTypes.bool,
  insurance: PropTypes.object,
  onPress: PropTypes.func,
};

export default memo(InsuranceCard);
