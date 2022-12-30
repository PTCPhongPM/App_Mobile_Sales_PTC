import React, { memo } from "react";

import { Colors, Text, View } from "react-native-ui-lib";

import {
  DashboardCar,
  DashboardContract,
  DashboardLead,
  DashboardTask,
} from "../../configs/assets";

import ScoreCard from "../../components/State/ScoreCard";

import { useGetCurrentStatsQuery } from "../../store/api/stats";

const DashboardStatsSection = () => {
  const { data } = useGetCurrentStatsQuery();

  return (
    <View paddingV-8 paddingH-16>
      <View row spread centerV>
        <Text subtitle1>Tổng quan</Text>
        <Text caption1 stateBlueDefault>
          Tháng này
        </Text>
      </View>

      <View row marginT-8>
        <ScoreCard
          title="Xe xuất"
          number={data?.saleSummary?.delivered}
          bg-stateBlueDefault
          marginR-16
          icon={<DashboardCar fill={Colors.textWhiteHigh} />}
        />
        <ScoreCard
          title="Xe ký"
          number={data?.saleSummary?.signed}
          bg-stateBlueDark
          icon={<DashboardContract fill={Colors.textWhiteHigh} />}
        />
      </View>

      <View row marginT-16>
        <ScoreCard
          title="KH tiềm năng"
          number={data?.customers}
          bg-stateGreenDark
          marginR-16
          icon={<DashboardLead fill={Colors.textWhiteHigh} />}
        />
        <ScoreCard
          title="Lịch làm việc"
          number={data?.tasks}
          bg-stateOrangeDark
          icon={<DashboardTask fill={Colors.textWhiteHigh} />}
        />
      </View>
    </View>
  );
};

export default memo(DashboardStatsSection);
