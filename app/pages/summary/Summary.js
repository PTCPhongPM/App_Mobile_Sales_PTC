import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import { FlatList, RefreshControl } from "react-native";
import {
  Button,
  Colors,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";
import RankingCard from "../../components/Card/RankingCard";

import { Search } from "../../configs/assets";
import gStyles from "../../configs/gStyles";

import { useStatusBar } from "../../helper/hooks";

import {
  useGetMyRankQuery,
  useGetTopSellerQuery,
} from "../../store/api/summary";

const tabs = [
  { label: "Xe xuất", value: "deliveryRank" },
  { label: "Xe ký", value: "signingRank" },
];

const Summary = ({ navigation }) => {
  useStatusBar("light-content");

  const handleSearchPressed = useCallback(
    () =>
      navigation.navigate("SummarySearching", {
        orderBy: tabs[indexTabActive].value,
      }),
    [indexTabActive, navigation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button link paddingH-16 onPress={handleSearchPressed}>
          <Search fill={Colors.surface} />
        </Button>
      ),
    });
  }, [handleSearchPressed, navigation]);

  const [indexTabActive, setIndexTabActive] = useState(0);

  const { data, isFetching, refetch } = useGetTopSellerQuery({
    month: dayjs().month() + 1,
    year: dayjs().year(),
    top: 12,
    orderBy: tabs[indexTabActive].value,
  });

  const { data: myRank, isFetching: isFetching2 } = useGetMyRankQuery({
    month: dayjs().month() + 1,
    year: dayjs().year(),
  });

  const renderItem = useCallback(
    ({ item }) => (
      <RankingCard
        key={item.name}
        item={item}
        type={tabs[indexTabActive].value}
      />
    ),
    [indexTabActive]
  );

  return (
    <BasePage hasScroll={false} bg-surface>
      <TabController items={tabs} initialIndex={indexTabActive}>
        <View paddingH-16 paddingV-8>
          <View row bg-neutral100 br30 spread padding-2 style={gStyles.border}>
            {tabs.map((btn, index) => {
              const isActive = index === indexTabActive;

              return (
                <Button
                  key={btn.label}
                  bg-transparent
                  br30
                  flex
                  paddingH-0
                  bg-white={isActive}
                  style={isActive && gStyles.shadow}
                  onPress={() => setIndexTabActive(index)}
                >
                  <Text body2 subtitle2={isActive} primary900={isActive}>
                    {btn.label}
                  </Text>
                </Button>
              );
            })}
          </View>
        </View>

        <View row spread centerV paddingH-16 paddingV-8>
          <Text headline>Xếp hạng</Text>
          <Text caption1 stateBlueDefault>
            Tháng này
          </Text>
        </View>

        <View flex style={gStyles.borderV}>
          {tabs.map((element, index) => (
            <TabController.TabPage
              key={element.label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                  <RefreshControl
                    colors={[Colors.primary900]}
                    tintColor={Colors.primary900}
                    onRefresh={refetch}
                    refreshing={isFetching || isFetching2}
                  />
                }
              />
            </TabController.TabPage>
          ))}
        </View>

        {myRank && (
          <RankingCard
            item={myRank}
            highlightBg
            type={tabs[indexTabActive].value}
          />
        )}
      </TabController>
    </BasePage>
  );
};

Summary.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default Summary;
