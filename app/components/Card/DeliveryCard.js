import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";

import { Pressable } from "react-native";
import {
  Chip,
  Colors,
  Image,
  Text,
  Typography,
  View,
} from "react-native-ui-lib";

import {
  DefaultCar,
  SolidCancel,
  SolidCheckedCircle,
  SolidDraft,
  SolidPending,
} from "../../configs/assets";

import gStyles from "../../configs/gStyles";

import {
  DeliveryCompletionStates,
  DeliveryConfirmationState,
} from "../../helper/constants";

import { formatDate, formatTime } from "../../helper/utils";
import StateIcon from "../State/StateIcon";

const icon = {
  draft: SolidDraft,
  pending: SolidPending,
  rejected: SolidCancel,
  approved: SolidCheckedCircle,
};

const iconColors = {
  draft: "neutral",
  pending: "orange",
  rejected: "red",
  approved: "green",
};

const stateColors = {
  completed: "stateBlueDark",
  incompleted: "neutral700",
  unconfirmed: "stateRedDark",
};

const DeliveryCard = ({ schedule, onPress }) => {
  const uri =
    schedule.allocation.favoriteProduct?.favoriteModel.model.photo.url;

  const renderChip = useCallback(() => {
    let label, bg;

    if (schedule.completionState) {
      label = DeliveryCompletionStates[schedule.completionState];
      bg = stateColors[schedule.completionState];
    }

    if (schedule.confirmationState) {
      if (schedule.confirmationState === "confirmed") {
        return null;
      } else {
        label = DeliveryConfirmationState.unconfirmed;
        bg = stateColors.unconfirmed;
      }
    }

    if (!label && !bg) {
      return null;
    }

    return (
      <View row>
        <Chip
          labelStyle={[Typography.body2, { color: Colors.white }]}
          containerStyle={gStyles.border0}
          backgroundColor={Colors[bg]}
          label={label}
        />
      </View>
    );
  }, [schedule.completionState, schedule.confirmationState]);

  return (
    <Pressable onPress={onPress}>
      <View
        row
        centerV
        bg-surface
        paddingH-16
        paddingV-12
        style={gStyles.borderB}
      >
        <StateIcon
          icon={icon[schedule.state]}
          color={iconColors[schedule.state]}
        />
        <View marginH-8 flex centerV>
          <Text body2 marginB-4>
            {schedule.allocation.favoriteProduct.product.name}
          </Text>

          <View row>
            <Text body2>Số khung: </Text>
            <Text body2 textBlackMedium>
              {schedule.allocation.chassisNumber}
            </Text>
          </View>

          {schedule.date && schedule.startingTime && schedule.endingTime && (
            <View row>
              <Text body2>Thời gian: </Text>
              <Text body2 textBlackMedium>
                {formatDate(schedule.date)} {formatTime(schedule.startingTime)}
                {"-"}
                {formatTime(schedule.endingTime)}
              </Text>
            </View>
          )}
          {renderChip()}
        </View>

        <View center>
          {uri ? (
            <Image source={{ uri }} width={80} height={40} />
          ) : (
            <DefaultCar width={80} height={40} />
          )}
        </View>
      </View>
    </Pressable>
  );
};

DeliveryCard.propTypes = {
  onPress: PropTypes.func,
  schedule: PropTypes.object,
};

export default memo(DeliveryCard);
