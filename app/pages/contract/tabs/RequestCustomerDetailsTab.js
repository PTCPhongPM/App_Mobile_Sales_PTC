import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { RefreshControl, ScrollView } from "react-native";
import { Colors, View } from "react-native-ui-lib";

import TextRow from "../../../components/TextRow";
import Headline from "../../../components/Header/Headline";

import gStyles from "../../../configs/gStyles";
import { CustomerTypes } from "../../../helper/constants";

const RequestCustomerDetailsTab = ({ request, refetch, loading }) => {
  const holderInfo = useMemo(() => {
    const holder = request?.holderInfo || {};

    return [
      ...(holder.type === CustomerTypes.corporate
        ? [
            {
              label: "Tên công ty",
              value: holder.companyName,
            },
            {
              label: "Mã số thuế",
              value: holder.taxCode,
            },
            {
              label: "Người đại diện",
              value: holder.ownerName,
            },
            {
              label: "Chức vụ",
              value: holder.ownerTitle,
            },
          ]
        : [
            {
              label: "Họ và tên đệm",
              value: holder.lastName,
            },
            {
              label: "Tên khách hàng",
              value: holder.firstName,
            },
            {
              label: "CMT/CCCD",
              value: holder.citizenIdentity,
            },
            {
              label: "Nơi cấp",
              value: holder.issuedPlace,
            },
            {
              label: "Ngày cấp",
              value: holder.issuedDate,
            },
            
          ]),
      {
        label: "Điện thoại",
        value: holder.phoneNumber,
      },
      {
        label: "Tỉnh/Thành phố",
        value: holder.province?.name,
      },
      {
        label: "Quận/Huyện",
        value: holder.district?.name,
      },
      {
        label: "Địa chỉ",
        value: holder.address,
      },
      {
        label: "Nguồn thông tin",
        value: holder.infoSource,
      },
      {
        label: "Lý do mua xe honda",
        value: holder.reasonBuy?.join(";"),
      },
    ];
  }, [request]);

  const contactInfo = useMemo(() => {
    const contact = request?.holderInfo || {};

    return [
      {
        label: "Họ và tên đệm",
        value: contact.lastName,
      },
      {
        label: "Tên khách hàng",
        value: contact.firstName,
      },
      {
        label: "Điện thoại",
        value: contact.phoneNumber,
      },
      {
        label: "Tỉnh/Thành phố",
        value: contact.province?.name,
      },
      {
        label: "Quận/Huyện",
        value: contact.district?.name,
      },
      {
        label: "Địa chỉ",
        value: contact.address,
      },
    ];
  }, [request]);

  return (
    <ScrollView
      contentContainerStyle={gStyles.basePage}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={loading}
          onRefresh={refetch}
        />
      }
    >
      <Headline label="Thông tin khách hàng" />
      <View
        bg-surface
        paddingH-16
        paddingT-8
        paddingB-16
        style={[gStyles.borderV, gStyles.shadow]}
      >
        {holderInfo.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>

      <Headline label="Thông tin liên hệ" />
      <View
        bg-surface
        paddingH-16
        paddingT-8
        paddingB-16
        style={[gStyles.borderV, gStyles.shadow]}
      >
        {contactInfo.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>
    </ScrollView>
  );
};

RequestCustomerDetailsTab.propTypes = {
  loading: PropTypes.bool,
  refetch: PropTypes.func,
  request: PropTypes.shape({
    holderInfo: PropTypes.object,
  }),
};

export default RequestCustomerDetailsTab;
