import PropTypes from "prop-types";
import React, { memo } from "react";

import {
  Colors,
  Image,
  Text,
  TouchableOpacity,
  Typography,
  View,
} from "react-native-ui-lib";
import { Checked, DefaultCar } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import { formatDate } from "../../helper/utils";

import AllocationProductStepper from "../Process/AllocationProductStepper";

const AllocationProductCard = ({ item, canSelect, selected, onSelect }) => {
  const uri = item.favoriteProduct.favoriteModel?.model.photo.url;

  const Container = canSelect ? TouchableOpacity : View;

  return (
    <Container onPress={onSelect}>
      <View
        bg-surface
        padding-16
        style={gStyles.borderB}
        bg-stateGreenLight={selected}
      >
        <View flex row marginB-5>
          <View marginR-16 center>
            {uri ? (
              <Image
                source={{ uri }}
                width={60}
                height={30}
                resizeMode="contain"
              />
            ) : (
              <DefaultCar width={60} height={30} />
            )}
            <Text caption1>{item.favoriteProduct.product.name}</Text>
          </View>
          <View flex>
            <Text
              body2
              textBlackMedium
              highlightString="Số khung"
              highlightStyle={Typography.body2}
            >
              Số khung: {item.chassisNumber.toUpperCase()}
            </Text>
            <Text
              body2
              textBlackMedium
              highlightString="Số máy"
              highlightStyle={Typography.body2}
            >
              Số máy: {item.engineNumber}
            </Text>
            {item.arrivalDate && (
              <Text
                body2
                textBlackMedium
                highlightString="Ngày về dự kiến"
                highlightStyle={Typography.body2}
              >
                Ngày về dự kiến: {formatDate(item.arrivalDate)}
              </Text>
            )}
          </View>
          {canSelect && selected && <Checked fill={Colors.stateGreenDark} />}
        </View>
        <AllocationProductStepper value={item.state} />
      </View>
    </Container>
  );
};

AllocationProductCard.propTypes = {
  item: PropTypes.shape({
    arrivalDate: PropTypes.string,
    chassisNumber: PropTypes.string,
    engineNumber: PropTypes.string,
    favoriteProduct: PropTypes.shape({
      favoriteModel: PropTypes.shape({
        model: PropTypes.shape({
          photo: PropTypes.shape({
            url: PropTypes.string,
          }),
        }),
      }),
      product: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    state: PropTypes.string,
  }),
  canSelect: PropTypes.bool,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
};

export default memo(AllocationProductCard);
