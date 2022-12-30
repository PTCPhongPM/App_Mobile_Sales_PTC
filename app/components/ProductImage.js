import React, { memo } from "react";
import PropTypes from "prop-types";

import { Image, Text, View } from "react-native-ui-lib";
import { DefaultCar } from "../configs/assets";

const ProductImage = ({ uri, name, ...props }) => (
  <View center row paddingV-8 {...props}>
    {uri ? (
      <Image source={{ uri }} width={70} height={32} resizeMode="contain" />
    ) : (
      <DefaultCar width={70} height={32} />
    )}
    <Text subtitle1 textBlackHigh textBlackMedium={!name} marginL-8>
      {name || "Chọn"}
    </Text>
  </View>
);

ProductImage.propTypes = {
  name: PropTypes.string,
  uri: PropTypes.string,
};

export default memo(ProductImage);
