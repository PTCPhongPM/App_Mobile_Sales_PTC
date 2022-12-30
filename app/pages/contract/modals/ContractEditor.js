import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

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

import BasePage from "../../../components/Base/BasePage";

import ContractCustomerTab from "../tabs/ContractCustomerTab";
import ContractProductTab from "../tabs/ContractProductTab";
import ContractEditorTab from "../tabs/ContractEditorTab";

import { useNotification } from "../../../providers/NotificationProvider";
import gStyles from "../../../configs/gStyles";

import { useUpdateContractMutation } from "../../../store/api/contract";
import { toISO } from "../../../helper/utils";

const schema = yup.object().shape({
  code2: yup.string().nullable(true),
  type: yup.string().required(),
  paymentMethod: yup.string().required(),
  bank: yup.object().nullable(true).when("paymentMethod", {
    is: "Trả góp",
    then: yup.object().required(),
  }),
  loanAmount: yup.number().nullable(true).when("paymentMethod", {
    is: "Trả góp",
    then: yup.number().required(),
  }),
  signingDate: yup.string().required(),
  signer: yup.string().required(),
  // bankAccount: yup.object().required(),
  bankAccount: yup.object().required(),
  secondAmount: yup.number().min(0).required(),
  remainingAmount: yup.number().min(0).required(),
});

const tabs = [
  { label: "Thông tin HĐ", component: ContractEditorTab },
  { label: "Thông tin KH", component: ContractCustomerTab },
  { label: "Thông tin xe", component: ContractProductTab },
];

const ContractEditor = ({ navigation, route }) => {
  const notification = useNotification();
  const contract = route.params.contract;

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      code2: contract.code2,
      type: contract.type,
      paymentMethod: contract.paymentMethod,
      bank: contract.bank,
      loanAmount: contract.loanAmount,
      signingDate: contract.signingDate,
      signer: contract.signer,
      bankAccount: contract.bankAccount,
      secondAmount: contract.secondAmount,
      remainingAmount: contract.remainingAmount,
    },
  });

  const [updateContract, { isLoading, isSuccess }] =
    useUpdateContractMutation();

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleSave = useCallback(
    (data) => {
      return updateContract({
        id: contract.id,
        code2: data.code2,
        type: data.type,
        paymentMethod: data.paymentMethod,
        bankId: data.bank?.id,
        loanAmount: data.loanAmount,
        signingDate: toISO(data.signingDate),
        signer: data.signer,
        bankAccountId: data.bankAccount?.id,
        secondAmount: data.secondAmount,
        remainingAmount: data.remainingAmount,
      });
    },
    [contract.id, updateContract]
  );

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Button link paddingH-16 onPress={handleBack}>
          <Text headerAction>Hủy</Text>
        </Button>
      ),
      headerRight: () => (
        <Button
          link
          paddingH-16
          // disabled={loading}
          onPress={form.handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [form, handleBack, handleSave, navigation]);

  const [selectedTab, setSelectedTab] = useState(0);
  const changeTab = useCallback((index) => setSelectedTab(index), []);

  return (
    <BasePage hasScroll={false} loading={isLoading}>
      <TabController
        items={tabs}
        selectedIndex={selectedTab}
        onChangeIndex={changeTab}
      >
        <TabController.TabBar />
        <View flex style={gStyles.borderT}>
          {tabs.map(({ label, component: TabPanel }, index) => (
            <TabController.TabPage
              key={label}
              index={index}
              lazy
              renderLoading={() => <LoaderScreen />}
            >
              <TabPanel contract={contract} form={form} />
            </TabController.TabPage>
          ))}
        </View>
      </TabController>
    </BasePage>
  );
};

ContractEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      contract: PropTypes.object,
    }),
  }),
};

export default ContractEditor;
