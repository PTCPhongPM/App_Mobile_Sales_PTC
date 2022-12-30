import { Platform } from "react-native";
import { colors } from "./themes";

const isIOS = Platform.OS === "ios";

export const themeColor = colors.primary900;
export const lightThemeColor = colors.surface;
const disabledColor = colors.textBlackLow;

const calendarTheme = {
  expandableKnobColor: colors.neutral200,
  textSectionTitleColor: colors.textBlackHigh,
  textDayHeaderFontSize: 12,
  textDayHeaderFontFamily: "Roboto-Regular",
  textDayHeaderFontWeight: isIOS ? "400" : "normal",
  dayTextColor: colors.textBlackHigh,
  todayTextColor: colors.primary900,
  textDayFontSize: 14,
  textDayFontFamily: "Roboto-Regular",
  textDayFontWeight: isIOS ? "400" : "normal",
  textDayStyle: {
    marginTop: isIOS ? 8 : 6,
  },
  selectedDayBackgroundColor: themeColor,
  selectedDayTextColor: colors.surface,
  textDisabledColor: disabledColor,
  dotColor: themeColor,
  selectedDotColor: colors.textWhiteHigh,
  disabledDotColor: disabledColor,
  dotStyle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  "stylesheet.calendar.header": {
    dayHeader: {
      color: colors.textBlackHigh,
      fontFamily: "Roboto-Regular",
      fontSize: 12,
      fontWeight: isIOS ? "400" : "normal",
      marginBottom: 9,
      marginTop: 0,
      textAlign: "center",
      width: 36,
    },
    header: {
      paddingLeft: 0,
      paddingRight: 0,
      marginTop: 0,
    },
    week: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 7,
      marginTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  "stylesheet.day.basic": {
    base: {
      width: 32,
      height: 32,
      alignItems: "center",
    },
    selected: {
      backgroundColor: themeColor,
      borderRadius: 18,
    },
  },
  "stylesheet.calendar-list.main": {
    calendar: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    staticHeader: {
      backgroundColor: colors.surface,
      left: 0,
      paddingHorizontal: 0,
      position: "absolute",
      right: 0,
      top: 0,
    },
  },
  stylesheet: {
    expandable: {
      main: {
        week: {
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 7,
          marginTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
};
export default calendarTheme;
