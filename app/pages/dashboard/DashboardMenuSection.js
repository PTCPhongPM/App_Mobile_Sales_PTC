import React, { memo, useCallback, useLayoutEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  Colors,
  ExpandableSection,
  SortableGridList,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import {
  Checked,
  ExpandLess,
  ExpandMore,
  SolidAddCircle,
  SolidDoNotDisturbOn,
  SolidInfo,
  Tune2,
} from "../../configs/assets";

import {
  addApprove,
  getDashboardArrays,
  removeApprove,
  setActiveArr,
  setExpansionArr,
  transportItem,
} from "../../store/slices/dashboard";

import gStyles from "../../configs/gStyles";
import { DashboardMenuIcons } from "../../helper/constants";
import { useDirectorRole } from "../../helper/hooks";

const DashboardMenuSection = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { activeArr, expansionArr } = useSelector(getDashboardArrays);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const toggleExpand = useCallback(() => setIsExpanded((prev) => !prev), []);
  const toggleEditMode = useCallback(() => setIsEditMode((prev) => !prev), []);

  const isDirector = useDirectorRole();

  useLayoutEffect(() => {
    if (isDirector) {
      dispatch(addApprove());
    } else {
      dispatch(removeApprove());
    }
  }, [dispatch, isDirector]);

  const renderItem = useCallback(
    (item, index, type) => {
      const Icon = DashboardMenuIcons[item.id];

      return (
        <TouchableOpacity
          key={item.id}
          flex
          center
          onPress={() => {
            if (isEditMode) {
              dispatch(
                transportItem({
                  from: type === "active" ? "activeArr" : "expansionArr",
                  index,
                  to: type === "active" ? "expansionArr" : "activeArr",
                })
              );
            } else {
              const arr = item.id.split("/");

              if (arr.length === 1) {
                navigation.navigate(item.id, {});
              } else {
                navigation.navigate(arr[0], {
                  screen: arr[1],
                  initial: false,
                });
              }
            }
          }}
        >
          {isEditMode && type === "active" && (
            <View absR absT>
              <SolidDoNotDisturbOn
                fill={Colors.textBlackLow}
                width={16}
                height={16}
              />
            </View>
          )}
          {isEditMode && type === "expansion" && (
            <View absR absT>
              <SolidAddCircle
                fill={Colors.stateBlueDefault}
                width={16}
                height={16}
              />
            </View>
          )}

          <Icon fill={item.color} width={32} height={32} />
          <Text body2 center marginT-8>
            {item.text}
          </Text>
        </TouchableOpacity>
      );
    },
    [dispatch, isEditMode, navigation]
  );

  const onActiveOrderChange = useCallback(
    (newOrderedData) => dispatch(setActiveArr(newOrderedData)),
    [dispatch]
  );

  const onExpansionOrderChange = useCallback(
    (newOrderedData) => dispatch(setExpansionArr(newOrderedData)),
    [dispatch]
  );

  return (
    <View bg-surface paddingV-8 style={[gStyles.borderV, gStyles.shadow]}>
      <SortableGridList
        key={`activeArr-${isEditMode}`}
        data={activeArr}
        numColumns={4}
        itemSpacing={16}
        listPadding={16}
        onOrderChange={onActiveOrderChange}
        renderItem={({ item, index }) => renderItem(item, index, "active")}
        extraData={activeArr}
      />

      <ExpandableSection
        top
        expanded={isExpanded}
        sectionHeader={
          isExpanded ? (
            <View link paddingV-8 center row>
              <Text caption1 stateBlueDefault marginR-4>
                Thu gọn
              </Text>
              <ExpandLess
                fill={Colors.stateBlueDefault}
                width={20}
                height={20}
              />
            </View>
          ) : (
            <View link paddingV-8 center row>
              <Text caption1 stateBlueDefault marginR-4>
                Xem thêm
              </Text>
              <ExpandMore
                fill={Colors.stateBlueDefault}
                width={20}
                height={20}
              />
            </View>
          )
        }
        onPress={() => {
          if (isExpanded && isEditMode) toggleEditMode();
          toggleExpand();
        }}
      >
        <View paddingT-16 style={gStyles.borderT}>
          <SortableGridList
            key={`expansionArr-${isEditMode}`}
            data={expansionArr}
            numColumns={4}
            itemSpacing={16}
            listPadding={16}
            onOrderChange={onExpansionOrderChange}
            renderItem={({ item, index }) =>
              renderItem(item, index, "expansion")
            }
          />
        </View>
        <View row paddingH-16 spread centerV>
          <View paddingH-4 row centerV>
            <SolidInfo fill={Colors.neutral800} width={20} height={20} />
            <Text caption1 textBlackMedium marginL-4>
              Sắp xếp hiển thị tính năng ưa thích
            </Text>
          </View>

          {isEditMode ? (
            <TouchableOpacity onPress={toggleEditMode}>
              <View padding-8 row br10 bg-stateBlueDefault>
                <Checked fill={Colors.surface} width={20} height={20} />
                <Text button surface marginL-8>
                  Lưu
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleEditMode}>
              <View br10 row padding-8 style={gStyles.border}>
                <Tune2 fill={Colors.textBlackHigh} width={20} height={20} />
                <Text button marginL-8>
                  Tuỳ chỉnh
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ExpandableSection>
    </View>
  );
};

export default memo(DashboardMenuSection);
