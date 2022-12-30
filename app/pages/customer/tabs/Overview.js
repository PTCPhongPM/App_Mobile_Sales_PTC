import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView } from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";

import CareCard from "../../../components/Card/CareCard";
import ContractCard from "../../../components/Card/ContractCard";
import FavoriteModelCard from "../../../components/Card/FavoriteModelCard";
import RequestCard from "../../../components/Card/RequestCard";
import TaskCard from "../../../components/Card/TaskCard";
import ScoreCard from "../../../components/State/ScoreCard";

import gStyles from "../../../configs/gStyles";
import { SaleActivities } from "../../../helper/constants";
import { useGetStatsQuery } from "../../../store/api/sale";

import { Empty } from "../../../configs/assets";
import { checkSaleActive } from "../../../helper/utils";

const Overview = ({ customer, changeTab }) => {
  const navigation = useNavigation();
  const sale = customer?.sales[0];

  const { data, isFetching, refetch } = useGetStatsQuery(
    { id: sale?.id },
    { skip: !sale?.id }
  );

  const handleUpdatePressed = useCallback(
    (product) => navigation.navigate("ProcessUpdate", { customer, product }),
    [customer, navigation]
  );

  const toProductTab = useCallback(() => changeTab(2), [changeTab]);
  const toCustomerCareTab = useCallback(() => changeTab(3), [changeTab]);
  const toRequestTab = useCallback(() => changeTab(4), [changeTab]);
  const toContractTab = useCallback(() => changeTab(5), [changeTab]);

  const handleCreateFavoriteProduct = useCallback(
    () =>
      navigation.navigate("FavoriteProductEditor", {
        otherBrand: false,
        sale,
      }),
    [navigation, sale]
  );

  const handleCreateActivity = useCallback(
    () =>
      navigation.navigate("ActivityEditor", {
        customer,
      }),
    [customer, navigation]
  );

  const handleCreateTask = useCallback(
    () =>
      navigation.navigate("TaskEditor", {
        customer,
      }),
    [customer, navigation]
  );

  const isEmpty = useMemo(
    () =>
      !data?.stats?.favoriteProductCount &&
      !data?.stats?.activityCount &&
      !data?.stats?.taskCount,
    [
      data?.stats?.activityCount,
      data?.stats?.favoriteProductCount,
      data?.stats?.taskCount,
    ]
  );

  const toFavoriteProductDetails = useCallback(
    (favoriteProduct) =>
      navigation.navigate("FavoriteProductDetails", {
        product: favoriteProduct.products[0],
        customer,
      }),
    [customer, navigation]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  return (
    <ScrollView
      paddingV-8
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      }
    >
      <View padding-16 bg-surface style={[gStyles.borderV, gStyles.shadow]}>
        <Text subtitle1>Tổng quan</Text>
        <View row marginT-8>
          <ScoreCard
            title="Xe quan tâm"
            number={data?.stats?.favoriteProductCount}
            bg-stateBlueDefault
            marginR-16
          />
          <ScoreCard
            title="Xe đã mua"
            number={data?.stats?.boughtProductCount}
            bg-stateBlueDark
          />
        </View>
        <View row marginT-16>
          <ScoreCard
            title="Liên hệ"
            number={data?.stats?.activityCount}
            bg-stateGreenDark
            marginR-16
          />
          <ScoreCard
            title="Việc cần làm"
            number={data?.stats?.taskCount}
            bg-stateOrangeDark
          />
        </View>
      </View>

      {isEmpty ? (
        <View paddingV-16 center>
          <Empty />
          <Text textBlackMedium marginV-8>
            Không có hoạt động
          </Text>
          <View row>
            <Button
              link
              paddingH-4
              paddingV-6
              onPress={handleCreateFavoriteProduct}
            >
              <Text button primary900>
                + Xe quan tâm
              </Text>
            </Button>
            <Button link paddingH-4 paddingV-6 onPress={handleCreateActivity}>
              <Text button primary900>
                + Liên hệ
              </Text>
            </Button>
            <Button link paddingH-4 paddingV-6 onPress={handleCreateTask}>
              <Text button primary900>
                + Lịch làm việc
              </Text>
            </Button>
          </View>
        </View>
      ) : (
        <>
          <View marginT-8>
            <View flex row spread paddingH-16 paddingV-8 bg-primary50>
              <Text subtitle1>Xe quan tâm</Text>
              <Button link paddingH-8 onPress={toProductTab}>
                <Text caption1 stateBlueDefault>
                  Xem thêm
                </Text>
              </Button>
            </View>

            <View style={gStyles.shadow}>
              {data?.topModels?.map(
                (model) =>
                  Boolean(model.products.length) && (
                    <FavoriteModelCard
                      item={model}
                      key={model.id}
                      onUpdate={
                        isSaleActive
                          ? () => handleUpdatePressed(model)
                          : undefined
                      }
                      onPress={() => toFavoriteProductDetails(model)}
                    />
                  )
              )}
            </View>
          </View>

          <View marginT-8 style={[gStyles.borderV, gStyles.shadow]}>
            <View flex row spread paddingH-16 paddingV-8 bg-primary50>
              <Text subtitle1>Liên hệ</Text>
              <Button link paddingH-8 onPress={toCustomerCareTab}>
                <Text caption1 stateBlueDefault>
                  Xem thêm
                </Text>
              </Button>
            </View>

            <View bg-surface style={gStyles.borderT}>
              {data?.recentActivities.map((item) => (
                <CareCard
                  key={item.id}
                  title={SaleActivities[item.activity]}
                  result={item.result}
                  time={dayjs(item.date).format("DD/MM")}
                />
              ))}
            </View>
          </View>

          <View marginT-8 style={[gStyles.borderV, gStyles.shadow]}>
            <View flex row spread paddingH-16 paddingV-8 bg-primary50>
              <Text subtitle1>Lịch làm việc</Text>
              <Button link paddingH-8 onPress={toCustomerCareTab}>
                <Text caption1 stateBlueDefault>
                  Xem thêm
                </Text>
              </Button>
            </View>

            <View bg-surface style={gStyles.borderT}>
              {data?.incomingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  checked={task.isDone}
                  title={task.content}
                  time={dayjs(task.date).format("DD/MM")}
                  onPress={() => navigation.navigate("TaskDetails", { task })}
                />
              ))}
            </View>
          </View>

          <View marginT-8 style={[gStyles.borderV, gStyles.shadow]}>
            <View flex row spread paddingH-16 paddingV-8 bg-primary50>
              <Text subtitle1>Đề xuất bán hàng</Text>
              <Button link paddingH-8 onPress={toRequestTab}>
                <Text caption1 stateBlueDefault>
                  Xem thêm
                </Text>
              </Button>
            </View>
            <View bg-surface style={gStyles.borderT}>
              {data?.topRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onPress={() =>
                    navigation.navigate("RequestDetails", { request, customer })
                  }
                />
              ))}
            </View>
          </View>

          <View marginT-8 style={[gStyles.borderV, gStyles.shadow]}>
            <View flex row spread paddingH-16 paddingV-8 bg-primary50>
              <Text subtitle1>Hợp đồng</Text>
              <Button link paddingH-8 onPress={toContractTab}>
                <Text caption1 stateBlueDefault>
                  Xem thêm
                </Text>
              </Button>
            </View>
            <View bg-surface style={gStyles.borderT}>
              {data?.topContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  // onPress={() =>
                  //   navigation.navigate("ContractDetails", {
                  //     contract,
                  //     hasBottomActions: true,
                  //   })
                  // }
                />
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

Overview.propTypes = {
  customer: PropTypes.shape({
    code: PropTypes.string,
    sales: PropTypes.array,
  }),
  changeTab: PropTypes.func,
};

export default Overview;
