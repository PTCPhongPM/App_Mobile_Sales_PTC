import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

import { useNavigation } from "@react-navigation/native";

import { FlatList, RefreshControl } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";

import RequestCard from "../../../components/Card/RequestCard";
import TestDriveCard from "../../../components/Card/TestDriveCard";
import ContractCard from "../../../components/Card/ContractCard";
import DeliveryCard from "../../../components/Card/DeliveryCard";

const ApprovalTab = ({ queryFunc, category }) => {
  const navigation = useNavigation();
  const { data = [], isFetching, refetch } = queryFunc();

  const handleTestDrivePressed = useCallback(
    (testDrive) =>
      navigation.navigate("TestDriveDetails", {
        testDrive,
      }),
    [navigation]
  );

  const handleRequestsPressed = useCallback(
    (request) =>
      navigation.navigate("RequestDetails", {
        request,
      }),
    [navigation]
  );

  const handleContractPressed = useCallback(
    (contract) =>
      navigation.navigate("ContractDetails", {
        contract,
      }),
    [navigation]
  );

  const handleDeliveryPressed = useCallback(
    (deliverySchedule) =>
      navigation.navigate("DeliveryScheduleDetails", {
        deliverySchedule,
        canRedirect: true,
      }),
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }) => {
      switch (category) {
        case "request":
          return (
            <RequestCard
              request={item}
              showSale
              onPress={() => handleRequestsPressed(item)}
            />
          );
        case "contract":
          return (
            <ContractCard
              contract={item}
              customerShown
              onPress={() => handleContractPressed(item)}
            />
          );
        case "testdrive":
          return (
            <TestDriveCard
              testDrive={item}
              isGeneralMode
              onPress={() => handleTestDrivePressed(item)}
            />
          );
        case "delivery":
          return (
            <DeliveryCard
              schedule={item}
              onPress={() => handleDeliveryPressed(item)}
            />
          );
        default:
          return null;
      }
    },
    [
      category,
      handleContractPressed,
      handleDeliveryPressed,
      handleRequestsPressed,
      handleTestDrivePressed,
    ]
  );

  return (
    <FlatList
      data={data}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      }
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={() => (
        <View flex center paddingV-16>
          <Text body2>Không có phê duyệt</Text>
        </View>
      )}
    />
  );
};

ApprovalTab.propTypes = {
  category: PropTypes.string,
  queryFunc: PropTypes.func,
};

export default memo(ApprovalTab);
