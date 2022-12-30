import React, { memo, useState } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";
import { Button, Dialog, Incubator, Text, View } from "react-native-ui-lib";

import { colors } from "../../configs/themes";
import gStyles from "../../configs/gStyles";

const separatorColor = "#00000005";
const styles = StyleSheet.create({
  separators: {
    backgroundColor: separatorColor,
    borderColor: separatorColor,
    borderRadius: 10,
    marginHorizontal: 16,
    paddingVertical: 6,
  },
});

const BottomWheelPicker = ({
  visible,
  items,
  initialValue,
  onCancel,
  onChange,
  onDismiss,
  ...props
}) => {
  const [value, setValue] = useState(items && items.length && items[0].value);

  return (
    <Dialog
      containerStyle={gStyles.dialog}
      bottom
      width="100%"
      visible={visible}
      onDismiss={onDismiss}
      numberOfVisibleRows={3}
      ignoreBackgroundPress={true}
      {...props}
    >
      <View
        row
        spread
        paddingH-24
        paddingV-16
        style={gStyles.borderB}
        bg-textWhiteMedium
      >
        {onCancel ? (
          <Button
            link
            onPress={() => {
              onCancel();
              onDismiss();
            }}
          >
            <Text subtitle1>Hủy</Text>
          </Button>
        ) : (
          <View />
        )}
        <Button
          link
          onPress={() => {
            onChange(value);
            onDismiss();
          }}
        >
          <Text subtitle1 stateBlueDefault>
            Chọn
          </Text>
        </Button>
      </View>

      <Incubator.WheelPicker
        activeTextColor={colors.textBlackHigh}
        // activeTextColor={Colors.stateBlueDefault}
        numberOfVisibleRows={4}
        inactiveTextColor={colors.textBlackMedium}
        separatorsStyle={styles.separators}
        items={items}
        initialValue={
          typeof initialValue === "object" ? undefined : initialValue
        }
        onChange={setValue}
      />
    </Dialog>
  );
};

BottomWheelPicker.defaultProps = {
  visible: false,
  onCancel: () => {},
  onChange: () => {},
  onDismiss: () => {},
};

BottomWheelPicker.propTypes = {
  items: PropTypes.array,
  initialValue: PropTypes.any,
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  onChange: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default memo(BottomWheelPicker);
