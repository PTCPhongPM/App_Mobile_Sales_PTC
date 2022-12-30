import React from "react";
import PropTypes from "prop-types";

import { Avatar, Colors, Text, View } from "react-native-ui-lib";
import {
  More,
  SolidCall,
  SolidGroup,
  SolidMail,
  SolidSms,
} from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { SaleActivities } from "../../helper/constants";

const getIcon = (title) => {
  switch (title) {
    case SaleActivities.meet:
    case SaleActivities.outsideMeet:
      return SolidGroup;
    case SaleActivities.message:
      return SolidSms;
    case SaleActivities.call:
      return SolidCall;
    case SaleActivities.email:
      return SolidMail;
    default:
      return More;
  }
};

const CareCard = ({ title, result, time }) => {
  const Icon = getIcon(title);

  return (
    <View padding-16 row bg-surface style={gStyles.borderB}>
      <Avatar size={40} backgroundColor={Colors.neutral50}>
        <Icon fill={Colors.black} />
      </Avatar>
      <View marginL-8 flex>
        <View flex row>
          <Text flex>{title}</Text>
          <Text caption1 textBlackMedium>
            {time}
          </Text>
        </View>
        <Text body2>
          <Text>Kết quả: </Text>
          <Text textBlackMedium>{result}</Text>
        </Text>
      </View>
    </View>
  );
};

CareCard.propTypes = {
  result: PropTypes.string,
  time: PropTypes.string,
  title: PropTypes.string,
};

export default CareCard;
