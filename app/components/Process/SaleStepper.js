import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef } from "react";

import { FlatList, StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";

import { ProcessesLastIndex, SaleProcesses } from "../../helper/constants";
import StepChevron from "./StepChevron";

const styles = StyleSheet.create({
  first: {
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  last: {
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
});

const Processes = Object.values(SaleProcesses);

const SaleStepper = ({ value }) => {
  const indexOfSelected = Object.keys(SaleProcesses).indexOf(value);

  const ref = useRef();

  const renderChevron = useCallback(
    (index) => {
      if (index === ProcessesLastIndex) {
        return null;
      }
      if (index < indexOfSelected) {
        return (
          <StepChevron
            start={Colors.stateGreenDark}
            end={Colors.stateGreenDark}
          />
        );
      }
      if (index === indexOfSelected) {
        return <StepChevron />;
      }

      return <StepChevron start={Colors.neutral300} end={Colors.neutral300} />;
    },
    [indexOfSelected]
  );

  useEffect(() => {
    ref.current?.scrollToIndex({
      index: indexOfSelected,
      animated: true,
      viewPosition: 0.5,
    });
  }, [indexOfSelected]);

  const onScrollToIndexFailed = useCallback((info) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      ref.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0.5,
      });
    });
  }, []);

  return (
    <FlatList
      ref={ref}
      keyExtractor={(item) => item}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={indexOfSelected}
      data={Processes}
      onScrollToIndexFailed={onScrollToIndexFailed}
      renderItem={({ item, index }) => (
        <View row key={item}>
          <View
            row
            paddingH-8
            centerV
            style={[
              index === 0 && styles.first,
              index === item.length && styles.last,
            ]}
            bg-stateGreenDark={index <= indexOfSelected}
            bg-neutral300={index > indexOfSelected}
          >
            <Text caption1 textWhiteHigh={index <= indexOfSelected}>
              {item}
            </Text>
          </View>
          {renderChevron(index)}
        </View>
      )}
    />
  );
};

SaleStepper.propTypes = {
  value: PropTypes.string.isRequired,
};

export default SaleStepper;
