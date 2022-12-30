import React from "react";
import PropTypes from "prop-types";

import { RefreshControl, ScrollView } from "react-native";
import { Colors, View, Keyboard } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";
import LoadingOverlay from "../Loading/LoadingOverlay";

const BasePage = ({
  canPullToReload,
  children,
  hasScroll,
  loading,
  onRefresh,
  ...props
}) => (
  <View useSafeArea flex bg-background {...props}>
    {hasScroll ? (
      <ScrollView
        contentContainerStyle={gStyles.basePage}
        scrollEnabled={!loading}
        refreshControl={
          canPullToReload ? (
            <RefreshControl
              colors={[Colors.primary900]}
              tintColor={Colors.primary900}
              refreshing={loading}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    ) : (
      children
    )}
    {loading && <LoadingOverlay />}
    <Keyboard.KeyboardAwareInsetsView />
  </View>
);

BasePage.defaultProps = {
  hasScroll: true,
  loading: false,
  canPullToReload: false,
  onRefresh: () => {},
};

BasePage.propTypes = {
  canPullToReload: PropTypes.bool,
  children: PropTypes.node.isRequired,
  fab: PropTypes.node,
  hasScroll: PropTypes.bool,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default BasePage;