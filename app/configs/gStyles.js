import { StyleSheet } from "react-native";
import { Constants } from "react-native-ui-lib/src/commons";
import { colors, typography } from "./themes";

const gStyles = StyleSheet.create({
  actionBar: {
    borderColor: colors.neutral200,
    borderWidth: 0.5,
  },
  basePage: {
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  baseline: {
    alignSelf: "baseline",
  },
  border: {
    borderColor: colors.divider,
    borderWidth: 1,
  },
  border0: {
    borderWidth: 0,
  },
  borderB: {
    borderBottomWidth: 0.5,
    borderColor: colors.divider,
  },
  borderHalf: {
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  borderT: {
    borderColor: colors.divider,
    borderTopWidth: 0.5,
  },
  borderV: {
    borderBottomWidth: 0.5,
    borderColor: colors.divider,
    borderTopWidth: 0.5,
  },
  capitalize: {
    textTransform: "capitalize",
  },
  dialog: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: Constants.isIphoneX ? 0 : 20,
  },
  dot: {
    borderColor: colors.divider,
    borderRadius: 999,
    borderWidth: 1,
    height: 16,
    width: 16,
  },
  flex1: {
    flex: 1,
  },
  headerStyle: {
    backgroundColor: colors.primary900,
    elevation: 0,
    shadowColor: colors.transparent,
  },
  lineThrough: {
    textDecorationLine: "line-through",
  },
  minHeight32: {
    minHeight: 32,
  },
  round: {
    borderRadius: "50%",
  },
  search: {
    paddingLeft: 8,
    ...typography.body1,
  },
  searchContainer: {
    backgroundColor: colors.neutral100,
    borderRadius: 10,
    padding: 8,
  },
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  shadowUp: {
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: -1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
  },
  tabBarScroll: {
    borderBottomWidth: 0.5,
    borderColor: colors.divider,
    flexGrow: 0,
    flexShrink: 0,
  },
});

export default gStyles;
