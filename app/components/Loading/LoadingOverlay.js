import React from "react";

import { ActivityIndicator } from "react-native";
import { Colors, View } from "react-native-ui-lib";

const LoadingOverlay = () => (
  <View abs absV absH center bg-textWhiteLow>
    <ActivityIndicator size={48} color={Colors.primary900} />
  </View>
);

export default LoadingOverlay;
