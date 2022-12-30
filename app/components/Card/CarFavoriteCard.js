import PropTypes from "prop-types";
import React from "react";
import {
  Colors,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Checked, DefaultCar, SolidCheckedCircle } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

const CarFavoriteCard = ({
  brand,
  image,
  model,
  type,
  canSelect,
  selected,
  onSelect,
}) => {
  const Container = canSelect ? TouchableOpacity : View;

  return (
    <Container
      row
      paddingH-16
      paddingV-16
      centerV
      style={gStyles.borderB}
      bg-primary50={selected}
      onPress={onSelect}
    >
      {image ? (
        <Image source={{ uri: image }} width={80} height={"100%"} />
      ) : (
        <DefaultCar width={80} height={40} />
      )}
      <View marginL-8 flex>
        <View row marginT-8>
          {brand && (
            <Text flex>
              <Text subtitle2>Hãng: </Text>
              <Text body2 textBlackMedium>
                {brand}
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
          {model && (
            <Text flex>
              <Text subtitle2>MTO: </Text>
              <Text body2 textBlackMedium>
                {model}
              </Text>
            </Text>
          )}
        </View>
      </View>

      {canSelect && selected && <Checked fill={Colors.primary900} />}
      {canSelect && !selected && <SolidCheckedCircle fill={Colors.black} />}
    </Container>
  );
};

CarFavoriteCard.defaultProps = {
  canSelect: false,
  selected: false,
  onSelect: () => {},
};

CarFavoriteCard.propTypes = {
  brand: PropTypes.string,
  canSelect: PropTypes.bool,
  image: PropTypes.string,
  model: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  type: PropTypes.string,
};

export default CarFavoriteCard;
