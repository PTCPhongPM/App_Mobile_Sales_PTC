import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";

import { Chip } from "react-native-ui-lib";

import { colors, typography } from "../../configs/themes";
import gStyles from "../../configs/gStyles";

const StateChip = ({ state, ...props }) => {
  const data = useMemo(() => {
    switch (state) {
      case "approved":
      case "done":
      case "incomplete":
        return {
          label: "Đã duyệt",
          color: colors.stateGreenDefault,
          backgroundColor: colors.stateGreenLight,
        };
      case "created":
      case "pending":
        return {
          label: "Chờ duyệt",
          color: colors.stateOrangeDefault,
          backgroundColor: colors.stateOrangeLight,
        };
      case "rejected":
        return {
          label: "Từ chối",
          color: colors.stateRedDefault,
          backgroundColor: colors.stateRedLight,
        };
      case "draft":
        return {
          label: "Bản nháp",
          color: colors.textBlackHigh,
          backgroundColor: colors.neutral100,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: colors.stateRedDefault,
          backgroundColor: colors.stateRedLight,
        };

      default:
        return {
          label: "Bản nháp",
          color: colors.textBlackHigh,
          backgroundColor: colors.neutral100,
        };
    }
  }, [state]);

  if (!state) return null;

  return (
    <Chip
      label={data.label}
      labelStyle={[typography.body2, { color: data.color }]}
      containerStyle={[
        gStyles.border0,
        { backgroundColor: data.backgroundColor },
      ]}
      {...props}
    />
  );
};

StateChip.propTypes = {
  state: PropTypes.oneOf([
    "approved",
    "created",
    "pending",
    "rejected",
    "draft",
    "done",
    "incomplete",
    "cancelled",
  ]),
};

export default memo(StateChip);
