import React from "react";
import PropTypes from "prop-types";

import { Pressable } from "react-native";
import {
  Chip,
  Colors,
  Image,
  Text,
  Typography,
  View,
} from "react-native-ui-lib";
import StateIcon from "../State/StateIcon";

import {
  DefaultCar,
  SolidCancel,
  SolidCheckedCircle,
  SolidDraft,
  SolidPending,
} from "../../configs/assets";

import { TestDriveStateObject, TestDriveStates } from "../../helper/constants";
import { formatDate, formatTime, getCustomerName } from "../../helper/utils";

import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";

const icon = {
  draft: SolidDraft,
  created: SolidPending,
  rejected: SolidCancel,
  approved: SolidCheckedCircle,
  done: SolidCheckedCircle,
  incomplete: SolidCheckedCircle,
};

const iconColors = {
  draft: "neutral",
  created: "orange",
  rejected: "red",
  approved: "green",
  done: "green",
  incomplete: "green",
};

const chipColors = {
  done: colors.stateBlueDark,
  incomplete: colors.stateRedDark,
};

// isGeneralMode show name, ...
const TestDriveCard = ({ testDrive, isGeneralMode, onPress }) => {
  const isShowState = [
    TestDriveStateObject.done,
    TestDriveStateObject.incomplete,
  ].includes(testDrive.state);
  const uri = testDrive.testProduct.model.photo.url;

  return (
    <Pressable onPress={onPress} style={gStyles.borderB}>
      <View row centerV bg-surface paddingH-16 paddingV-12>
        <StateIcon
          icon={icon[testDrive.state]}
          color={iconColors[testDrive.state]}
        />
        <View marginH-8 flex>
          <Text subtitle1 marginB-4>
            {isGeneralMode
              ? getCustomerName(testDrive.customer)
              : testDrive.testProduct.model.description}
          </Text>

          <View row>
            <Text body2>Thời gian: </Text>
            <Text textBlackMedium body2>
              {formatDate(testDrive.drivingDate)}{" "}
              {formatTime(testDrive.startingTime)}
              {"-"}
              {formatTime(testDrive.endingTime)}
            </Text>
          </View>
          {isShowState && (
            <View row>
              <Chip
                labelStyle={[Typography.body2, { color: Colors.white }]}
                backgroundColor={chipColors[testDrive.state]}
                containerStyle={gStyles.border0}
                label={TestDriveStates[testDrive.state]}
              />
            </View>
          )}
        </View>

        <View center>
          {uri ? (
            <Image
              source={{ uri }}
              width={isGeneralMode ? 60 : 80}
              height={isGeneralMode ? 30 : 40}
            />
          ) : (
            <DefaultCar width={80} height={40} />
          )}
          {isGeneralMode && (
            <Text caption1 marginT-4>
              {testDrive.testProduct.model.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

TestDriveCard.defaultProps = {
  testDrive: {
    state: "draft",
  },
};

TestDriveCard.propTypes = {
  isGeneralMode: PropTypes.bool,
  onPress: PropTypes.func,
  state: PropTypes.string,
  testDrive: PropTypes.shape({
    customer: PropTypes.object,
    drivingDate: PropTypes.string,
    endingTime: PropTypes.string,
    startingTime: PropTypes.string,
    state: PropTypes.string,
    testProduct: PropTypes.shape({
      model: PropTypes.shape({
        description: PropTypes.string,
        photo: PropTypes.shape({
          url: PropTypes.string,
        }),
      }),
    }),
  }),
};

export default TestDriveCard;
