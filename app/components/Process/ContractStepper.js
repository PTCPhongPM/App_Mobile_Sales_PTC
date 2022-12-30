import PropTypes from "prop-types";
import React, { memo, useCallback } from "react";

import { FlatList, StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";

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

const arr = ["Phân xe cho HĐ", "Hoàn tất giao xe"];

const ContractStepper = ({ value }) => {
  const indexOfSelected = arr.indexOf(value);

  const renderChevron = useCallback(
    (index) => {
      if (index === 1) {
        return null;
      }
      if (index < indexOfSelected) {
        return (
          <StepChevron
            start={Colors.stateGreenDark}
            end={Colors.stateGreenDark}
            height={20}
            width={6}
          />
        );
      }
      if (index === indexOfSelected) {
        return <StepChevron height={20} width={6} />;
      }

      return (
        <StepChevron
          start={Colors.neutral300}
          end={Colors.neutral300}
          height={20}
          width={6}
        />
      );
    },
    [indexOfSelected]
  );

  return (
    <View>
      <FlatList
        keyExtractor={(item) => item}
        horizontal={true}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={arr}
        renderItem={({ item, index }) => (
          <View row key={item}>
            <View
              row
              centerV
              paddingH-10
              height={20}
              style={[
                index === 0 && styles.first,
                index === item.length && styles.last,
              ]}
              bg-stateGreenDark={index <= indexOfSelected}
              bg-neutral300={index > indexOfSelected}
            >
              <Text caption1 textWhiteHigh>
                {item}
              </Text>
            </View>
            {renderChevron(index)}
          </View>
        )}
      />
    </View>
  );
};

ContractStepper.propTypes = {
  value: PropTypes.any,
};

export default memo(ContractStepper);
