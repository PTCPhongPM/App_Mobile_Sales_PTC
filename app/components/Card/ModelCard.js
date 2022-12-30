import React, { memo } from "react";
import PropTypes from "prop-types";

import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { DefaultCar } from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { currencyFormatter } from "../../helper/utils";

const ModelCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View row spread paddingH-16 paddingV-8 bg-white style={gStyles.borderB}>
      <View centerV>
        <Text uppercase overline textBlackMedium>
          {item.brand.description}
        </Text>
        <Text uppercase subtitle1 primary900 marginV-4>
          {item.description}
        </Text>
        <Text body2>
          Từ: {currencyFormatter(item.products?.[0]?.listedPrice)}
        </Text>
      </View>
      <View center>
        {item.products?.[0]?.photo?.url ? (
          <Image
            source={{ uri: item.products?.[0]?.photo?.url }}
            width={160}
            height={96}
          />
        ) : (
          <DefaultCar width={160} height={96} />
        )}
      </View>
    </View>
  </TouchableOpacity>
);

ModelCard.propTypes = {
  item: PropTypes.shape({
    brand: PropTypes.shape({
      description: PropTypes.string,
    }),
    description: PropTypes.string,
    products: PropTypes.array,
  }),
  onPress: PropTypes.func,
};

export default memo(ModelCard);
