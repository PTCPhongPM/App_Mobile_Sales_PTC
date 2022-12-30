import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator } from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";
import RankingCard from "../../components/Card/RankingCard";

import gStyles from "../../configs/gStyles";
import { Close } from "../../configs/assets";
import { removeAccents } from "../../helper/utils";

import { useGetTopSellerQuery } from "../../store/api/summary";

const SummarySearching = ({ navigation, route }) => {
  const {
    data = [],
    isFetching,
    refetch,
  } = useGetTopSellerQuery({
    month: dayjs().month() + 1,
    year: dayjs().year(),
    top: 12,
    orderBy: route.params.orderBy,
  });

  const [filter, setFilter] = useState("");

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "left",
      headerTitle: () => (
        <Incubator.TextField
          autoFocus
          placeholder="Tìm kiếm"
          selectionColor={Colors.surface}
          style={[gStyles.search, { color: Colors.surface }]}
          placeholderTextColor={Colors.textWhiteMedium}
          value={filter}
          onChangeText={setFilter}
        />
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          disabled={!filter}
          onPress={() => setFilter("")}
        >
          <Close fill={filter ? Colors.surface : Colors.textWhiteMedium} />
        </Button>
      ),
    });
  }, [filter, navigation]);

  const list = useMemo(() => {
    const _filter = removeAccents(filter.toLowerCase());

    return data.filter((item) =>
      removeAccents(item.account.name).toLowerCase().includes(_filter)
    );
  }, [data, filter]);

  return (
    <BasePage hasScroll={false} bg-surface>
      <FlatList
        data={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={isFetching}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RankingCard item={item} type={route.params.orderBy} />
        )}
      />
    </BasePage>
  );
};

SummarySearching.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      orderBy: PropTypes.string,
    }),
  }),
};

export default SummarySearching;
