import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppState } from "react-native";
import { typography } from "../configs/themes";

import gStyles from "../configs/gStyles";

// ProductGroup
import FavoriteProductDetails from "../pages/product/FavoriteProductDetails";
import ModelDetails from "../pages/product/ModelDetails";

// CustomerGroup
import CustomerDetails from "../pages/customer/CustomerDetails";
import ActivityEditor from "../pages/customer/modals/ActivityEditor";
import CustomerEditor from "../pages/customer/modals/CustomerEditor";
import CustomerFilterSettings from "../pages/customer/modals/CustomerFilterSettings";
import FavoriteProductEditor from "../pages/customer/modals/FavoriteProductEditor";
import LostFrozenUpdate from "../pages/customer/modals/LostFrozenUpdate";
import ProcessUpdate from "../pages/customer/modals/ProcessUpdate";

import BranchAccessoryEditor from "../pages/contract/modals/BranchAccessoryEditor";
import BrandAccessoryEditor from "../pages/contract/modals/BrandAccessoryEditor";
import ExtendedMaintenanceEditor from "../pages/contract/modals/ExtendedMaintenanceEditor";
import PromotionEditor from "../pages/contract/modals/PromotionEditor";
import RequestBrokerEditor from "../pages/contract/modals/RequestBrokerEditor";
import RoutineMaintenanceEditor from "../pages/contract/modals/RoutineMaintenanceEditor";

// PickerGroup
import AllocationProductPicker from "../pages/picker/AllocationProductPicker";
import ApproachSourcePicker from "../pages/picker/ApproachSourcePicker";
import ApproverPicker from "../pages/picker/ApproverPicker";
import BankAccountPicker from "../pages/picker/BankAccountPicker";
import BankPicker from "../pages/picker/BankPicker";
import BranchAccessoryPicker from "../pages/picker/BranchAccessoryPicker";
import BrandAccessoryPicker from "../pages/picker/BrandAccessoryPicker";
import CompartmentPicker from "../pages/picker/CompartmentPicker";
import CustomerPicker from "../pages/picker/CustomerPicker";
import DistrictPicker from "../pages/picker/DistrictPicker";
import FavoriteProductPicker from "../pages/picker/FavoriteProductPicker";
import MaintenancePicker from "../pages/picker/MaintenancePicker";
import PolicyPicker from "../pages/picker/PolicyPicker";
import PromotionPicker from "../pages/picker/PromotionPicker";
import ProvincePicker from "../pages/picker/ProvincePicker";
import SupporterPicker from "../pages/picker/SupporterPicker";
import AccessoryPackPicker from "../pages/picker/AccessoryPackPicker";

// TestDriveGroup
import TestDrivePicker from "../pages/picker/TestDrivePicker";
import GeneralTestDriveEditor from "../pages/testDrive/modals/GeneralTestDriveEditor";
import PhotoEditor from "../pages/testDrive/modals/PhotoEditor";
import TestDriveCompleteEditor from "../pages/testDrive/modals/TestDriveCompleteEditor";
import TestDriveEditor from "../pages/testDrive/modals/TestDriveEditor";
import TestDriveIncompleteEditor from "../pages/testDrive/modals/TestDriveIncompleteEditor";
import TestDriveDetails from "../pages/testDrive/TestDriveDetails";
import TestDriveSchedule from "../pages/testDrive/TestDriveSchedule";
import TestDriveSearching from "../pages/testDrive/TestDriveSearching";

// QuotationGroup
import InsuranceDetails from "../pages/quotation/InsuranceDetails";
import InsuranceEditor from "../pages/quotation/modals/InsuranceEditor";
import QuotationDetails from "../pages/quotation/QuotationDetails";
import QuotationEditor from "../pages/quotation/QuotationEditor";

// ContractGroup
import BranchAccessoryDetails from "../pages/contract/BranchAccessoryDetails";
import BrandAccessoryDetails from "../pages/contract/BrandAccessoryDetails";
import ExtendedMaintenanceDetails from "../pages/contract/ExtendedMaintenanceDetails";
import PromotionDetails from "../pages/contract/PromotionDetails";
import RoutineMaintenanceDetails from "../pages/contract/RoutineMaintenanceDetails";

import ContractDetails from "../pages/contract/ContractDetails";
import ContractSearching from "../pages/contract/ContractSearching";
import ContractCancelEditor from "../pages/contract/modals/ContractCancelEditor";
import ContractEditor from "../pages/contract/modals/ContractEditor";
import ContractFilterSettings from "../pages/contract/modals/ContractFilterSettings";
import ContractPicker from "../pages/picker/ContractPicker";

import RequestEditor from "../pages/contract/modals/RequestEditor";

// DeliveryScheduleGroup
import DeliveryScheduleCompany from "../pages/deliverySchedule/DeliveryScheduleCompany";
import DeliveryScheduleDetails from "../pages/deliverySchedule/DeliveryScheduleDetails";
import DeliveryScheduleGallery from "../pages/deliverySchedule/DeliveryScheduleGallery";
import DeliveryCompleteEditor from "../pages/deliverySchedule/modals/DeliveryCompleteEditor";
import DeliveryFilterSettings from "../pages/deliverySchedule/modals/DeliveryFilterSettings";
import DeliveryIncompleteEditor from "../pages/deliverySchedule/modals/DeliveryIncompleteEditor";
import DeliveryScheduleEditor from "../pages/deliverySchedule/modals/DeliveryScheduleEditor";
import GeneralDeliveryScheduleEditor from "../pages/deliverySchedule/modals/GeneralDeliveryScheduleEditor";

// TaskGroup
import RequestBrokerDetails from "../pages/contract/RequestBrokerDetails";
import RequestDetails from "../pages/contract/RequestDetails";

import TaskEditor from "../pages/customer/modals/TaskEditor";
import GeneralTaskEditor from "../pages/task/GeneralTaskEditor";
import TaskDetails from "../pages/task/TaskDetails";
import TaskManagement from "../pages/task/TaskManagement";
import TaskSearching from "../pages/task/TaskSearching";

// AccountGroup
import ChangePassword from "../pages/account/ChangePassword";
import Profile from "../pages/account/Profile";

// ApprovalGroup
import ReasonReject from "../pages/approval/ReasonReject";
import ReasonRejectEditor from "../pages/approval/ReasonRejectEditor";

// SummaryGroup
import Summary from "../pages/summary/Summary";
import SummarySearching from "../pages/summary/SummarySearching";

// AllocationProductGroup
import AllocationProduct from "../pages/allocationProduct/AllocationProduct";

import { useGetNotificationStatsQuery } from "../store/api/notification";

import ArrowBackButton from "../components/Button/ArrowBackButton";
import HomeTabs from "./HomeTabs";

const Stack = createStackNavigator();

const MainStack = () => {
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);

  const { isSuccess } = useGetNotificationStatsQuery(
    {},
    { pollingInterval: 10000 }
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        !isSuccess
      ) {
        navigation.replace("Splash");
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isSuccess, navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
        headerStyle: gStyles.headerStyle,
        headerTitleStyle: typography.headerTitle,
        headerBackImage: ArrowBackButton,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeTabs}
        options={{ headerShown: false, unmountOnBlur: true }}
      />

      {/* ProductGroup */}
      <Stack.Group key="ProductGroup">
        <Stack.Screen
          name="ModelDetails"
          component={ModelDetails}
          options={{
            headerTitle: "Chi tiết sản phẩm",
          }}
        />
        <Stack.Screen
          name="FavoriteProductDetails"
          component={FavoriteProductDetails}
          options={{
            headerTitle: "Xe quan tâm",
          }}
        />
      </Stack.Group>

      {/* CustomerGroup */}
      <Stack.Group key="CustomerGroup">
        <Stack.Screen
          name="CustomerFilterSettings"
          component={CustomerFilterSettings}
          options={{
            gestureEnabled: false,
            headerTitle: "Cài đặt bộ lọc",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="CustomerEditor"
          component={CustomerEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="LostFrozenUpdate"
          component={LostFrozenUpdate}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="FavoriteProductEditor"
          component={FavoriteProductEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ActivityEditor"
          component={ActivityEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Tạo liên hệ",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetails}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="ProcessUpdate"
          component={ProcessUpdate}
          options={{
            gestureEnabled: false,
            headerTitle: "Cập nhật quy trình",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="BrandAccessoryEditor"
          component={BrandAccessoryEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Phụ kiện hãng",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="BranchAccessoryEditor"
          component={BranchAccessoryEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Phụ kiện đại lý",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="PromotionEditor"
          component={PromotionEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Khuyến mại khác",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="RoutineMaintenanceEditor"
          component={RoutineMaintenanceEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Bảo dưỡng định kỳ",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ExtendedMaintenanceEditor"
          component={ExtendedMaintenanceEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Gia hạn bảo hành",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="RequestBrokerEditor"
          component={RequestBrokerEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Môi giới",
            presentation: "modal",
          }}
        />
      </Stack.Group>

      {/* PickerGroup */}
      <Stack.Group key="PickerGroup">
        <Stack.Screen
          name="ProvincePicker"
          component={ProvincePicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn tỉnh/thành phố",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DistrictPicker"
          component={DistrictPicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn quận/huyện",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ApproachSourcePicker"
          component={ApproachSourcePicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn nguồn khách hàng",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="BankPicker"
          component={BankPicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn ngân hàng",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="BankAccountPicker"
          component={BankAccountPicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn tài khoản ngân hàng",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ApproverPicker"
          component={ApproverPicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn người ký",
          }}
        />
        <Stack.Screen
          name="SupporterPicker"
          component={SupporterPicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn người hỗ trợ",
          }}
        />
        <Stack.Screen
          name="BrandAccessoryPicker"
          component={BrandAccessoryPicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn phụ kiện",
          }}
        />
        <Stack.Screen
          name="BranchAccessoryPicker"
          component={BranchAccessoryPicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn phụ kiện",
          }}
        />
        <Stack.Screen
          name="PromotionPicker"
          component={PromotionPicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn khuyến mại",
          }}
        />
        <Stack.Screen
          name="MaintenancePicker"
          component={MaintenancePicker}
          options={{
            presentation: "modal",
            headerTitle: "Chọn gói bảo dưỡng",
          }}
        />
        <Stack.Screen
          name="FavoriteProductPicker"
          component={FavoriteProductPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn xe quan tâm",
          }}
        />
        <Stack.Screen
          name="PolicyPicker"
          component={PolicyPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn chính sách",
          }}
        />
        <Stack.Screen
          name="CustomerPicker"
          component={CustomerPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn khách hàng",
          }}
        />
        <Stack.Screen
          name="AllocationProductPicker"
          component={AllocationProductPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn xe giao",
          }}
        />
        <Stack.Screen
          name="CompartmentPicker"
          component={CompartmentPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn khoang xe",
          }}
        />
        <Stack.Screen
          name="ContractPicker"
          component={ContractPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn hợp đồng",
          }}
        />
        <Stack.Screen
          name="AccessoryPackPicker"
          component={AccessoryPackPicker}
          options={{
            gestureEnabled: false,
            presentation: "modal",
            title: "Chọn gói quà tặng",
          }}
        />
      </Stack.Group>

      {/* TestDriveGroup */}
      <Stack.Group key="TestDriveGroup">
        <Stack.Screen
          name="TestDriveEditor"
          component={TestDriveEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="TestDrivePicker"
          component={TestDrivePicker}
          options={{
            gestureEnabled: false,
            headerTitle: "Chọn xe lái thử",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="TestDriveDetails"
          component={TestDriveDetails}
          options={{
            headerTitle: "Chi tiết lịch lái thử",
          }}
        />
        <Stack.Screen
          name="TestDriveIncompleteEditor"
          component={TestDriveIncompleteEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Không hoàn thành",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="TestDriveCompleteEditor"
          component={TestDriveCompleteEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Hoàn thành",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="PhotoEditor"
          component={PhotoEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Hình ảnh giấy tờ",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="GeneralTestDriveEditor"
          component={GeneralTestDriveEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="TestDriveSchedule"
          component={TestDriveSchedule}
          options={{
            headerTitle: "Lịch lái thử",
          }}
        />
        <Stack.Screen
          name="TestDriveSearching"
          component={TestDriveSearching}
        />
      </Stack.Group>

      {/* QuotationGroup */}
      <Stack.Group key="QuotationGroup">
        <Stack.Screen
          name="QuotationEditor"
          component={QuotationEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="QuotationDetails"
          component={QuotationDetails}
          options={{
            title: "",
          }}
        />
        <Stack.Screen
          name="InsuranceEditor"
          component={InsuranceEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="InsuranceDetails"
          component={InsuranceDetails}
          options={{
            headerTitle: "Bảo hiểm",
          }}
        />
      </Stack.Group>

      {/* ContractGroup */}
      <Stack.Group key="ContractGroup">
        <Stack.Screen
          name="RequestEditor"
          component={RequestEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="BranchAccessoryDetails"
          component={BranchAccessoryDetails}
          options={{
            headerTitle: "Chi tiết phụ kiện đại lý",
          }}
        />
        <Stack.Screen
          name="BrandAccessoryDetails"
          component={BrandAccessoryDetails}
          options={{
            headerTitle: "Chi tiết phụ kiện hãng",
          }}
        />
        <Stack.Screen
          name="RoutineMaintenanceDetails"
          component={RoutineMaintenanceDetails}
          options={{
            headerTitle: "Chi tiết bảo dưỡng định kỳ",
          }}
        />
        <Stack.Screen
          name="ExtendedMaintenanceDetails"
          component={ExtendedMaintenanceDetails}
          options={{
            headerTitle: "Chi tiết gia hạn bảo hành",
          }}
        />
        <Stack.Screen
          name="PromotionDetails"
          component={PromotionDetails}
          options={{
            headerTitle: "Chi tiết khuyến mại",
          }}
        />
        <Stack.Screen
          name="RequestBrokerDetails"
          component={RequestBrokerDetails}
          options={{
            headerTitle: "Chi tiết hoa hồng",
          }}
        />
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetails}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="ContractFilterSettings"
          component={ContractFilterSettings}
          options={{
            gestureEnabled: false,
            headerTitle: "Cài đặt bộ lọc",
            presentation: "modal",
          }}
        />
        <Stack.Screen name="ContractSearching" component={ContractSearching} />
        <Stack.Screen
          name="ContractDetails"
          component={ContractDetails}
          options={{
            headerTitle: "",
          }}
        />
        <Stack.Screen
          name="ContractCancelEditor"
          component={ContractCancelEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Hủy hợp đồng",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ContractEditor"
          component={ContractEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Hợp đồng",
            presentation: "modal",
          }}
        />
      </Stack.Group>

      {/* DeliveryScheduleGroup */}
      <Stack.Group key="DeliveryScheduleGroup">
        <Stack.Screen
          name="DeliveryScheduleDetails"
          component={DeliveryScheduleDetails}
          options={{
            headerTitle: "Chi tiết lịch giao xe",
          }}
        />
        <Stack.Screen
          name="DeliveryIncompleteEditor"
          component={DeliveryIncompleteEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Không hoàn thành",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DeliveryCompleteEditor"
          component={DeliveryCompleteEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Hoàn thành",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DeliveryScheduleEditor"
          component={DeliveryScheduleEditor}
          options={{
            gestureEnabled: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="GeneralDeliveryScheduleEditor"
          component={GeneralDeliveryScheduleEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Tạo lịch giao xe",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DeliveryFilterSettings"
          component={DeliveryFilterSettings}
          options={{
            gestureEnabled: false,
            headerTitle: "Cài đặt bộ lọc",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DeliveryScheduleCompany"
          component={DeliveryScheduleCompany}
          options={{
            headerTitle: "Lịch giao xe toàn công ty",
          }}
        />
        <Stack.Screen
          name="DeliveryScheduleGallery"
          component={DeliveryScheduleGallery}
          options={{
            headerTitle: "Hình ảnh giao xe",
          }}
        />
      </Stack.Group>

      {/* TaskGroup */}
      <Stack.Group key="TaskGroup">
        <Stack.Screen name="TaskManagement" component={TaskManagement} />
        <Stack.Screen
          name="TaskEditor"
          component={TaskEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Tạo lịch làm việc",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="GeneralTaskEditor"
          component={GeneralTaskEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Tạo lịch làm việc",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          options={{
            headerTitle: "Lịch làm việc",
          }}
        />
        <Stack.Screen name="TaskSearching" component={TaskSearching} />
      </Stack.Group>

      {/* AccountGroup */}
      <Stack.Group key="AccountGroup">
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            headerTitle: "Thông tin cá nhân",
          }}
        />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
      </Stack.Group>

      {/* ApprovalGroup */}
      <Stack.Group key="ApprovalGroup">
        <Stack.Screen
          name="ReasonRejectEditor"
          component={ReasonRejectEditor}
          options={{
            gestureEnabled: false,
            headerTitle: "Lý do từ chối",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ReasonReject"
          component={ReasonReject}
          options={{
            headerTitle: "Lý do từ chối",
          }}
        />
      </Stack.Group>

      {/* SummaryGroup */}
      <Stack.Group key="SummaryGroup">
        <Stack.Screen
          name="Summary"
          component={Summary}
          options={{
            headerTitle: "Doanh số và Vinh Danh",
          }}
        />
        <Stack.Screen name="SummarySearching" component={SummarySearching} />
      </Stack.Group>

      {/* AllocationProductGroup */}
      <Stack.Screen
        name="AllocationProduct"
        component={AllocationProduct}
        options={{
          headerTitle: "Danh sách phân xe",
        }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
