import React, { memo } from "react";
import PropTypes from "prop-types";

import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import { RadioChecked, RadioUnChecked } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

const TaskCard = ({
  checked,
  expired,
  name,
  time,
  title,
  onCheck,
  onPress,
  checkDisabled,
  ...props
}) => {
  const Icon = checked ? (
    <RadioChecked
      fill={checkDisabled ? Colors.textBlackLow : Colors.primary900}
    />
  ) : (
    <RadioUnChecked
      fill={checkDisabled ? Colors.textBlackLow : Colors.textBlackMedium}
    />
  );

  return (
    <TouchableOpacity
      row
      padding-16
      style={gStyles.borderB}
      onPress={onPress}
      {...props}
    >
      <Button link onPress={onCheck} disabled={checkDisabled}>
        {Icon}
      </Button>
      <View flex centerV>
        <View flex row>
          <Text flex style={checked && gStyles.lineThrough} marginH-8>
            {title}
          </Text>
          <Text caption1 textBlackMedium primary900={expired}>
            {time}
          </Text>
        </View>
        {Boolean(name) && (
          <View flex row>
            <Text marginL-8 body2>
              Khách hàng:{" "}
            </Text>
            <Text body2 textBlackMedium>
              {name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

TaskCard.propTypes = {
  checked: PropTypes.bool,
  checkDisabled: PropTypes.bool,
  expired: PropTypes.bool,
  name: PropTypes.string,
  onCheck: PropTypes.func,
  onPress: PropTypes.func,
  time: PropTypes.string,
  title: PropTypes.string,
};

export default memo(TaskCard);
