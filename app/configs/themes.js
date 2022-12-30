import { Colors, ThemeManager, Typography } from "react-native-ui-lib";
import { Platform } from "react-native";
const isIOS = Platform.OS === "ios";

export const colors = {
  //
  black: "#000000",
  white: "#ffffff",
  transparent: "#00000000",
  background: "#F6F8FF",
  divider: "#0000001F",
  border: "#D9D9D9",
  surface: "#FFFFFF",
  // primary
  primary50: "#FFE6E4",
  primary100: "#FFC9BB",
  primary200: "#FFA68F",
  primary300: "#FF8062",
  primary400: "#FF6040",
  primary500: "#FF341A",
  primary600: "#FF341A",
  primary700: "#F82C14",
  primary800: "#EA220E",
  primary900: "#B90000",
  // neutral
  neutral50: "#F5F5F5",
  neutral100: "#F1F1F1",
  neutral200: "#DADADA",
  neutral300: "#C5C5C5",
  neutral400: "#9F9F9F",
  neutral500: "#7D7D7D",
  neutral600: "#606060",
  neutral700: "#444545",
  neutral800: "#272828",
  neutral900: "#111111",
  // text white
  textWhitePrimary: "#FFFFFF",
  textWhiteSecondary: "#FFFFFFBD",
  textWhiteTertiary: "#FFFFFF61",
  textWhiteHigh: "#FFFFFF",
  textWhiteMedium: "#FFFFFFBD",
  textWhiteLow: "#FFFFFF61",
  // text black
  textBlackLow: "#C5C5C5",
  textBlackMedium: "#606060",
  textBlackHigh: "#111111",
  // state red
  stateRedLight: "#FFE8EC",
  stateRedDefault: "#FF3B30",
  stateRedDark: "#E00000",
  // state blue
  stateBlueLight: "#ECF3FF",
  stateBlueDefault: "#007AFF",
  stateBlueDark: "#085ED2",
  // state orange
  stateOrangeLight: "#FFF6E8",
  stateOrangeDefault: "#FF9500",
  stateOrangeDark: "#F49200",
  // state green
  stateGreenLight: "#ECFBE6",
  stateGreenDefault: "#34C759",
  stateGreenDark: "#00A542",
};

Colors.loadColors(colors);

const defaultTypo = {
  color: Colors.textBlackHigh,
  fontSize: 14,
  lineHeight: 16,
  fontFamily: "Roboto-Regular",
  fontWeight: isIOS ? "400" : "normal",
};

export const typography = {
  // font
  overline: {
    ...defaultTypo,
    fontSize: 12,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Bold",
    fontWeight: isIOS ? "700" : "normal",
    letterSpacing: 0.25,
  },
  caption1: {
    ...defaultTypo,
    fontSize: 12,
  },
  caption2: {
    ...defaultTypo,
    fontSize: 10,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    letterSpacing: 0.25,
  },
  body1: {
    ...defaultTypo,
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -0.25,
  },
  body2: {
    ...defaultTypo,
    lineHeight: 20,
  },
  subtitle1: {
    ...defaultTypo,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    letterSpacing: 0.15,
  },
  subtitle2: {
    ...defaultTypo,
    lineHeight: 20,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    letterSpacing: 0.1,
  },
  headline: {
    ...defaultTypo,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    letterSpacing: 0.15,
  },
  title: {
    ...defaultTypo,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
  },
  largeTitle: {
    ...defaultTypo,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: 0.25,
  },
  headerTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    color: colors.white,
  },
  headerAction: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Medium",
    fontWeight: isIOS ? "500" : "normal",
    letterSpacing: 0.15,
    color: colors.white,
  },
  tabBarLabel: {
    lineHeight: 16,
    fontFamily: "Roboto-Regular",
    fontWeight: isIOS ? "400" : "normal",
    fontSize: 12,
  },
  tabBarBadge: {
    fontFamily: "Roboto-Regular",
    fontWeight: isIOS ? "400" : "normal",
    fontSize: 10,
  },
  // Montserrat
  rank1: {
    fontFamily: isIOS ? "Montserrat-Regular" : "Montserrat-ExtraBoldItalic",
    fontSize: 48,
    fontStyle: "italic",
    fontWeight: isIOS ? "800" : "normal",
    letterSpacing: 0.25,
    lineHeight: 60,
    textAlign: "center",
  },
  rank2: {
    fontFamily: isIOS ? "Roboto-Regular" : "Roboto-Bold",
    fontSize: 34,
    fontWeight: isIOS ? "700" : "normal",
    letterSpacing: 0.25,
    lineHeight: 40,
    textAlign: "center",
  },
};

Typography.loadTypographies(typography);

ThemeManager.setComponentTheme("Text", {
  body1: true,
});

ThemeManager.setComponentTheme("TabController.TabBar", {
  // centerSelected: true,
  enableShadows: true,
  height: 44,
  indicatorInsets: 8,
  indicatorStyle: {
    height: 3,
    backgroundColor: colors.primary900,
  },
  labelColor: colors.textBlackHigh,
  labelStyle: typography.subtitle2,
  selectedLabelColor: colors.primary900,
});

ThemeManager.setComponentTheme("LoaderScreen", {
  backgroundColor: colors.surface,
  color: colors.primary900,
  overlay: true,
  message: "Đang tải...",
  size: "large",
});

ThemeManager.setComponentTheme("Switch", {
  onColor: colors.stateGreenDefault,
});

ThemeManager.setComponentTheme("Avatar", {
  backgroundColor: colors.primary100,
});
