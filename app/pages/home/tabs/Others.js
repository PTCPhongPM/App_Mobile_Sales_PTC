import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  Avatar,
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import BasePage from "../../../components/Base/BasePage";
import Headline from "../../../components/Header/Headline";

import {
  AddComment,
  Apartment,
  AssignmentTurnedIn,
  Ballot,
  ChevronRightSmall,
  DeliveryComplete,
  Description,
  DirectionsCar,
  Group,
  Info,
  Inventory,
  LocalShipping,
  PersonBought,
  PersonCold,
  PersonPin,
  PersonRemove,
  TestDrive,
} from "../../../configs/assets";

import { saveAccessToken } from "../../../helper/auth";
import { useDirectorRole, useStatusBar } from "../../../helper/hooks";
import { getAccount, setAccount } from "../../../store/slices/account";

import OthersItem from "../../../components/OthersItem";
import gStyles from "../../../configs/gStyles";
import ptcApi from "../../../store/api";

const Others = ({ navigation }) => {
  useStatusBar("light-content");
  const isDirector = useDirectorRole();

  const account = useSelector(getAccount);

  const dispatch = useDispatch();

  const handleLogout = useCallback(() => {
    saveAccessToken();
    dispatch(ptcApi.util.resetApiState());

    navigation.replace("AuthStack", { screen: "Login" });
  }, [dispatch, navigation]);

  const tools = useMemo(() => {
    const arr = [
      {
        icon: Ballot,
        text: "Công việc",
        onPress: () => navigation.navigate("TaskManagement"),
      },
    ];

    if (isDirector) {
      arr.push({
        icon: AssignmentTurnedIn,
        text: "Phê duyệt",
        onPress: () => navigation.navigate("Approval"),
      });
    }

    return arr.concat([
      {
        icon: Group,
        text: "Khách hàng tiềm năng",
        onPress: () => navigation.navigate("Customers"),
      },
      {
        icon: PersonCold,
        text: "Khách hàng đóng băng",
        onPress: () => navigation.navigate("FrozenCustomers"),
      },
      {
        icon: PersonRemove,
        text: "Khách hàng mất",
        onPress: () => navigation.navigate("LostCustomers"),
      },
      {
        icon: PersonBought,
        text: "Khách hàng đã mua",
        onPress: () => navigation.navigate("BoughtCustomers"),
      },
      {
        icon: PersonPin,
        text: "Khách hàng từ công ty",
        onPress: () => navigation.navigate("FromCompanyCustomers"),
      },
      {
        icon: Description,
        text: "Hợp đồng",
        onPress: () => navigation.navigate("Contracts",{account:account} ),
      },
      {
        icon: DirectionsCar,
        text: "Sản phẩm",
        onPress: () => navigation.navigate("ModelList"),
      },
      {
        icon: Inventory,
        text: "Tồn kho",
        onPress: () => navigation.navigate("Inventory"),
      },
      {
        icon: TestDrive,
        text: "Lái thử",
        onPress: () => navigation.navigate("TestDriveManagement",{account:account} ),
      },
      {
        icon: LocalShipping,
        text: "Lịch giao xe",
        onPress: () => navigation.navigate("DeliverySchedule",{account:account}),
      },
      {
        icon: DeliveryComplete,
        text: "Danh sách phân xe",
        onPress: () => navigation.navigate("AllocationProduct", {}),
      },
    ]);
  }, [isDirector, navigation]);

  const supports = useMemo(
    () => [
      {
        icon: Apartment,
        text: "Về phát triển",
        onPress: () => {},
      },
      {
        icon: Info,
        text: "Giới thiệu ứng dụng",
        onPress: () => {},
      },
      {
        icon: AddComment,
        text: "Đóng góp ý kiến",
        onPress: () => {},
      },
    ],
    []
  );

  const toProfilePage = useCallback(
    () =>
      navigation.navigate("Profile", {
        onAccountChanged: (account) => dispatch(setAccount({ account })),
      }),
    [dispatch, navigation]
  );

  return (
    <BasePage>
      <Headline label="Tài khoản" marginT-8 />
      <TouchableOpacity onPress={toProfilePage}>
        <View
          row
          paddingH-16
          paddingV-8
          bg-surface
          style={[gStyles.borderV, gStyles.shadow]}
        >
          <Avatar
            name={account.name}
            source={{ uri: account.avatar?.url }}
            size={40}
            resizeMode="cover"
          />
          <View marginL-12 flex>
            <Text style={gStyles.capitalize}>{account.name}</Text>
            <Text body2 textBlackMedium marginT-2>
              {account.branch.name}
            </Text>
          </View>
          <View center>
            <ChevronRightSmall fill={Colors.textBlackHigh} />
          </View>
        </View>
      </TouchableOpacity>

      <Headline label="Công cụ" />
      <View style={[gStyles.borderV, gStyles.shadow]}>
        {tools.map((t) => (
          <OthersItem
            key={t.text}
            icon={t.icon}
            text={t.text}
            onPress={t.onPress}
          />
        ))}
      </View>

      <Headline label="Hỗ trợ" />
      <View style={[gStyles.borderV, gStyles.shadow]}>
        {supports.map((s) => (
          <OthersItem
            key={s.text}
            icon={s.icon}
            text={s.text}
            onPress={s.onPress}
          />
        ))}
      </View>

      <Button link marginV-20 onPress={handleLogout}>
        <Text button primary900>
          Đăng xuất
        </Text>
      </Button>
      <View center marginB-24>
        <Text caption1 textBlackMedium>
          Phiên bản 3.2980 (2022)
        </Text>
        <Text caption1 textBlackMedium>
          Phát triển bởi PTC
        </Text>
      </View>
    </BasePage>
  );
};

Others.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    replace: PropTypes.func,
  }),
};

export default Others;
