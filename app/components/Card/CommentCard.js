import React, { memo } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import { Avatar, Colors, Text, View } from "react-native-ui-lib";

import { Personal } from "../../configs/assets";

import gStyles from "../../configs/gStyles";

import { upperFirst } from "../../helper/utils";

const CommentCard = ({ comment }) => (
  <View row paddingH-16 paddingV-16 style={gStyles.borderB}>
    {comment.account.avatar ? (
      <Avatar
        name={comment.account.name}
        source={{ uri: comment.account.avatar?.url }}
        size={32}
      />
    ) : (
      <Personal width={32} height={32} fill={Colors.textBlackHigh} />
    )}
    <View flex marginL-8 marginB-4>
      <View row spread>
        <Text flex caption1 textBlackMedium style={gStyles.capitalize}>
          {comment.account.name}
        </Text>
        <Text caption1 textBlackMedium>
          {upperFirst(dayjs(comment.createdAt).fromNow())}
        </Text>
      </View>
      <Text body2>{comment.message}</Text>
    </View>
  </View>
);

CommentCard.propTypes = {
  comment: PropTypes.shape({
    account: PropTypes.shape({
      avatar: PropTypes.shape({
        url: PropTypes.string,
      }),
      name: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    message: PropTypes.string,
  }),
};

export default memo(CommentCard);
