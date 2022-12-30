import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { Pressable, StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import NormalChip from "../Chip/NormalChip";

import gStyles from "../../configs/gStyles";

import { BoughtCar, PriorityHigh16 } from "../../configs/assets";

import { colors } from "../../configs/themes";
import { formatDate, getCustomerName } from "../../helper/utils";

const styles = StyleSheet.create({
  highlightText: {
    color: colors.textBlackHigh,
  },
});

const CustomerFrozenLostCard = ({ customer, onPress }) => {
  const sale = customer.sales?.[0];

  const favoriteModels = useMemo(() => {
    if (!sale?.favoriteModels || !sale.favoriteModels.length) return null;

    let favorites = sale.favoriteModels
      .slice(0, 2)
      .map((e) => e.model.description)
      .join(", ");

    if (sale.favoriteModels.length > 2) {
      favorites = favorites + ` + ${sale.favoriteModels.length - 2}`;
    }

    return favorites;
  }, [sale?.favoriteModels]);

  return (
    <Pressable onPress={onPress} style={[gStyles.borderB, gStyles.shadow]}>
      <View paddingH-16 paddingV-10 bg-surface>
        <View row spread flex centerV>
          <Text subtitle2 style={gStyles.capitalize}>
            {getCustomerName(customer)}
          </Text>
          <View row>
            <Text caption1>{formatDate(customer.updatedAt)}</Text>
            {customer.warning && (
              <View marginL-2>
                <PriorityHigh16 fill={Colors.stateOrangeDefault} />
              </View>
            )}
          </View>
        </View>

        <View row marginT-12 marginB-4>
          {customer.hasBought && <BoughtCar width={24} height={24} />}

          {[customer.paymentMethod, customer.source].map((tag) => (
            <NormalChip
              key={tag}
              marginR-4
              marginL-4={customer.hasBought}
              label={tag}
            />
          ))}
        </View>

        {sale.isLost && (
          <View row spread marginT-4>
            <Text
              flex
              body2
              textBlackMedium
              highlightString="Loại lý do"
              highlightStyle={styles.highlightText}
            >
              Loại lý do: {sale.reasonType}
            </Text>
          </View>
        )}

        {sale.isFrozen && (
          <View row spread marginT-4>
            <Text
              flex
              body2
              textBlackMedium
              highlightString="Xe quan tâm"
              highlightStyle={styles.highlightText}
            >
              Xe quan tâm: {favoriteModels}
            </Text>
          </View>
        )}

        <View row spread marginT-4>
          <Text
            flex
            body2
            textBlackMedium
            highlightString="Lý do"
            highlightStyle={styles.highlightText}
          >
            Lý do: {sale.reason}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

CustomerFrozenLostCard.defaultProps = {
  isLostCustomer: false,
};

CustomerFrozenLostCard.propTypes = {
  customer: PropTypes.object,
  isLostCustomer: PropTypes.bool,
  onPress: PropTypes.func,
  state: PropTypes.string,
};
export default CustomerFrozenLostCard;
