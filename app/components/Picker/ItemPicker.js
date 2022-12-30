import PropTypes from "prop-types";
import React, { memo } from "react";
import { Colors, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Checked } from "../../configs/assets";

const ItemPicker = ({ title, subtitle, onPress, selected }) => (
  <TouchableOpacity paddingH-16 onPress={onPress}>
    <View flex row spread centerV>
      <View marginV-8>
        <Text>{title}</Text>
        {subtitle && (
          <Text caption1 textBlackMedium>
            {subtitle}
          </Text>
        )}
      </View>
      {selected && <Checked fill={Colors.primary900} />}
    </View>
    <View bg-divider height={0.5} />
  </TouchableOpacity>
);

ItemPicker.defaultProps = {
  selected: false,
  onPress: () => {},
};

ItemPicker.propTypes = {
  onPress: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default memo(ItemPicker);
