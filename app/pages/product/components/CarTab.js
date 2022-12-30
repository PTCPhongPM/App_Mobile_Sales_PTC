import PropTypes from "prop-types";
import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

import { Col, Row, Grid } from "react-native-easy-grid";
import gStyles from "../../../configs/gStyles";
import { CarColor } from "../../../configs/assets";

const CarTab = ({ inventory, style }) => {
  return (
    <Grid style={StyleSheet.flatten([style])}>
      {inventory.map((e) => (
        <Row key={e.eColor.code} style={[styles.row, gStyles.borderB]}>
          <Col size={2}>
            <View row>
              <CarColor fill={e.eColor.hexCode} />
              <View flex center>
                <Text subtile2>{e.eColor.name}</Text>
                <Text headline>{e.quantityI + e.quantityC}</Text>
              </View>
            </View>
          </Col>
          <Col>
            <View center flex>
              <Text caption1 textBlackMedium>
                Kho đại lý
              </Text>
              <Text headline>{e.quantityI}</Text>
            </View>
          </Col>
          <Col>
            <View center flex>
              <Text caption1 textBlackMedium>
                Xe đang về
              </Text>
              <Text headline>{e.quantityC}</Text>
            </View>
          </Col>
          <Col>
            <View center flex>
              <Text caption1 textBlackMedium>
                Xe đã đặt
              </Text>
              <Text headline>{e.quantityB}</Text>
            </View>
          </Col>
        </Row>
      ))}
    </Grid>
  );
};

CarTab.defaultProps = {
  style: {},
};

CarTab.propTypes = {
  inventory: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CarTab;

const styles = StyleSheet.create({
  row: {
    height: 80,
    paddingRight: 24,
  },
});
