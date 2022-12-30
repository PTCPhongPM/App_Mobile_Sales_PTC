import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { FlatList, RefreshControl } from "react-native";
import { Button, Colors, Incubator } from "react-native-ui-lib";

import BasePage from "../../components/Base/BasePage";
import ContractCard from "../../components/Card/ContractCard";

import { Close } from "../../configs/assets";

import gStyles from "../../configs/gStyles";
import { getCustomerName, removeAccents } from "../../helper/utils";

import { useGetContractsQuery } from "../../store/api/contract";

const ContractSearching = ({ navigation }) => {
  const { data = [], isFetching, refetch } = useGetContractsQuery();
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

    return data.filter(
      (contract) =>
        removeAccents(getCustomerName(contract.request.holderInfo))
          .toLowerCase()
          .includes(_filter) || contract.code.toLowerCase().includes(_filter)
    );
  }, [data, filter]);

  const handleContractPressed = useCallback(
    (contract) => navigation.navigate("ContractDetails", { contract }),
    [navigation]
  );

  return (
    <BasePage hasScroll={false}>
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
          <ContractCard
            contract={item}
            customerShown
            onPress={() => handleContractPressed(item)}
          />
        )}
      />
    </BasePage>
  );
};

ContractSearching.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
};

export default ContractSearching;
