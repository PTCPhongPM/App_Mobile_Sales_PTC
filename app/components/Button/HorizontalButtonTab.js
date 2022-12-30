import React, { memo } from "react";
import PropTypes from "prop-types";

import { FlatList } from "react-native";
import { Button, Text, View } from "react-native-ui-lib";

const HorizontalButtonTab = ({ buttons, selected, onPress }) => (
  <View paddingV-8 bg-surface>
    <FlatList
      keyExtractor={(item) => item.id}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      data={buttons}
      renderItem={({ item, index }) => (
        <Button
          key={item.id}
          marginH-4
          marginL-16={index === 0}
          paddingH-12
          paddingV-8
          onPress={() => onPress(item.id)}
          bg-neutral100
          bg-primary50={item.id === selected}
        >
          <Text caption1 primary900={item.id === selected}>
            {item.label}
            {item.value !== undefined && ` (${item.value})`}
          </Text>
        </Button>
      )}
    />
  </View>
);

HorizontalButtonTab.propTypes = {
  buttons: PropTypes.array,
  onPress: PropTypes.func,
  selected: PropTypes.string,
};

export default memo(HorizontalButtonTab);
