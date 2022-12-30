import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";
import { formatDate, getCustomerName } from "../../helper/utils";

const styles = StyleSheet.create({
  highlightText: {
    color: colors.textBlackHigh,
  },
});

const CustomerBoughtCard = ({ customer, onPress }) => {
  const sale = customer.sales?.[0];

  const boughtProducts = useMemo(() => {
    const result = [];
    customer.sales.forEach((sale) => {
      sale.favoriteModels.forEach(({ model }) => {
        result.push(model.description);
      });
    });

    return result.join(", ");
  }, [customer.sales]);

  return (
    <Pressable onPress={onPress} style={[gStyles.borderB, gStyles.shadow]}>
      <View paddingH-16 paddingV-10 bg-surface>
        <View row spread flex centerV>
          <Text subtitle2 style={gStyles.capitalize}>
            {getCustomerName(customer)}
          </Text>
          <View row>
            <Text caption1>{formatDate(sale?.updatedAt)}</Text>
          </View>
        </View>

        <View row spread marginT-4>
          <Text
            flex
            body2
            textBlackMedium
            highlightString="Xe đã mua"
            highlightStyle={styles.highlightText}
          >
            Xe đã mua: {boughtProducts}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

CustomerBoughtCard.propTypes = {
  customer: PropTypes.object,
  onPress: PropTypes.func,
};
export default CustomerBoughtCard;
