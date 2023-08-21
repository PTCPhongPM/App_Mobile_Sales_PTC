import PropTypes from "prop-types";
import React, { memo, useMemo } from "react";

import { StyleSheet } from "react-native";
import { Avatar, Text, TouchableOpacity, View } from "react-native-ui-lib";

import { colors } from "../../configs/themes";
import {
  checkTaskExpired,
  formatTime,
  getCustomerName,
} from "../../helper/utils";

import { TestDriveStateObject } from "../../helper/constants";
import gStyles from "../../configs/gStyles";
import dayjs from "dayjs";
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

// testDrive only has approved/done - filter by api call in TestDriveSchedule
const TestDriveScheduleCard = ({ testDrive, onPress }) => {
  const style = useMemo(() => {
    if (testDrive.state === TestDriveStateObject.done) {
      return styles.blue;
    }

    if (testDrive.state === TestDriveStateObject.approved) {
      if (
        checkTaskExpired(false, testDrive.drivingDate, testDrive.endingTime + ":00")
      ) {
        return styles.red;
      } else {
        return styles.green;
      }
    }

    return styles.green;
  }, [testDrive.drivingDate, testDrive.endingTime, testDrive.state]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View br10 marginT-8 paddingH-12 paddingV-10 style={style}>
        <View flex row spread>
          <Text overline uppercase>
            {getCustomerName(testDrive.customer)}
          </Text>
          <Text caption2>
            {formatTime(testDrive.startingTime)}
            {" - "}
            {formatTime(testDrive.endingTime)}
          </Text>
        </View>
        <View marginT-8 centerV row>
          <Avatar
            name={testDrive.account.name}
            source={{ uri: testDrive.account.avatar?.url }}
            size={20}
          />
          <Text marginL-4 caption1 style={gStyles.capitalize}>
            {testDrive.account.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

TestDriveScheduleCard.propTypes = {
  onPress: PropTypes.func,
  testDrive: PropTypes.shape({
    account: PropTypes.shape({
      avatar: PropTypes.shape({
        url: PropTypes.string,
      }),
      name: PropTypes.string,
    }),
    customer: PropTypes.object,
    drivingDate: PropTypes.string,
    endingTime: PropTypes.string,
    startingTime: PropTypes.string,
    state: PropTypes.oneOf([
      TestDriveStateObject.approved,
      TestDriveStateObject.done,
    ]),
  }),
};

export default memo(TestDriveScheduleCard);
