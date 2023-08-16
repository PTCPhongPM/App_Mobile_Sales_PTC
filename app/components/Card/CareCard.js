import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
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

const CareCard = ({ title, content, result, time,note }) => {
  const Icon = getIcon(title);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <View padding-16 row bg-surface style={gStyles.borderB}>
      <Avatar size={40} backgroundColor={Colors.neutral50}>
        <Icon fill={Colors.black} />
      </Avatar>
      <View marginL-8 flex>
        <View flex row>
          <Text flex style={styles.contentText}>
          {showMore ? content : (content?.length > 100 ? content?.substring(0, 100) + '...' : content)}
            {content?.length > 100 && (
              <TouchableOpacity onPress={handleShowMore}>
                <Text style={styles.showMoreText}>
                  {showMore ? " Thu gọn" : "Xem thêm"}
                </Text>
              </TouchableOpacity>
            )}
          </Text>
          <Text caption1 textBlackMedium>
            {time}
          </Text>
        </View>
        <Text body2>
          Ghi chú: {showMore ? note : (note?.length > 100 ? note?.substring(0, 100) + '...' : note)}
            {note?.length > 100 && (
              <TouchableOpacity onPress={handleShowMore}>
                <Text textBlackMedium>
                  {showMore ? " Thu gọn" : "Xem thêm"}
                </Text>
              </TouchableOpacity>
            )}
        </Text>
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
const styles = {
  contentText: {
    lineHeight: 20,
    color: "black",
    fontSize: 16,
  },
  showMoreText: {
    color: "#AEAEAE",
    textDecorationLine: "underline",
    marginTop: 4
  },
};
export default CareCard;
