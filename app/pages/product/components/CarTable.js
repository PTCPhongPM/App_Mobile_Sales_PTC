import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

import { Col, Row, Grid } from "react-native-easy-grid";
import gStyles from "../../../configs/gStyles";

const CarTable = ({ productName, inventory, style }) => {
  const { total, totalI, totalB, totalC } = useMemo(() => {
    let totalI = 0;
    let totalB = 0;
    let totalC = 0;

    for (let i = 0; i < inventory.length; i++) {
      totalI += inventory[i].quantityI;
      totalB += inventory[i].quantityB;
      totalC += inventory[i].quantityC;
    }

    return {
      total: totalI + totalC,
      totalI,
      totalB,
      totalC,
    };
  }, [inventory]);

  return (
    <Grid style={StyleSheet.flatten([styles.p16, gStyles.borderT, style])}>
      <Row style={styles.h24}>
        <Col>
          <View centerV>
            <Text subtitle1>{productName}</Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text caption1 textBlackMedium>
              Kho đại lý
            </Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text caption1 textBlackMedium>
              Xe đang về
            </Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text caption1 textBlackMedium>
              Xe đã đặt
            </Text>
          </View>
        </Col>
      </Row>
      <Row style={styles.h24}>
        <Col>
          <View centerV>
            <Text headline>{total}</Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text headline>{totalI}</Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text headline>{totalC}</Text>
          </View>
        </Col>
        <Col>
          <View center flex>
            <Text headline>{totalB}</Text>
          </View>
        </Col>
      </Row>
      <View marginT-8 />
      {inventory.map((e) => (
        <Row key={e.eColor.code} style={[styles.h20, styles.my4]}>
          <Col>
            <View centerV row>
              <View
                marginR-8
                style={[gStyles.dot, { backgroundColor: e.eColor.hexCode }]}
              />
              <Text black>{e.eColor.name}</Text>
            </View>
          </Col>
          <Col>
            <View center>
              <Text textBlackMedium>{e.quantityI}</Text>
            </View>
          </Col>
          <Col>
            <View center>
              <Text textBlackMedium>{e.quantityC}</Text>
            </View>
          </Col>
          <Col>
            <View center>
              <Text textBlackMedium>{e.quantityB}</Text>
            </View>
          </Col>
        </Row>
      ))}
    </Grid>
  );
};

CarTable.defaultProps = { style: {} };

CarTable.propTypes = {
  productName: PropTypes.string,
  inventory: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default CarTable;

const styles = StyleSheet.create({
  h20: {
    height: 20,
  },
  h24: {
    height: 24,
  },
  my4: { marginVertical: 4 },
  p16: {
    padding: 16,
  },
});
