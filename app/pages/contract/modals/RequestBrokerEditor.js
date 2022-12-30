import React, { useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { ScrollView } from "react-native";
import { Button, Keyboard, Text, View } from "react-native-ui-lib";
import { Toast } from "react-native-ui-lib/src/incubator";

import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNotification } from "../../../providers/NotificationProvider";
import BasePage from "../../../components/Base/BasePage";
import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import PriceSummaryCard from "../../../components/Card/PriceSummaryCard";
import TextInput from "../../../components/Input/TextInput";
import TextRow from "../../../components/TextRow";

import { currencyFormatter, formatDate } from "../../../helper/utils";
import gStyles from "../../../configs/gStyles";

import {
  useCreateRequestBrokerMutation,
  useUpdateRequestBrokerMutation,
} from "../../../store/api/request";
import { useGetCustomerQuery } from "../../../store/api/customer";

const schema = yup.object().shape({
  amount: yup.number().required(),
  note: yup.string().nullable(true),
});

const RequestBrokerEditor = ({ navigation, route: { params } }) => {
  const { onChange, customer } = params;

  const notification = useNotification();

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const { data, isFetching } = useGetCustomerQuery({ code: customer.code });

  const [createRequestBroker, { data: newItem, isLoading, isSuccess }] =
    useCreateRequestBrokerMutation();

  const [
    updateRequestBroker,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess },
  ] = useUpdateRequestBrokerMutation();

  const loading = isFetching || isLoading || isUpdating;

  useEffect(() => {
    if (isSuccess) {
      notification.showMessage("Tạo thành công", Toast.presets.SUCCESS);
      onChange?.({ ...newItem, isNew: true });
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, navigation, newItem, onChange]);

  useEffect(() => {
    if (isUpdateSuccess) {
      notification.showMessage("Cập nhật thành công", Toast.presets.SUCCESS);
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateSuccess, navigation]);

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const amount = watch("amount");

  const handleSave = useCallback(
    (req) => {
      createRequestBroker({
        ...req,
        brokerId: data.brokerInfo?.id,
      });
    },
    [createRequestBroker, data.brokerInfo?.id]
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
          disabled={loading}
          onPress={handleSubmit(handleSave)}
        >
          <Text headerAction>Lưu</Text>
        </Button>
      ),
    });
  }, [handleBack, handleSave, handleSubmit, loading, navigation]);

  const brokerInformation = useMemo(() => {
    if (!data || !data.brokerInfo || !data.hasBroker) return [];

    return [
      {
        label: "Họ và tên",
        value: data.brokerInfo.name,
      },
      {
        label: "CMT/CCCD",
        value: data.brokerInfo.citizenIdentity,
      },
      {
        label: "Nơi cấp",
        value: data.brokerInfo.issuedPlace,
      },
      {
        label: "Ngày cấp",
        value:
          data.brokerInfo.issuedDate && formatDate(data.brokerInfo.issuedDate),
      },
      {
        label: "Quan hệ với KH",
        value: data.brokerInfo.relationship,
      },
      {
        label: "Số điện thoại",
        value: data.brokerInfo.phoneNumber,
      },
      {
        label: "Địa chỉ",
        value: data.brokerInfo.address,
      },
      {
        label: "Ngân hàng",
        value: data.brokerInfo.bank?.name,
      },
      {
        label: "Số tài khoản",
        value: data.brokerInfo.bankAccount,
      },
    ];
  }, [data]);

  // const handleUpdateBroker = useCallback(
  //   () => navigation.navigate("CustomerEditor", { customer: data }),
  //   [data, navigation]
  // );

  return (
    <BasePage loading={loading} hasScroll={false}>
      <View flex spread>
        <View flexS>
          <Keyboard.KeyboardTrackingView>
            <ScrollView contentContainerStyle={gStyles.basePage}>
              {Boolean(brokerInformation.length) && (
                <>
                  <Headline label="Thông tin môi giới" marginT-8 />
                  <View
                    bg-surface
                    padding-16
                    paddingT-8
                    style={[gStyles.borderV, gStyles.shadow]}
                  >
                    {brokerInformation.map((e) => (
                      <TextRow key={e.label} left={e.label} right={e.value} />
                    ))}
                  </View>
                </>
              )}

              <Headline label="Hoa hồng" />
              <View
                bg-white
                padding-16
                style={[gStyles.borderV, gStyles.shadow]}
              >
                <View row centerV>
                  <InputLabel text="Giá trị" />
                  <View flex-2>
                    <Controller
                      name="amount"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextInput
                          placeholder="Nhập"
                          keyboardType="numeric"
                          value={value}
                          returnKeyType="done"
                          error={error}
                          isError={Boolean(error)}
                          formatter={currencyFormatter}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                </View>
                <View row centerV marginT-10>
                  <InputLabel text="Ghi chú" />
                  <View flex-2>
                    <Controller
                      name="note"
                      control={control}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextInput
                          placeholder="Nhập"
                          multiline
                          value={value}
                          error={error}
                          isError={Boolean(error)}
                          onChangeText={onChange}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
          </Keyboard.KeyboardTrackingView>
        </View>

        <PriceSummaryCard
          price={currencyFormatter(amount)}
          discount={""}
          total={currencyFormatter(amount)}
        />
      </View>
    </BasePage>
  );
};

RequestBrokerEditor.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      onChange: PropTypes.func,
      customer: PropTypes.object,
    }),
  }),
};

export default RequestBrokerEditor;
