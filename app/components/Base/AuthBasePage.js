import React from "react";
import PropTypes from "prop-types";

import { RefreshControl, ScrollView } from "react-native";
import { Colors, View, Keyboard } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";
import LoadingOverlay from "../Loading/LoadingOverlay";

const AuthBasePage = ({
  canPullToReload,
  children,
  hasScroll,
  loading,
  onRefresh,
  ...props
}) => {
  return (
    <View useSafeArea flex bg-white {...props}>
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
};

AuthBasePage.defaultProps = {
  hasScroll: true,
  canPullToReload: false,
  onRefresh: () => {},
};

AuthBasePage.propTypes = {
  canPullToReload: PropTypes.bool,
  children: PropTypes.node.isRequired,
  hasScroll: PropTypes.bool,
  loading: PropTypes.bool,
  onRefresh: PropTypes.func,
};

export default AuthBasePage;
