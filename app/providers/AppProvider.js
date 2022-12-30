import React, { createContext, useEffect } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";
import "dayjs/locale/vi";

import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LocaleConfig } from "react-native-calendars";

import { useSelector } from "react-redux";
import { selectLanguage } from "../store/slices/settings";

import i18next from "../../i18n";
import "../configs/assets";
import * as themes from "../configs/themes";
import NotificationProvider from "./NotificationProvider";

export const ErrorContext = createContext({});

dayjs.locale("vi");
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "T1",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ],
  dayNames: ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};

LocaleConfig.defaultLocale = "vi";

const AppProvider = ({ children }) => {
  const language = useSelector(selectLanguage);

  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language.toLowerCase());
    }
  }, [language]);

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={themes.colors.primary900}
        barStyle="light-content"
      />
      <NotificationProvider title="Error">{children}</NotificationProvider>
    </NavigationContainer>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
