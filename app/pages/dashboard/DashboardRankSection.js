import React, { memo, useCallback, useState } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";

import dayjs from "dayjs";
import {
  Button,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";

import { StyleSheet } from "react-native";
import RankingCard from "../../components/Card/RankingCard";

import gStyles from "../../configs/gStyles";

import { RankObject } from "../../helper/constants";
import { useGetTopSellerQuery } from "../../store/api/summary";

const styles = StyleSheet.create({
  h300: {
    height: 300,
  },
});

const tabs = [
  { label: "Xe xuất", value: "deliveryRank" },
  { label: "Xe ký", value: "signingRank" },
];

const DashboardRankSection = ({ myRank }) => {
  const navigation = useNavigation();
  const handleThisMonthPress = useCallback(
    () => navigation.navigate("Summary"),
    [navigation]
  );

  const [indexTabActive, setIndexTabActive] = useState(0);

  const { data: rank = [] } = useGetTopSellerQuery({
    month: dayjs().month() + 1,
    year: dayjs().year(),
    top: 12,
    orderBy: tabs[indexTabActive].value,
  });

  const renderRank = useCallback(
    (item) => (
      <RankingCard
        key={item.id}
        item={item}
        highlightIndex={5}
        highlightBg={item.account.id === myRank?.account?.id}
        type={tabs[indexTabActive].value}
      />
    ),
    [indexTabActive, myRank?.account?.id]
  );

  return (
    <>
      <TabController items={tabs} initialIndex={indexTabActive}>
        <View row spread centerV paddingH-16 paddingT-16 paddingV-12>
          <Text subtitle1>Top 5 của tháng này</Text>
          <Button link onPress={handleThisMonthPress}>
            <Text caption1 stateBlueDefault>
              Xem thêm
            </Text>
          </Button>
        </View>

        <View
          bg-neutral100
          br30
          marginH-16
          padding-2
          row
          spread
          style={gStyles.border}
        >
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

        <View flex style={[gStyles.borderV, rank.length && styles.h300]}>
          {tabs.map((element, index) => (
            <TabController.TabPage
              key={element.label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              {rank.map(renderRank)}
            </TabController.TabPage>
          ))}
        </View>
      </TabController>

      {myRank && myRank[RankObject[tabs[indexTabActive].value].rank] > 5 && (
        <RankingCard
          item={myRank}
          highlightBg
          type={tabs[indexTabActive].value}
        />
      )}
    </>
  );
};

DashboardRankSection.propTypes = {
  myRank: PropTypes.shape({
    account: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
};

export default memo(DashboardRankSection);
