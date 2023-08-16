import React, { useMemo } from "react";
import PropTypes from "prop-types";

import { View } from "react-native-ui-lib";

import BasePage from "../../../components/Base/BasePage";
import Headline from "../../../components/Header/Headline";
import TextRow from "../../../components/TextRow";

import { formatDate, getCustomerName } from "../../../helper/utils";
import {
  Civilities,
  CustomerStates,
  CustomerTypes,
  Genders,
  MaritalStatus,
  RangAges
} from "../../../helper/constants";

import { useGetCustomerQuery } from "../../../store/api/customer";
import gStyles from "../../../configs/gStyles";

const Information = ({ customer,isNotMe }) => {
  const { data, isFetching } = useGetCustomerQuery({ code: customer.code });

  const additionInformation = useMemo(() => {
    if (!data || !data.customerInfo) return [];

    if (data.type === CustomerTypes.corporate) {
      return [
        {
          label: "Chủ sở hữu",
          value: data.customerInfo.ownerName,
        },
        {
          label: "Chức vụ",
          value: data.customerInfo.ownerTitle,
        },
        {
          label: "Mã số thuế",
          value: data.customerInfo.taxCode,
        },
      ];
    }

    return [
      {
        label: "Ngày sinh",
        value:
          data.customerInfo.birthday && formatDate(data.customerInfo.birthday),
      },
      {
        label: "CMT/CCCD",
        value: data.customerInfo.citizenIdentity,
      },
      {
        label: "Nơi cấp",
        value: data.customerInfo.issuedPlace,
      },
      {
        label: "Ngày cấp",
        value:
          data.customerInfo.issuedDate &&
          formatDate(data.customerInfo.issuedDate),
      },
      {
        label: "Giới tính",
        value: Genders[data.customerInfo.gender],
      },
      {
        label: "Hôn nhân",
        value: MaritalStatus[data.customerInfo.maritalStatus],
      },
      {
        label: "Nghề nghiệp",
        value: data.customerInfo.profession,
      },
      {
        label: "Sở thích",
        value: data.customerInfo.interests,
      },
      {
        label: "Nguồn thông tin tiếp cận",
        value: data.customerInfo.approachSource,
      },
      {
        label: "Email",
        value: data.customerInfo.email,
      },
    ];
  }, [data]);

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

  const information = useMemo(() => {
    if (!data) return [];

    const array = [
      {
        label: "Ngày khởi tạo",
        value: formatDate(data.createdAt),
      },
      {
        label: "Ngày liên hệ",
        value: data.firstContactDate && formatDate(data.firstContactDate),
      },
      {
        label: "Danh xưng",
        value: Civilities[data.civility],
      },
      {
        label: "Tên khách hàng",
        value: getCustomerName(data),
      },
      {
        label: "Độ tuổi",
        value: RangAges[data?.rangeAge],
      },
      {
        label: "Ghi chú",
        value: data.note,
      },
      {
        label: "Số điện thoại",
        value: (isNotMe == true || (customer.category=='frozen' || customer.category=='lost')) ? data.phoneNumber.slice(0, -3) + "xxx" : data.phoneNumber,
      },
      {
        label: "Tỉnh/Thành phố",
        value: data.province?.name,
      },
      {
        label: "Quận/Huyện",
        value: data.district?.name,
      },
      {
        label: "Địa chỉ",
        value: data.address,
      },
      {
        label: "Tình trạng",
        value: CustomerStates[data.state],
      },
      {
        label: "Ngày ký HD",
        value: data.expectedSigningDate,
      },
      {
        label: "Hình thức thanh toán",
        value: data.paymentMethod,
      },
      {
        label: "Vai trò",
        value: data.role,
      },
    ];

    if (data.type === CustomerTypes.corporate) {
      array.unshift(
        {
          label: "Tên công ty",
          value: data.customerInfo.companyName,
        },
        {
          label: "Loại hình kinh doanh",
          value: data.customerInfo.companyType,
        }
      );
    }

    return array;
  }, [data]);

  return (
    <BasePage loading={isFetching}>
      <Headline label="Thông tin khách hàng" marginT-8 />
      <View
        bg-surface
        paddingH-16
        paddingT-8
        paddingB-16
        style={[gStyles.borderV, gStyles.shadow]}
      >
        {information.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>

      <Headline label="Thông tin bổ sung" />
      <View
        bg-surface
        paddingH-16
        paddingT-8
        paddingB-16
        style={[gStyles.borderV, gStyles.shadow]}
      >
        {additionInformation.map((e) => (
          <TextRow key={e.label} left={e.label} right={e.value} />
        ))}
      </View>

      {data.hasBroker && (
        <>
          <Headline label="Môi giới" />
          <View
            bg-surface
            paddingH-16
            paddingT-8
            paddingB-16
            style={[gStyles.borderV, gStyles.shadow]}
          >
            {brokerInformation.map((e) => (
              <TextRow key={e.label} left={e.label} right={e.value} />
            ))}
          </View>
        </>
      )}
    </BasePage>
  );
};

Information.propTypes = {
  customer: PropTypes.shape({
    code: PropTypes.string,
  }),
};

export default Information;
