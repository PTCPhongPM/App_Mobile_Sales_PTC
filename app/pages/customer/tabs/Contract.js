import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { FlatList, RefreshControl } from "react-native";
import {
  ActionSheet,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import { Toast } from "react-native-ui-lib/src/incubator";
import BasePage from "../../../components/Base/BasePage";
import HorizontalButtonTab from "../../../components/Button/HorizontalButtonTab";
import ContractCard from "../../../components/Card/ContractCard";
import Headline from "../../../components/Header/Headline";
import SwipeWrapper from "../../../components/Swipe/SwipeWrapper";

import gStyles from "../../../configs/gStyles";

import { ContractStateObject } from "../../../helper/constants";

import { SolidDescription, SolidPDF } from "../../../configs/assets";
import { useNotification } from "../../../providers/NotificationProvider";
import {
  useDuplicateContractMutation,
  useGetContractsQuery,
  useGetContractTemplatesQuery,
} from "../../../store/api/contract";
import { selectQuery, setQuery } from "../../../store/slices/contract";
import { downloadPDF } from "../../../helper/file";

const Contract = ({ customer, changeTab, isNotMe }) => {
  const navigation = useNavigation();
  const notification = useNotification();

  const toRequestTab = useCallback(() => changeTab(5), [changeTab]);

  const dispatch = useDispatch();
  //const { state } = useSelector(selectQuery);
  const [state, setState] = useState('');

  const [actionSheetShown, setActionSheetShown] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selected, setSelected] = useState({});

  const {
    data = [],
    isFetching,
    refetch,
  } = useGetContractsQuery(
    { saleId: customer.sales?.[0]?.id },
    { skip: !customer.sales?.[0]?.id }
  );

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

  const count = useMemo(() => {
    const obj = {
      approved: 0,
      pending: 0,
      rejected: 0,
      draft: 0,
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
        id: "approved",
        label: "Đã duyệt",
        value: count["approved"],
      },
      {
        id: "pending",
        label: "Chờ duyệt",
        value: count["pending"],
      },
      {
        id: "rejected",
        label: "Từ chối",
        value: count["rejected"],
      },
      {
        id: "draft",
        label: "Bản nháp",
        value: count["draft"],
      },
    ],
    [count]
  );

  const list = useMemo(() => {
    if (!state) return data;

    if (state === ContractStateObject.approved) {
      return data.filter((e) =>
        [ContractStateObject.approved, ContractStateObject.completed].includes(
          e.state
        )
      );
    }

    return data.filter((item) => item.state === state);
  }, [data, state]);

  const handleActionSheetShow = useCallback(
    () => setActionSheetShown(true),
    []
  );

  const handleActionSheetDismiss = useCallback(
    () => setActionSheetShown(false),
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
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
            onPress={() =>
              navigation.navigate("ContractDetails", {
                contract: item,
                isNotMe:isNotMe,
                hasBottomActions: false,
              })
            }
          />
        </SwipeWrapper>
      );
    },
    [duplicateContract, handleActionSheetShow, navigation]
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

  if (data.length === 0) {
    return (
      <TouchableOpacity onPress={toRequestTab}>
        <Headline label="Hợp đồng" marginT-8 />
        <View
          paddingV-28
          paddingH-60
          center
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Text body2 textBlackMedium>
            Khách hàng chưa có hợp đồng
          </Text>

          <View row>
            <Text body2 textBlackMedium>
              Bạn vui lòng{" "}
            </Text>
            <Text primary900 button>
              Tạo đề xuất{" "}
            </Text>
            <Text body2 textBlackMedium>
              bán hàng trước
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <BasePage hasScroll={false} loading={loading}>
      <Headline label="Hợp đồng" marginT-8 />

      <HorizontalButtonTab
        buttons={buttons}
        selected={state}
        onPress={(id) => {
          setState(id);
          dispatch(setQuery({ state: id }));
          refetch();
        }}
      />

      <FlatList
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        data={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={isFetching}
          />
        }
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View flex center paddingV-16>
            <Text body2>Không có hợp đồng phù hợp</Text>
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

Contract.propTypes = {
  changeTab: PropTypes.func,
  customer: PropTypes.shape({
    sales: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
      })
    ),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default Contract;
