import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Chip, Colors, Typography, View } from "react-native-ui-lib";
import gStyles from "../../../configs/gStyles";

const days = [
  { label: "7 ngày", value: 7 },
  { label: "14 ngày", value: 14 },
  { label: "1 tháng", value: 30 },
  { label: "2 tháng", value: 60 },
];

const DaySelect = ({ value, onSelect }) => {
  const handleSelect = useCallback(
    (day) => {
      if (onSelect) {
        onSelect(day.value);
      }
    },
    [onSelect]
  );

  return (
    <View row spread>
      {days.map((e) => (
        <Chip
          key={e.value}
          label={e.label}
          labelStyle={[
            Typography.caption1,
            e.value === value && { color: Colors.primary900 },
          ]}
          containerStyle={[
            gStyles.borderHalf,
            // eslint-disable-next-line react-native/no-inline-styles
            { paddingHorizontal: 8, paddingVertical: 8 },
            e.value === value && {
              backgroundColor: Colors.primary50,
              borderColor: Colors.primary100,
            },
          ]}
          onPress={() => handleSelect(e)}
        />
      ))}
    </View>
  );
};

DaySelect.propTypes = {
  value: PropTypes.number,
  onSelect: PropTypes.func,
};

export default DaySelect;
