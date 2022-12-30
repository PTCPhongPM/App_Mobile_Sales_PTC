import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { RefreshControl, SectionList } from "react-native";
import { ActionSheet, Button, Colors, Text, View } from "react-native-ui-lib";

import { Toast } from "react-native-ui-lib/src/incubator";
import { useStatusBar } from "../../helper/hooks";

import BasePage from "../../components/Base/BasePage";
import ContractCard from "../../components/Card/ContractCard";
import Headline from "../../components/Header/Headline";
import SwipeWrapper from "../../components/Swipe/SwipeWrapper";

import { Search, SolidDescription, SolidPDF, Tune } from "../../configs/assets";

import {
  useDuplicateContractMutation,
  useGetContractsLeadQuery,
  useGetContractTemplatesQuery,
} from "../../store/api/contract";

import HorizontalButtonTab from "../../components/Button/HorizontalButtonTab";
import { ContractStateObject } from "../../helper/constants";
import { downloadPDF } from "../../helper/file";
import { groupContracts } from "../../helper/utils";
import { useNotification } from "../../providers/NotificationProvider";
import { selectQuery, setQuery } from "../../store/slices/contract";

const Contracts = ({route}) => {
  useStatusBar("light-content");
  const navigation = useNavigation();
  const notification = useNotification();

  const dispatch = useDispatch();
  const { sortby, orderby, ...otherQuery } = useSelector(selectQuery);

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selected, setSelected] = useState({});

  const { data = [], isFetching, refetch } = useGetContractsLeadQuery({accountId:route?.params?.account?.id});
  const [duplicateContract, { isLoading, isSuccess }] =
    useDuplicateContractMutation();

  const { data: templates = [] } = useGetContractTemplatesQuery();

  const loading = isFetching || isLoading || isExporting;

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Nhân bản thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleFilterPressed = useCallback(
    () => navigation.navigate("ContractFilterSettings"),
    [navigation]
  );

  const handleSearchPressed = useCallback(
    () => navigation.navigate("ContractSearching"),
    [navigation]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleFilterPressed}>
          <Tune fill={Colors.surface} />
        </Button>
      ),
      headerRight: () => (
        <Button link paddingH-16 onPress={handleSearchPressed}>
          <Search fill={Colors.surface} />
        </Button>
      ),
    });
  }, [handleFilterPressed, navigation, handleSearchPressed]);

  const count = useMemo(() => {
    const obj = {
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
      cancelled: 0,
    };
    data.forEach((e) => {
      if (
        [ContractStateObject.approved, ContractStateObject.completed].includes(
          e.state
        )
      ) {
        obj["approved"]++;
      } else {
        obj[e.state]++;
      }
    });

    return obj;
  }, [data]);

  const buttons = useMemo(
    () => [
      {
        id: "",
        label: "Tất cả",
      },
      {
        id: ContractStateObject.approved,
        label: "Đã duyệt",
        value: count[ContractStateObject.approved],
      },
      {
        id: ContractStateObject.pending,
        label: "Chờ duyệt",
        value: count[ContractStateObject.pending],
      },
      {
        id: ContractStateObject.rejected,
        label: "Từ chối",
        value: count[ContractStateObject.rejected],
      },
      {
        id: ContractStateObject.cancelled,
        label: "Đã hủy",
        value: count[ContractStateObject.cancelled],
      },
      {
        id: ContractStateObject.draft,
        label: "Bản nháp",
        value: count[ContractStateObject.draft],
      },
    ],
    [count]
  );

  const list = useMemo(
    () => groupContracts(data, sortby, orderby, otherQuery),
    [data, orderby, otherQuery, sortby]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const rightActions = [];
      if (
        [ContractStateObject.approved, ContractStateObject.done].includes(
          item.state
        )
      ) {
        rightActions.push({
          text: "Xuất PDF",
          color: Colors.stateBlueDefault,
          icon: <SolidPDF fill={Colors.surface} />,
          onPress: () => {
            setSelected(item);
            handleActionSheetShow();
          },
        });
      }

      return (
        <View marginT-5={Boolean(index)}>
          <SwipeWrapper
            leftActions={[
              {
                text: "Duplicate",
                color: Colors.stateOrangeDefault,
                icon: <SolidDescription fill={Colors.surface} />,
                onPress: () =>
                  duplicateContract({
                    id: item.id,
                  }),
              },
            ]}
            rightActions={rightActions}
          >
            <ContractCard
              contract={item}
              customerShown
              onPress={() =>
                navigation.navigate("ContractDetails", {
                  contract: item,
                  hasBottomActions: true,
                })
              }
            />
          </SwipeWrapper>
        </View>
      );
    },
    [duplicateContract, handleActionSheetShow, navigation]
  );

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const actionSheetOptions = useMemo(() => {
    const arr = templates.map((template) => ({
      label: template.name,
      onPress: async () => {
        setIsExporting(true);
        await downloadPDF("/contract/pdf", "contract", {
          id: selected.id,
          template: template.code,
        });
        setIsExporting(false);
      },
    }));

    arr.push({ label: "Trở lại" });

    return arr;
  }, [selected.id, templates]);

  return (
    <BasePage hasScroll={false} loading={loading}>
      <HorizontalButtonTab
        buttons={buttons}
        selected={otherQuery.state}
        onPress={(id) => {
          dispatch(setQuery({ state: id }));
          refetch();
        }}
      />
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
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <View paddingT-12 bg-background>
            <Headline label={title} marginT-0 />
          </View>
        )}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có hợp đồng</Text>
          </View>
        )}
      />
      <ActionSheet
        useNativeIOS
        useSafeArea
        cancelButtonIndex={actionSheetOptions.length}
        title="Chọn mẫu hợp đồng trước khi tạo PDF"
        visible={actionSheetShown}
        options={actionSheetOptions}
        onDismiss={handleActionSheetDismiss}
      />
    </BasePage>
  );
};

export default Contracts;
