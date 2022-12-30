import PropTypes from "prop-types";
import React from "react";
import {
  Colors,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Checked, DefaultCar } from "../../configs/assets";

const CarCard = ({
  color,
  image,
  inside,
  model,
  type,
  canSelect,
  selected,
  onSelect,
  ...props
}) => {
  const Container = canSelect ? TouchableOpacity : View;

  return (
    <Container onPress={onSelect}>
      <View
        row
        padding-16
        centerV
        bg-surface
        bg-stateGreenLight={selected}
        {...props}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            width={80}
            height={"100%"}
            resizeMode="contain"
          />
        ) : (
          <DefaultCar width={80} height={46} />
        )}
        <View marginL-8 flex>
          <View row marginT-8>
            {model && (
              <Text flex numberOfLines={1} marginR-4>
                <Text subtitle2>Mẫu xe: </Text>
                <Text body2 textBlackMedium>
                  {model}
                </Text>
              </Text>
            )}
            {type && (
              <Text flex>
                <Text subtitle2>Loại xe: </Text>
                <Text body2 textBlackMedium>
                  {type}
                </Text>
              </Text>
            )}
          </View>

          <View row marginT-8>
            {color && (
              <Text flex numberOfLines={1} marginR-4>
                <Text subtitle2>Màu xe: </Text>
                <Text body2 textBlackMedium>
                  {color}
                </Text>
              </Text>
            )}
            {inside && (
              <Text flex>
                <Text subtitle2>Nội thất: </Text>
                <Text body2 textBlackMedium>
                  {inside}
                </Text>
              </Text>
            )}
          </View>
        </View>

        {canSelect && selected && <Checked fill={Colors.stateGreenDark} />}
      </View>
    </Container>
  );
};

CarCard.defaultProps = {
  canSelect: false,
  selected: false,
  onSelect: () => {},
};

CarCard.propTypes = {
  canSelect: PropTypes.bool,
  color: PropTypes.string,
  image: PropTypes.string,
  inside: PropTypes.string,
  model: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  type: PropTypes.string,
};

export default CarCard;
