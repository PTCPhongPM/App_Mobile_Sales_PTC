import PropTypes from "prop-types";
import React, { memo, useMemo } from "react";

import { Pressable, StyleSheet } from "react-native";

import { Colors, Text, View } from "react-native-ui-lib";
import CustomerStateChip from "../Chip/CustomerStateChip";
import NormalChip from "../Chip/NormalChip";

import { BoughtCar, PriorityHigh16 } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";
import { SaleProcesses } from "../../helper/constants";
import { formatDate, getCustomerName } from "../../helper/utils";

const styles = StyleSheet.create({
  highlightText: {
    color: colors.textBlackHigh,
  },
});

const CustomerCard = ({ customer, onPress }) => {
  const sale = customer.sales?.[0];

  const process = useMemo(() => {
    if (!sale?.favoriteModels || !sale.favoriteModels.length) return null;

    return SaleProcesses[sale.favoriteModels[0].process];
  }, [sale?.favoriteModels]);

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

  const result = useMemo(() => {
    if (!sale || !sale?.activities || !sale.activities.length) return null;

    return sale.activities[0].result;
  }, [sale]);

  return (
    <Pressable onPress={onPress} style={[gStyles.borderV, gStyles.shadow]}>
      <View paddingH-16 paddingV-10 bg-surface>
        <View row spread flex centerV>
          <Text subtitle2 style={gStyles.capitalize}>
            {getCustomerName(customer)}
          </Text>
          <View row>
            <Text caption1>{formatDate(sale?.updatedAt)}</Text>

            {customer.warning && (
              <View marginL-2>
                <PriorityHigh16 fill={Colors.stateOrangeDefault} />
              </View>
            )}
          </View>
        </View>

        <View row marginT-12 marginB-4>
          {customer.hasBought && <BoughtCar width={24} height={24} />}
          <CustomerStateChip
            marginR-4
            marginL-4={customer.hasBought}
            state={customer.state}
          />

          {[customer.paymentMethod, customer.source].map((tag) => (
            <NormalChip marginH-4 key={tag} label={tag} />
          ))}
        </View>
        <View row spread marginT-4>
          <Text
            flex
            body2
            textBlackMedium
            highlightString="Quy trình"
            highlightStyle={styles.highlightText}
          >
            Quy trình: {process}
          </Text>
          <Text
            flex
            body2
            textBlackMedium
            highlightString="Kết quả"
            highlightStyle={styles.highlightText}
          >
            Kết quả: {result}
          </Text>
        </View>
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
      </View>
    </Pressable>
  );
};

CustomerCard.propTypes = {
  customer: PropTypes.object,
  onPress: PropTypes.func,
};
export default memo(CustomerCard);
