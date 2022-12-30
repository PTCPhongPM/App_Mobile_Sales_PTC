import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Dimensions } from "react-native";
import {
  Button,
  Colors,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";

import { VictoryPie } from "victory-native";

import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";

import BasePage from "../../components/Base/BasePage";
import { useGetModelQuery } from "../../store/api/inventory";
import CarTab from "./components/CarTab";
import CarTable from "./components/CarTable";
import DaySelect from "./components/DaySelect";

const chartTypes = [
  {
    text: "Kho đại lý",
    style: {
      ...gStyles.dot,
      backgroundColor: colors.stateBlueDark,
    },
  },
  {
    text: "Xe đã đặt",
    style: {
      ...gStyles.dot,
      backgroundColor: colors.stateGreenDark,
    },
  },
  {
    text: "Xe đang về",
    style: {
      ...gStyles.dot,
      backgroundColor: colors.stateOrangeDark,
    },
  },
];

const width = Dimensions.get("window").width;

const chartWidth = width * 0.53;
const radius = chartWidth / 2 - 5;
const innerRadius = chartWidth / 2 - 25;

const ModelDetails = ({ route: { params } }) => {
  const [days, setDays] = useState(7);

  const [selectedPie, setSelectedPie] = useState(null);
  const [carType, setCarType] = useState(null);

  const { data = {}, isFetching } = useGetModelQuery({
    days,
    modelId: params.model.id,
  });

  const { total, chartData, groupedData } = useMemo(() => {
    if (!data?.summary || !data?.inventory) {
      return {
        total: 0,
        chartData: [{ y: 0 }, { y: 0 }, { y: 0 }],
        groupedData: {},
      };
    }

    const groupedData = _.groupBy(data?.inventory, (e) => e?.product?.name);

    return {
      total: data.summary.totalI + data.summary.totalC,
      chartData: [
        { y: data.summary.totalI },
        { y: data.summary.totalB },
        { y: data.summary.totalC },
      ],
      groupedData,
    };
  }, [data]);

  const handlePiePress = useCallback((evt, other) => {
    const selected = other.slice.index;
    setSelectedPie((prev) => (prev === selected ? null : selected));

    return {
      target: "data",
      mutation: ({ radius: r }) => {
        return r === radius ? { radius: radius + 5 } : { radius };
      },
    };
  }, []);

  const handleDaysChanged = useCallback((value) => setDays(value), []);

  const renderInventory = useCallback(() => {
    if (_.isEmpty(groupedData)) return null;

    if (carType === "all") {
      return (
        <>
          {Object.entries(groupedData).map(([productName, iData]) => {
            return (
              <CarTable
                key={productName}
                productName={productName}
                inventory={iData}
              />
            );
          })}
        </>
      );
    }

    const tabs = Object.keys(groupedData).map((e) => ({ label: e }));
    if (tabs.length < 2) {
      tabs.push({ label: "" });
    }

    return (
      <TabController items={tabs} asCarousel>
        <TabController.TabBar />
        <TabController.PageCarousel>
          {Object.entries(groupedData).map(([productName, iData], i) => (
            <TabController.TabPage
              key={productName}
              index={i}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <CarTab inventory={iData} />
            </TabController.TabPage>
          ))}
        </TabController.PageCarousel>
      </TabController>
    );
  }, [carType, groupedData]);

  return (
    <BasePage loading={isFetching}>
      <View flex bg-white>
        <View paddingH-16 style={gStyles.borderB}>
          <View paddingV-8>
            <Text headline>
              Tổng xe đại lý: {params.model.brand.code} - {params.model.code}
            </Text>
            <Text largeTitle primary900>
              {total} xe
            </Text>
            <Text body2 textBlackMedium>
              Bao gồm xe trong kho đại lý và xe đang về
            </Text>
          </View>
          <View center paddingV-8>
            <View abs center>
              <Text largeTitle>
                {_.isNull(selectedPie) ? total : chartData[selectedPie].y}
              </Text>
              <Text body2 textBlackMedium>
                {_.isNull(selectedPie)
                  ? "Tổng xe"
                  : chartTypes[selectedPie].text}
              </Text>
            </View>
            <VictoryPie
              data={chartData}
              width={chartWidth}
              height={chartWidth}
              colorScale={[
                Colors.stateOrangeDark,
                Colors.stateGreenDark,
                Colors.stateBlueDark,
              ]}
              responsive={true}
              padAngle={2}
              innerRadius={innerRadius}
              radius={radius}
              labels={() => null}
              events={[
                {
                  target: "data",
                  eventHandlers: {
                    onPress: handlePiePress,
                  },
                },
              ]}
            />
          </View>
          <View row paddingV-16 paddingH-16>
            {chartTypes.map((e) => {
              return (
                <View flex row centerV key={e.text}>
                  <View marginR-4 style={e.style} />
                  <Text>{e.text}</Text>
                </View>
              );
            })}
          </View>
          <DaySelect value={days} onSelect={handleDaysChanged} />
          <View paddingT-16 paddingB-12 row spread centerV>
            <Text headline>Danh sách xe</Text>
            <View row bg-neutral100 padding-2 br30>
              <Button
                br30
                body2
                bg-transparent
                subtitle2={carType === "all"}
                bg-white={carType === "all"}
                label="Tất cả"
                onPress={() => setCarType("all")}
              />
              <Button
                br30
                body2
                bg-transparent
                subtitle2={carType !== "all"}
                bg-white={carType !== "all"}
                label="Theo dòng"
                onPress={() => setCarType("product")}
              />
            </View>
          </View>
        </View>
        {renderInventory()}
      </View>
    </BasePage>
  );
};

ModelDetails.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      model: PropTypes.object,
    }),
  }),
};

export default ModelDetails;
