import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Button, Colors, Incubator, Text, View } from "react-native-ui-lib";
import { VictoryPie } from "victory-native";
import { Dimensions, FlatList } from "react-native";

import BasePage from "../../components/Base/BasePage";
import { Close, Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";
import { colors } from "../../configs/themes";
import InventoryItem from "../../components/Card/InventoryItem";
import { useGetAllQuery } from "../../store/api/inventory";
import { removeAccents } from "../../helper/utils";
import DaySelect from "./components/DaySelect";

const { TextField } = Incubator;

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

const Inventory = ({ navigation }) => {
  const [mode, setMode] = useState("view");
  const [filter, setFilter] = useState("");
  const [days, setDays] = useState(7);

  const [selectedPie, setSelectedPie] = useState(null);

  const { data = [], isFetching } = useGetAllQuery({
    days,
    groupByModel: true,
  });

  const list = useMemo(() => {
    if (!data) return [];

    const _filter = removeAccents(filter.toLowerCase());

    return data.filter((e) => {
      const search = removeAccents(
        `${e.model?.brand?.code} ${e.model?.code}`.toLowerCase()
      );

      return search.includes(_filter);
    });
  }, [data, filter]);

  const { total, chartData } = useMemo(() => {
    let totalI = 0;
    let totalB = 0;
    let totalC = 0;

    for (let i = 0; i < data.length; i++) {
      totalI += data[i].totalI;
      totalB += data[i].totalB;
      totalC += data[i].totalC;
    }

    return {
      total: totalI + totalC,
      chartData: [{ y: totalI }, { y: totalB }, { y: totalC }],
    };
  }, [data]);

  useEffect(() => {
    if (mode === "view") {
      navigation.setOptions({
        headerTitle: "Tồn kho",
        headerTitleAlign: "center",
        headerRight: () => (
          <Button link paddingH-16 onPress={() => setMode("search")}>
            <Search fill={Colors.white} />
          </Button>
        ),
      });
    } else if (mode === "search") {
      navigation.setOptions({
        headerTitleAlign: "left",
        headerTitle: () => (
          <TextField
            autoFocus
            placeholder="Tìm kiếm                                                                                                              "
            value={filter}
            onChangeText={setFilter}
            style={[gStyles.search, { color: Colors.surface }]}
            leadingAccessory={<Search fill={Colors.surface} />}
            placeholderTextColor={Colors.textWhiteMedium}
          />
        ),
        headerRight: () => (
          <Button
            link
            paddingH-16
            onPress={() => {
              setMode("view");
              setFilter("");
            }}
          >
            <Close fill={Colors.white} />
          </Button>
        ),
      });
    }
  }, [filter, mode, navigation]);

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

  const handleItemPress = useCallback(
    (item) => {
      navigation.navigate("ModelDetails", { model: item.model });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <InventoryItem
        key={item.id}
        onPress={() => handleItemPress(item)}
        item={item}
      />
    ),
    [handleItemPress]
  );

  return (
    <BasePage loading={isFetching}>
      <View flex bg-white>
        {mode === "view" ? (
          <View paddingH-16 style={gStyles.borderB}>
            <View paddingV-8>
              <Text headline>Tổng xe đại lý</Text>
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
                  Colors.stateBlueDark,
                  Colors.stateGreenDark,
                  Colors.stateOrangeDark,
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
                    <Text body2>{e.text}</Text>
                  </View>
                );
              })}
            </View>
            <DaySelect value={days} onSelect={handleDaysChanged} />
            <View paddingT-16 paddingB-12 row spread centerV>
              <Text headline>Danh sách tồn kho</Text>
            </View>
          </View>
        ) : null}

        <FlatList
          nestedScrollEnabled
          windowSize={13}
          removeClippedSubviews
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <View flex center paddingV-16>
              <Text body2>Không có sản phẩm</Text>
            </View>
          )}
        />
      </View>
    </BasePage>
  );
};

Inventory.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default Inventory;
