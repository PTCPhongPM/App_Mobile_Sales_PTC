import PropTypes from "prop-types";
import React, { memo } from "react";

import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

import NormalChip from "../Chip/NormalChip";

import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";
import { formatDate, getCustomerName } from "../../helper/utils";

const styles = StyleSheet.create({
  highlightText: {
    color: colors.textBlackHigh,
  },
});

const CustomerFromCompanyCard = ({ customer }) => (
  <View
    paddingH-16
    paddingV-10
    bg-surface
    style={[gStyles.borderB, gStyles.shadow]}
  >
    <View row spread flex centerV>
      <Text subtitle2>{getCustomerName(customer)}</Text>
      <View row>
        <Text caption1>{formatDate(customer.updatedAt)}</Text>
      </View>
    </View>

    <View row marginT-12 marginB-4>
      {[customer.paymentMethod, customer.source].map((tag, i) => (
        <NormalChip key={tag} marginH-2 marginL-4={i === 0} label={tag} />
      ))}
    </View>

    <View row spread marginT-4>
      <Text
        flex
        body2
        textBlackMedium
        highlightString="Xe quan tâm"
        highlightStyle={styles.highlightText}
      >
        Xe quan tâm: {customer.note}
      </Text>
    </View>
  </View>
);

CustomerFromCompanyCard.propTypes = {
  customer: PropTypes.object,
};

export default memo(CustomerFromCompanyCard);
