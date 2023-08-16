import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { Linking, ScrollView } from "react-native";
import {
  Avatar,
  Button,
  Colors,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import ContextMenu from "react-native-context-menu-view";

import { useNotification } from "../../providers/NotificationProvider";

import {
  Edit,
  More,
  SolidCall,
  SolidCold,
  SolidPersonalRemove,
  SolidSms,
} from "../../configs/assets";

import BasePage from "../../components/Base/BasePage";
import NormalChip from "../../components/Chip/NormalChip";
import CustomerStateChip from "../../components/Chip/CustomerStateChip";

import gStyles from "../../configs/gStyles";

import {
  useDeleteCustomerMutation,
  useGetCustomerQuery,
  useReceiveCustomerMutation,
  useUpdateCustomerMutation,
} from "../../store/api/customer";

import { showDeleteAlert } from "../../helper/alert";
import {
  getCustomerName,
  checkSaleActive,
  checkSaleDone,
} from "../../helper/utils";
import { CustomerStates } from "../../helper/constants";
import { useDirectorRole, useSaleAdminRole } from "../../helper/hooks";

// tabs
import CustomerCare from "./tabs/CustomerCare";
import Information from "./tabs/Information";
import Overview from "./tabs/Overview";
import Products from "./tabs/Products";
import TestDrive from "./tabs/TestDrive";
import Request from "./tabs/Request";
import Contract from "./tabs/Contract";

const tabs = [
  { label: "Tổng quan", component: Overview },
  { label: "Thông tin", component: Information },
  { label: "Sản phẩm", component: Products },
  { label: "Chăm sóc", component: CustomerCare },
  { label: "Lái thử", component: TestDrive },
  { label: "Đề xuất BH", component: Request },
  { label: "Hợp đồng", component: Contract },
];

const CustomerDetails = ({ navigation, route }) => {
  const { customer } = route.params;
  const notification = useNotification();

  const {
    data: customerDetails = {
      sales: [],
    },
    isFetching,
  } = useGetCustomerQuery({
    code: customer.code,
  });

  const [selectedTab, setSelectedTab] = useState(0);

  const [
    updateCustomer,
    { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess },
  ] = useUpdateCustomerMutation();

  const [
    deleteCustomer,
    { isSuccess: isDeleteSuccess, isLoading: isDeleteLoading },
  ] = useDeleteCustomerMutation();

  const [
    receiveCustomer,
    { isLoading: isReceiving, isSuccess: isReceiveSuccess },
  ] = useReceiveCustomerMutation();

  const isSaleActive = useMemo(
    () => checkSaleActive(customerDetails),
    [customerDetails]
  );

  const isSaleDone = useMemo(
    () => checkSaleDone(customerDetails),
    [customerDetails]
  );

  const isDirector = useDirectorRole();
  const isSaleAdmin = useSaleAdminRole();

  const handleEditPressed = useCallback(
    () => navigation.navigate("CustomerEditor", { customer: customerDetails }),
    [customerDetails, navigation]
  );

  const loading =
    isFetching || isUpdateLoading || isDeleteLoading || isReceiving;

  useEffect(() => {
    if (isDeleteSuccess) {
      notification.showMessage("Xoá thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeleteSuccess, navigation]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isReceiveSuccess) {
      notification.showMessage("Nhận khách thành công", Toast.presets.SUCCESS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReceiveSuccess]);

  const handleUpdateCustomerState = useCallback(
    (state) => updateCustomer({ code: customerDetails.code, state }),
    [customerDetails.code, updateCustomer]
  );

  const handleReceiveCustomer = useCallback(
    () => receiveCustomer({ code: customerDetails.code }),
    [customerDetails.code, receiveCustomer]
  );

  const handleLostFrozenUpdate = useCallback(
    (state) =>
      navigation.navigate("LostFrozenUpdate", {
        customer: customerDetails,
        state,
      }),
    [customerDetails, navigation]
  );
  useEffect(() => {
    // Lấy giá trị selectedTabIndex từ params nếu có
    const { selectedTabIndex } = route.params || {};
    if (selectedTabIndex !== undefined) {
      setSelectedTab(selectedTabIndex);
    }
  }, [route.params]);
  const contextActions = useMemo(() => {
    let result = [];
    if (isSaleActive) {
      result = [
        ...Object.keys(CustomerStates)
          .filter((state) => state !== customerDetails.state)
          .map((state) => ({
            title: `Chuyển ${CustomerStates[state]}`,
            onPress: () => handleUpdateCustomerState(state),
          })),
        {
          title: "Đóng băng",
          onPress: () => handleLostFrozenUpdate("frozen"),
        },
        {
          title: "Mất khách",
          onPress: () => handleLostFrozenUpdate("lost"),
        },
      ];
    } else if (isSaleDone) {
      result.push({
        title: "Mua thêm",
        // todo
        onPress: () => {},
      });
    } else {
      result.push({
        title: "Nhận khách",
        onPress: handleReceiveCustomer,
      });
    }

    result.push({
      title: "Xoá khách hàng",
      destructive: true,
      onPress: () =>
        showDeleteAlert(
          "Xoá khách hàng?",
          "Hành động này không thể hoàn tác",
          () => deleteCustomer({ code: customerDetails.code })
        ),
    });

    return result;
  }, [
    customerDetails.code,
    customerDetails.state,
    deleteCustomer,
    handleLostFrozenUpdate,
    handleReceiveCustomer,
    handleUpdateCustomerState,
    isSaleActive,
    isSaleDone,
  ]);

  const handelMenuPressed = useCallback(
    ({ nativeEvent: { index } }) => contextActions[index].onPress(),
    [contextActions]
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View row>
          {isSaleActive && !customer.isNotMe && (
            <Button link paddingH-8 onPress={handleEditPressed}>
              <Edit fill={Colors.surface} />
            </Button>
          )}
         {!customer.isNotMe && (<ContextMenu
            actions={contextActions}
            dropdownMenuMode
            previewBackgroundColor="transparent"
            onPress={handelMenuPressed}
          >
            <View paddingR-16 paddingL-8>
              <More fill={Colors.surface} />
            </View>
          </ContextMenu>
         )}
        </View>
         
      ),
    });
  }, [
    contextActions,
    handelMenuPressed,
    handleEditPressed,
    isSaleActive,
    navigation,
  ]);

  const changeTab = useCallback((index) => setSelectedTab(index), []);

  const bottomOptions = useMemo(
    () => [
      {
        id: "SolidSms",
        icon: SolidSms,
        onPress: () => Linking.openURL(`sms:${customerDetails.phoneNumber}`),
      },
      {
        id: "SolidCall",
        icon: SolidCall,
        onPress: () => Linking.openURL(`tel:${customerDetails.phoneNumber}`),
      },
      {
        id: "SolidCold",
        icon: SolidCold,
        onPress: () => handleLostFrozenUpdate("frozen"),
      },
      {
        id: "SolidPersonalRemove",
        icon: SolidPersonalRemove,
        onPress: () => handleLostFrozenUpdate("lost"),
      },
    ],
    [customerDetails.phoneNumber, handleLostFrozenUpdate]
  );

  const renderBottomOptions = useCallback(
    () =>
      isSaleActive && !customer.isNotMe &&(
        <View center bg-surface style={[gStyles.shadowUp, gStyles.borderT]}>
          <View height={6} />
          <View
            bg-neutral100
            br60
            center
            paddingV-8
            row
            style={[gStyles.shadow, gStyles.border]}
          >
            {bottomOptions.map((element) => (
              <Button
                key={element.id}
                link
                paddingH-24
                onPress={element.onPress}
              >
                <element.icon fill={Colors.black} />
              </Button>
            ))}
          </View>
        </View>
      ),
    [bottomOptions, isSaleActive]
  );

  return (
    <BasePage hasScroll={false} loading={loading} bg-surface>
      <View flex>
        <View row centerV paddingH-16 paddingT-4 paddingB-12 bg-primary900>
          <View flex>
            <Text subtitle1 textWhiteHigh marginB-4>
              {getCustomerName(customerDetails)}
            </Text>
            <View row paddingV-2>
              {isSaleActive && (
                <CustomerStateChip marginR-4 state={customerDetails.state} />
              )}

              {[customerDetails.paymentMethod, customerDetails.source].map(
                (e, index) => (
                  <NormalChip marginR-4 key={`${e}-${index}`} label={e} />
                )
              )}
            </View>
          </View>
          {(isDirector ||  isSaleAdmin)&& (
            <Avatar
              name={customerDetails.saler?.name}
              source={{
                uri: customerDetails.saler?.avatar?.url,
              }}
              resizeMode="cover"
              size={40}
            />
          )}
        </View>
        {(customerDetails.category!='frozen' && customerDetails.category!='lost') &&
        <TabController
          items={tabs}
          selectedIndex={selectedTab}
          onChangeIndex={changeTab}
        >
          <ScrollView scrollEnabled={false} style={gStyles.tabBarScroll}>
            <TabController.TabBar faderProps={{ size: 0 }} />
          </ScrollView>
          <View flex>
            {tabs.map((tab, index) => (
              <TabController.TabPage
                key={tab.label}
                index={index}
                lazy
                renderLoading={() => <LoaderScreen />}
              >
                <tab.component
                  customer={customerDetails}
                  isNotMe={customer.isNotMe}
                  changeTab={changeTab}
                />
              </TabController.TabPage>
            ))}
          </View>
        </TabController>
      }
      {
        (customerDetails.category=='frozen' || customerDetails.category=='lost') &&
          <Information customer={customerDetails}></Information>
      }
        {renderBottomOptions()}
      </View>
    </BasePage>
  );
};

CustomerDetails.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.shape({
        code: PropTypes.string,
      }),
    }),
  }),
};

export default CustomerDetails;
