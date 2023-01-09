import React from "react";
import PropTypes from "prop-types";

import { Pressable } from "react-native";
import { Text, TouchableOpacity, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";

import { SaleProcesses } from "../../helper/constants";

import SaleStepper from "../Process/SaleStepper";
import CarCard from "./CarCard";

const FavoriteModelCard = ({ item, isBought, onUpdate, onPress, isNotMe }) => (
  <View bg-surface marginB-12 style={gStyles.borderT}>
    <View style={gStyles.borderB}>
      <View paddingH-16 paddingV-8>
        <View row spread centerV>
          <Pressable onPress={onPress}>
            <Text
              subtitle1
              primary900
            >{`${item.model.description} ${item.products[0]?.product.name}`}</Text>
            <Text>
              <Text body2>Quy trình: </Text>
              <Text body2 textBlackMedium>
                {SaleProcesses[item.process]}
              </Text>
            </Text>
          </Pressable>
          {onUpdate && !isNotMe &&(
            <TouchableOpacity
              onPress={onUpdate}
              bg-surface
              height={24}
              paddingV-2
              paddingH-10
              br100
              style={[gStyles.border, gStyles.shadow]}
            >
              <Text subtitle2 primary900>
                Cập nhật
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {!isBought && (
        <View paddingH-16 paddingV-8>
          <SaleStepper value={item.process} />
        </View>
      )}
    </View>
    {item.products.map((element) => (
      <CarCard
        key={element.id}
        model={element.product.name}
        color={element.exteriorColor.name}
        inside={element.interiorColor?.name}
        image={element.photo?.url}
      />
    ))}
  </View>
);

FavoriteModelCard.propTypes = {
  isBought: PropTypes.bool,
  item: PropTypes.shape({
    model: PropTypes.shape({
      description: PropTypes.string,
    }),
    process: PropTypes.string,
    products: PropTypes.array,
  }),
  onPress: PropTypes.func,
  onUpdate: PropTypes.func,
};

export default FavoriteModelCard;
