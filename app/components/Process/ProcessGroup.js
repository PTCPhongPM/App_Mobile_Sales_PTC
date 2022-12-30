import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { View } from "react-native-ui-lib";
import {
  Search,
  DirectionsCar,
  Transportation,
  Dealing,
  Description,
  CreditScore,
  Payments,
  DeliveryComplete,
} from "../../configs/assets";

import { SaleProcesses, SaleProcessIndexes } from "../../helper/constants";
import ProcessItem from "./ProcessItem";

const icons = [Search, DirectionsCar, Transportation, Dealing];
const icons2 = [Description, CreditScore, Payments, DeliveryComplete];

const ProcessGroup = ({ process, onChange }) => {
  const indexOfSelected = Object.keys(SaleProcesses).indexOf(process);

  const [disabledPivot, setDisabledPivot] = useState();

  useEffect(
    () => setDisabledPivot(indexOfSelected - 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (disabledPivot === undefined) return null;

  return (
    <View>
      <View flex row>
        {icons.map((icon, index) => (
          <ProcessItem
            icon={icon}
            disabled={index <= disabledPivot}
            isActive={index === indexOfSelected}
            key={SaleProcessIndexes[index]}
            label={SaleProcesses[SaleProcessIndexes[index]]}
            value={SaleProcessIndexes[index]}
            onPress={onChange}
          />
        ))}
      </View>
      <View flex row marginT-16>
        {icons2.map((icon, index) => {
          const _index = index + 4;

          return (
            <ProcessItem
              key={SaleProcessIndexes[_index]}
              disabled={_index <= disabledPivot}
              icon={icon}
              isActive={_index === indexOfSelected}
              label={SaleProcesses[SaleProcessIndexes[_index]]}
              value={SaleProcessIndexes[_index]}
              onPress={onChange}
            />
          );
        })}
      </View>
    </View>
  );
};

ProcessGroup.propTypes = {
  onChange: PropTypes.func,
  process: PropTypes.string.isRequired,
};

export default ProcessGroup;
