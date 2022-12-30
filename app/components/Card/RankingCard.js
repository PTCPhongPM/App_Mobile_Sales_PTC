import React, { memo } from "react";
import PropTypes from "prop-types";

import { Avatar, Text, View } from "react-native-ui-lib";

import { RankObject } from "../../helper/constants";

const RankingCard = ({ highlightBg, highlightIndex, item, type }) => (
  <View row bg-primary500={highlightBg} centerV paddingH-16 height={60}>
    <Text
      flex
      primary900
      textWhiteHigh={highlightBg}
      rank2
      rank1={item[RankObject[type].rank] <= highlightIndex}
    >
      {item[RankObject[type].rank]}
    </Text>
    <View flex-6 row centerV>
      <Avatar
        name={item.account.name}
        autoColorsConfig
        source={{ uri: item.account.avatar?.url }}
        size={40}
        resizeMode="cover"
      />

      <View flex marginL-8>
        <Text subtitle1 textWhiteHigh={highlightBg}>
          {item.account.name}
        </Text>
        <Text caption1 marginT-4 textWhiteHigh={highlightBg} numberOfLines={1}>
          {item.account.branch.name}
        </Text>
      </View>
    </View>
    <Text subtitle2 textWhiteHigh={highlightBg}>
      {item[RankObject[type].quantity]} xe
    </Text>
  </View>
);

RankingCard.defaultProps = {
  highlightIndex: 3,
};

RankingCard.propTypes = {
  highlightBg: PropTypes.bool,
  highlightIndex: PropTypes.number,
  index: PropTypes.number,
  item: PropTypes.shape({
    account: PropTypes.shape({
      avatar: PropTypes.shape({
        url: PropTypes.string,
      }),
      branch: PropTypes.shape({
        name: PropTypes.string,
      }),
      name: PropTypes.string,
    }),
  }),
  type: PropTypes.oneOf(["deliveryRank", "signingRank"]),
};

export default memo(RankingCard);
