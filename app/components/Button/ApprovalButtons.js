import PropTypes from "prop-types";
import React, { memo } from "react";

import { Button, Colors, Text, View } from "react-native-ui-lib";
import { SolidCancel, SolidCheckedCircle } from "../../configs/assets";

const ApprovalButtons = ({ onReject, onApprove }) => (
  <View row paddingH-16 paddingV-4>
    <Button br10 flex bg-stateRedDefault marginR-8 onPress={onReject}>
      <SolidCancel fill={Colors.textWhiteHigh} width={20} height={20} />
      <Text textWhiteHigh marginL-8>
        Từ chối
      </Text>
    </Button>
    <Button br10 flex bg-stateGreenDefault onPress={onApprove}>
      <SolidCheckedCircle fill={Colors.textWhiteHigh} width={20} height={20} />
      <Text textWhiteHigh marginL-8>
        Phê duyệt
      </Text>
    </Button>
  </View>
);

ApprovalButtons.propTypes = {
  onApprove: PropTypes.func,
  onReject: PropTypes.func,
};

export default memo(ApprovalButtons);
