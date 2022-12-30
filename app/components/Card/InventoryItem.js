import React from "react";
import PropTypes from "prop-types";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { DefaultCar } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

const InventoryItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View flex row paddingV-12 paddingH-16 style={gStyles.borderB}>
        <View flex>
          <Text overline textBlackMedium>
            {item.model?.brand?.code}
          </Text>
          <Text subtitle1 primary900 marginT-4>
            {item.model?.code}
          </Text>
          <View marginT-4>
            {item.model?.photo?.url ? (
              <Image
                source={{ uri: item.model?.photo?.url }}
                width={140}
                height={70}
              />
            ) : (
              <DefaultCar width={140} height={70} />
            )}
          </View>
        </View>
        <View flex>
          <Text overline textBlackMedium>
            TỒN KHO
          </Text>
          <View row spread marginT-4>
            <Text body2 textBlackHigh>
              Kho đại lý
            </Text>
            <Text body2 textBlackHigh>
              {item.totalI}
            </Text>
          </View>
          <View row spread marginT-7>
            <Text body2 textBlackHigh>
              Xe đã đặt
            </Text>
            <Text body2 textBlackHigh>
              {item.totalB}
            </Text>
          </View>
          <View row spread marginT-7>
            <Text body2 textBlackHigh>
              Xe đang về
            </Text>
            <Text body2 textBlackHigh>
              {item.totalC}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

InventoryItem.propTypes = {
  item: PropTypes.object,
  onPress: PropTypes.func,
};

export default InventoryItem;
