import React, { memo } from "react";
import PropTypes from "prop-types";

import { Text, View } from "react-native-ui-lib";
import ProgressBar from "../../components/Process/ProgressBar";

import gStyles from "../../configs/gStyles";

const DashboardTargetSection = ({ myRank }) => {
  if (!myRank) return null;

  return (
    <View
      bg-surface
      padding-16
      marginT-16
      marginB-8
      style={[gStyles.borderV, gStyles.shadow]}
    >
      <Text subtitle1>
        Theo dõi mục tiêu tháng {myRank.month}/{myRank.year}
      </Text>

      <ProgressBar
        value={myRank.signed}
        target={myRank.signingTarget}
        marginT-10
      />
      <View row spread centerV margin-4>
        <Text subtitle2>
          Xe ký {myRank.signed}/{myRank.signingTarget}
        </Text>
        <Text caption1>Xếp hạng: {myRank.signingRank}</Text>
      </View>

      <ProgressBar
        value={myRank.delivered}
        target={myRank.deliveryTarget}
        marginT-10
      />
      <View row spread centerV margin-4>
        <Text subtitle2>
          Xe xuất {myRank.delivered}/{myRank.deliveryTarget}
        </Text>
        <Text caption1>Xếp hạng: {myRank.deliveryRank}</Text>
      </View>
    </View>
  );
};

DashboardTargetSection.propTypes = {
  myRank: PropTypes.shape({
    delivered: PropTypes.number,
    deliveryRank: PropTypes.number,
    deliveryTarget: PropTypes.number,
    month: PropTypes.number,
    signed: PropTypes.number,
    signingRank: PropTypes.number,
    signingTarget: PropTypes.number,
    year: PropTypes.number,
  }),
};

export default memo(DashboardTargetSection);
