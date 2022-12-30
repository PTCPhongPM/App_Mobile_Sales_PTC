import React, { useCallback, useRef } from "react";
import PropTypes from "prop-types";

import { StyleSheet } from "react-native";

import { RectButton, Swipeable } from "react-native-gesture-handler";

import Animated from "react-native-reanimated";

import { Text, View } from "react-native-ui-lib";

const styles = StyleSheet.create({
  animatedView: {
    flex: 1,
    transform: [{ translateX: 0 }],
  },
  rightAction: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

const SwipeWrapper = ({ children, rightActions, leftActions }) => {
  const ref = useRef();

  const close = useCallback(() => ref.current.close(), []);

  const renderActions = useCallback(
    (progress, actions) => {
      if (!actions) return null;
      const totalWidth = actions.reduce(
        (total, e) => total + (e.width || 92),
        0
      );

      return (
        <View row style={{ width: totalWidth }}>
          {actions.map((action) => {
            const width = action.width || 92;

            // const trans = progress.interpolate({
            progress.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            });

            return (
              <Animated.View style={styles.animatedView} key={action.text}>
                <RectButton
                  style={[
                    styles.rightAction,
                    { backgroundColor: action.color },
                  ]}
                  onPress={() => {
                    close();
                    action.onPress();
                  }}
                >
                  {action.icon}
                  <Text subtitle2 textWhiteHigh>
                    {action.text}
                  </Text>
                </RectButton>
              </Animated.View>
            );
          })}
        </View>
      );
    },
    [close]
  );

  const renderLeftButtons = useCallback(
    (progress) => renderActions(progress, leftActions),
    [leftActions, renderActions]
  );

  const renderRightButtons = useCallback(
    (progress) => renderActions(progress, rightActions),
    [renderActions, rightActions]
  );

  return (
    <Swipeable
      ref={ref}
      friction={2}
      leftThreshold={30}
      rightThreshold={30}
      renderLeftActions={renderLeftButtons}
      renderRightActions={renderRightButtons}
    >
      {children}
    </Swipeable>
  );
};

SwipeWrapper.defaultProps = {
  rightActions: [],
  leftActions: [],
};
SwipeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  rightActions: PropTypes.any,
  leftActions: PropTypes.any,
};

export default SwipeWrapper;
