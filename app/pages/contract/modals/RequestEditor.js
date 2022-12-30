import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";

import {
  Button,
  LoaderScreen,
  TabController,
  Text,
  View,
} from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNotification } from "../../../providers/NotificationProvider";
import BasePage from "../../../components/Base/BasePage";
import RequestCustomerTab from "../tabs/RequestCustomerTab";
import RequestProductTab from "../tabs/RequestProductTab";

import { CustomerTypes } from "../../../helper/constants";
import { getNewIds, toISO } from "../../../helper/utils";
import {
  useCreateRequestMutation,
  useUpdateRequestMutation,
} from "../../../store/api/request";

const schema = yup.object().shape({
  // customer tab
  holderType: yup.string(),
  holderInfo: yup
    .object()
    .when("holderType", {
      is: CustomerTypes.personal,
      then: yup.object({
        lastName: yup.string().nullable(true),
        firstName: yup.string().required(),
        phoneNumber: yup.string().required(),
        province: yup.object().required(),
        district: yup.object().required(),
        address: yup.string().required(),
        citizenIdentity: yup.string().required(),
        issuedDate: yup.string().required(),
        issuedPlace: yup.string().required(),
      }),
    })
    .when("holderType", {
      is: CustomerTypes.corporate,
      then: yup.object({
        companyName: yup.string().required(),
        taxCode: yup.string().required(),
        ownerName: yup.string().required(),
        ownerTitle: yup.string().required(),
        phoneNumber: yup.string().required(),
        province: yup.object().required(),
        district: yup.object().required(),
        address: yup.string().required(),
        citizenIdentity: yup.string().nullable(true),
        issuedDate: yup.string().nullable(true),
        issuedPlace: yup.string().nullable(true),
      }),
    }),

  contactInfo: yup.object({
    isHolder: yup.boolean(),
    lastName: yup.string().nullable(true),
    firstName: yup.string().nullable(true),
    phoneNumber: yup.string().nullable(true),
    province: yup.object().nullable(true),
    district: yup.object().nullable(true),
    address: yup.string().nullable(true),
  }),
  // product tab
  favoriteProduct: yup.object().required(),
  policy: yup.object().required(),
  quantity: yup.number().integer().min(1).required(),
  fromDate: yup.string().required(),
  toDate: yup.string().required(),
  deposit: yup.number().integer().required(),
  depositDate: yup.string().required(),
  discount: yup
    .number()
    .positive()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(true)
    .when("discountType", {
      is: (discountType) => discountType !== null && discountType !== undefined,
      then: yup.number().required(),
    }),
  paymentMethod: yup.string().required(),
  bank: yup.object().nullable(true).when("paymentMethod", {
    is: "Trả góp",
    then: yup.object().required(),
  }),
  loanAmount: yup.number().nullable(true).when("paymentMethod", {
    is: "Trả góp",
    then: yup.number().integer().required(),
  }),
  intendedUse: yup.string().required(),
  buyingType: yup.string().required(),
  registration: yup.string().required(),
  deliveryPlace: yup.string().required(),

  presents: yup.string().nullable(true),
  note: yup.string().nullable(true),

  requestBrandAccessories: yup.array().nullable(true),
  requestBranchAccessories: yup.array().nullable(true),
  insurances: yup.array().nullable(true),
  routineMaintenances: yup.array().nullable(true),
  extendedMaintenances: yup.array().nullable(true),
  requestPromotions: yup.array().nullable(true),

  requestBroker: yup.object().nullable(true),
});

const tabs = [
  { label: "Thông tin KH", component: RequestCustomerTab },
  { label: "Thông tin xe", component: RequestProductTab },
];
const keyCustomerTab1 = ["holderType", "holderInfo", "contactInfo"];

const RequestEditor = ({ navigation, route }) => {
  const { customer, request } = route.params;

  const notification = useNotification();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const [createRequest, { isLoading, isSuccess }] = useCreateRequestMutation();

  const [updateRequest, { isLoading: isUpdating, isSuccess: isUpdateSuccess }] =
    useUpdateRequestMutation();

  const loading = isLoading || isUpdating;

  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Tạo thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const defaultValues = useMemo(
    () =>
      request
        ? {
            ...request,
            holderType: request.holderInfo.type,
          }
        : {
            holderInfo: {
              type: customer.type,
              civility: customer.civility,
              lastName: customer.lastName,
              firstName: customer.firstName,
              phoneNumber: customer.phoneNumber,
              province: customer.province,
              district: customer.district,
              address: customer.address,
              citizenIdentity: customer.customerInfo.citizenIdentity,
              issuedDate: customer.customerInfo.issuedDate,
              issuedPlace: customer.customerInfo.issuedPlace,
              companyName: customer.customerInfo.companyName,
              taxCode: customer.customerInfo.taxCode,
              ownerName: customer.customerInfo.ownerName,
              ownerTitle: customer.customerInfo.ownerTitle,
            },
            contactInfo: {
              isHolder: true,
              civility: customer.civility,
              lastName: customer.lastName,
              firstName: customer.firstName,
              phoneNumber: customer.phoneNumber,
              province: customer.province,
              district: customer.district,
              address: customer.address,
            },
            holderType: customer.type,
          },
    [
      customer.address,
      customer.civility,
      customer.customerInfo.citizenIdentity,
      customer.customerInfo.companyName,
      customer.customerInfo.issuedDate,
      customer.customerInfo.issuedPlace,
      customer.customerInfo.ownerName,
      customer.customerInfo.ownerTitle,
      customer.customerInfo.taxCode,
      customer.district,
      customer.firstName,
      customer.lastName,
      customer.phoneNumber,
      customer.province,
      customer.type,
      request,
    ]
  );

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { errors } = form.formState;

  const changeTab = useCallback((index) => setSelectedTab(index), []);

  useEffect(() => {
    if (errors && !isEmpty(errors)) {
      const inCustomerTab = keyCustomerTab1.some((key) => errors[key]);

      if (inCustomerTab) {
        changeTab(0);
      } else {
        changeTab(1);
      }
    }
  }, [changeTab, errors]);

  const handleSave = useCallback(
    (data) => {
      const _data = {
        ...data,
        saleId: customer.sales[0].id,
        // customer tab
        holderInfo: {
          ...data.holderInfo,
          provinceId: data.contactInfo.province?.id,
          districtId: data.contactInfo.district?.id,
        },
        contactInfo: {
          ...data.contactInfo,
          provinceId: data.contactInfo.province?.id,
          districtId: data.contactInfo.district?.id,
        },

        // product tab
        favoriteProductId: data.favoriteProduct.id,
        policyId: data.policy.id,
        accessoryPackId: data.accessoryPack.id,
        listedPrice: data.favoriteProduct?.product.listedPrice,
        fromDate: toISO(data.fromDate),
        toDate: toISO(data.toDate),
        depositDate: toISO(data.depositDate),
        bankId: data.bank?.id,

        requestBrandAccessoryIds: getNewIds(data.requestBrandAccessories),
        requestBranchAccessoryIds: getNewIds(data.requestBranchAccessories),
        insuranceIds: getNewIds(data.insurances),
        routineMaintenanceIds: getNewIds(data.routineMaintenances),
        extendedMaintenanceIds: getNewIds(data.extendedMaintenances),

        requestBrokerId: data.requestBroker?.id,
        requestPromotionIds: getNewIds(data.requestPromotions),
      };

      delete _data.favoriteProduct;
      delete _data.policy;
      delete _data.bank;
      delete _data.requestBrandAccessories;
      delete _data.requestBranchAccessories;
      delete _data.insurances;
      delete _data.routineMaintenances;
      delete _data.extendedMaintenances;
      delete _data.requestBroker;
      delete _data.requestPromotions;

      // customer tab
      if (data.contactInfo.issuedDate)
        _data.contactInfo.issuedDate = toISO(data.contactInfo.issuedDate);

      if (request) {
        _data.id = request.id;

        updateRequest(_data);
      } else {
        createRequest(_data);
      }
    },
    [createRequest, customer.sales, request, updateRequest]
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: request
        ? "Cập nhật đề xuất bán hàng"
        : "Tạo đề xuất bán hàng",
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          disabled={loading}
          onPress={form.handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [form, handleBack, handleSave, loading, navigation, request]);

  return (
    <BasePage loading={loading} hasScroll={false}>
      <TabController
        items={tabs}
        selectedIndex={selectedTab}
        onChangeIndex={changeTab}
      >
        <TabController.TabBar />
        <View flex>
          {tabs.map(({ label, component: TabPanel }, index) => (
            <TabController.TabPage
              key={label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <TabPanel form={form} navigation={navigation} route={route} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </BasePage>
  );
};

RequestEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      customer: PropTypes.object,
      request: PropTypes.object,
    }),
  }),
};

export default RequestEditor;
