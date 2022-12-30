import PropTypes from "prop-types";
import React, { memo, useMemo } from "react";

import { StyleSheet } from "react-native";
import { Avatar, Text, TouchableOpacity, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";
import { DeliveryConfirmationState } from "../../helper/constants";
import {
  checkTaskExpired,
  formatTime,
  getCustomerName,
} from "../../helper/utils";

const styles = StyleSheet.create({
  blue: {
    backgroundColor: colors.stateBlueLight,
    borderLeftColor: colors.stateBlueDefault,
    borderLeftWidth: 4,
  },
  green: {
    backgroundColor: colors.stateGreenLight,
    borderLeftColor: colors.stateGreenDefault,
    borderLeftWidth: 4,
  },
  red: {
    backgroundColor: colors.stateRedLight,
    borderLeftColor: colors.stateRedDefault,
    borderLeftWidth: 4,
  },
});

// delivery.state is approved
// approved - green
// approved - expired - red
// approved - confirmed - blue
const DeliveryScheduleCard = ({ delivery, onPress }) => {
  const style = useMemo(() => {
    if (delivery.confirmationState === DeliveryConfirmationState.confirmed) {
      return styles.blue;
    }

    if (checkTaskExpired(false, delivery.date, delivery.endingTime)) {
      return styles.red;
    }

    return styles.green;
  }, [delivery.confirmationState, delivery.date, delivery.endingTime]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View br10 marginT-8 paddingH-12 paddingV-10 style={style}>
        <View flex row spread>
          <Text overline uppercase>
            {getCustomerName(delivery.contract.customer)}
          </Text>
          <Text caption2>
            {formatTime(delivery.startingTime)}
            {" - "}
            {formatTime(delivery.endingTime)}
          </Text>
        </View>
        <View marginT-8 centerV row>
          <Avatar
            source={{ uri: delivery.account.avatar?.url }}
            name={delivery.account.name}
            size={20}
          />
          <Text marginL-4 caption1 style={gStyles.capitalize}>
            {delivery.account.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

DeliveryScheduleCard.propTypes = {
  delivery: PropTypes.shape({
    account: PropTypes.shape({
      avatar: PropTypes.shape({
        url: PropTypes.string,
      }),
      name: PropTypes.string,
    }),
    confirmationState: PropTypes.string,
    contract: PropTypes.shape({
      customer: PropTypes.object,
    }),
    date: PropTypes.string,
    endingTime: PropTypes.string,
    startingTime: PropTypes.string,
  }),
  onPress: PropTypes.func,
};

export default memo(DeliveryScheduleCard);
