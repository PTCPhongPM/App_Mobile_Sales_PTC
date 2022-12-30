import React, { useMemo } from "react";

import { ScrollView } from "react-native";
import { LoaderScreen, TabController, View } from "react-native-ui-lib";

import gStyles from "../../configs/gStyles";

import BasePage from "../../components/Base/BasePage";

import { useGetContractListPendingQuery } from "../../store/api/contract";
import { useGetDeliveryListPendingQuery } from "../../store/api/delivery";
import { useGetRequestListPendingQuery } from "../../store/api/request";
import { useGetTestDriveListPendingQuery } from "../../store/api/testDrive";

import { useDirectorRole, useStatusBar } from "../../helper/hooks";
import { useGetApprovalStatsQuery } from "../../store/api/approval";

import ApprovalTab from "./tabs/ApprovalTab";

const tabs = [
  { id: "request", func: useGetRequestListPendingQuery },
  { id: "contract", func: useGetContractListPendingQuery },
  { id: "testdrive", func: useGetTestDriveListPendingQuery },
  { id: "delivery", func: useGetDeliveryListPendingQuery },
];

const Approval = () => {
  useStatusBar("light-content");
  const isDirector = useDirectorRole();

  const {
    data: stats = {
      request: 0,
      contract: 0,
      testdrive: 0,
      delivery: 0,
    },
  } = useGetApprovalStatsQuery(
    {},
    {
      pollingInterval: 10000,
      skip: !isDirector,
    }
  );

  const labels = useMemo(
    () => [
      { label: `Đề xuất (${stats.request})` },
      { label: `Hợp đồng (${stats.contract})` },
      { label: `Lái thử (${stats.testdrive})` },
      { label: `Giao xe (${stats.delivery})` },
    ],
    [stats.contract, stats.delivery, stats.request, stats.testdrive]
  );

  return (
    <BasePage hasScroll={false}>
      <TabController items={labels}>
        <ScrollView scrollEnabled={false} style={gStyles.tabBarScroll}>
          <TabController.TabBar faderProps={{ size: 0 }} />
        </ScrollView>
        <View flex>
          {tabs.map((tab, index) => (
            <TabController.TabPage
              key={tab.id}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <ApprovalTab queryFunc={tab.func} category={tab.id} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </BasePage>
  );
};

export default Approval;
