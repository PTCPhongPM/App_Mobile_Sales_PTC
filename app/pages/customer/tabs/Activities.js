import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import { useNavigation } from "@react-navigation/native";

import { RefreshControl, SectionList } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";

import CareCard from "../../../components/Card/CareCard";
import { checkSaleActive, groupByKey } from "../../../helper/utils";

import { useGetActivitiesQuery } from "../../../store/api/sale";
import { SaleActivities } from "../../../helper/constants";
import Fab from "../../../components/Button/Fab";

const Activities = ({ customer, isNotMe }) => {
  const navigation = useNavigation();
  const sale = customer.sales[0];

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetActivitiesQuery({ saleId: sale?.id }, { skip: !sale?.id });

  const list = groupByKey(
    data.map((e) => ({
      ...e,
      time: dayjs(e.date).format("MM/YYYY"),
    })),
    "time",
    "desc"
  );

  const handleCreateActivity = useCallback(
    () =>
      navigation.navigate("ActivityEditor", {
        customer,
      }),
    [customer, navigation]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  return (
    <View bg-background flex>
      <SectionList
        sections={list}
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
          <CareCard
            title={SaleActivities[item.activity]}
            content={item.content}
            result={item.result}
            time={dayjs(item.date).format("DD/MM")}
            note={item.note}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View paddingH-16 paddingT-16 bg-surface>
            <Text subtitle1 primary900>
              Tháng {title}
            </Text>
          </View>
        )}
      />
      {isSaleActive && !isNotMe && (
        <Fab onPress={handleCreateActivity} color={Colors.primary900} />
      )}
    </View>
  );
};

Activities.propTypes = {
  customer: PropTypes.shape({
    sales: PropTypes.any,
  }),
};

export default Activities;
