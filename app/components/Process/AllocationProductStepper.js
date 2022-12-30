import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";

import { FlatList, StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import {
  AllocationStateObject,
  AllocationStates,
} from "../../helper/constants";

import StepChevron from "./StepChevron";

const styles = StyleSheet.create({
  first: {
    borderBottomLeftRadius: 2,
    borderTopLeftRadius: 2,
  },
  last: {
    borderBottomRightRadius: 2,
    borderTopRightRadius: 2,
  },
});

const lastIndex = AllocationStates.length - 1;

const bg = {
  allocated: "stateGreenDark",
  instock: "stateOrangeDark",
  ready: "stateRedDark",
  done: "stateBlueDark",
};

const AllocationProductStepper = ({ value }) => {
  const indexOfSelected = AllocationStates.indexOf(value);

  const renderChevron = useCallback(
    (item, index) => {
      if (index === lastIndex) {
        return null;
      }

      let start = Colors[bg[item]];
      let end = Colors.neutral300;

      if (index > indexOfSelected) {
        start = Colors.neutral300;
      } else if (index === indexOfSelected) {
        end = Colors.neutral300;
      } else {
        end = Colors[bg[AllocationStates[index + 1]]];
      }

      return <StepChevron start={start} end={end} height={20} width={6} />;
    },
    [indexOfSelected]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      <View row key={item}>
        <View
          row
          centerV
          paddingH-10
          height={20}
          style={[
            index === 0 && styles.first,
            index === lastIndex && styles.last,
            {
              backgroundColor:
                index > indexOfSelected ? Colors.neutral300 : Colors[bg[item]],
            },
          ]}
        >
          <Text caption1 textWhiteHigh>
            {AllocationStateObject[item]}
          </Text>
        </View>
        {renderChevron(item, index)}
      </View>
    ),
    [indexOfSelected, renderChevron]
  );

  return (
    <FlatList
      keyExtractor={(item) => item}
      horizontal={true}
      scrollEnabled={false}
      showsHorizontalScrollIndicator={false}
      data={AllocationStates}
      renderItem={renderItem}
    />
  );
};

AllocationProductStepper.propTypes = {
  value: PropTypes.string.isRequired,
};

export default memo(AllocationProductStepper);
