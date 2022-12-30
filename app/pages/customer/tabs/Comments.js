import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
  Keyboard as RNKeyboard,
  RefreshControl,
  SectionList,
} from "react-native";

import {
  Colors,
  Incubator,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

import { SolidUp } from "../../../configs/assets";
import CommentCard from "../../../components/Card/CommentCard";

import gStyles from "../../../configs/gStyles";

import { checkSaleActive, groupByKey } from "../../../helper/utils";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "../../../store/api/sale";

const Comments = ({ customer }) => {
  const {
    data = [],
    isFetching,
    refetch,
  } = useGetCommentsQuery(
    { saleId: customer.sales[0].id },
    { pollingInterval: 10000 }
  );

  const [createComment, { isLoading, isSuccess }] = useCreateCommentMutation();

  useEffect(() => {
    if (isSuccess) setMessage("");
  }, [isSuccess]);

  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(() => {
    createComment({
      saleId: customer.sales[0].id,
      message,
    });

    RNKeyboard.dismiss();
  }, [createComment, customer.sales, message]);

  const list = useMemo(
    () =>
      groupByKey(
        data.map((e) => ({
          ...e,
          time: dayjs(e.date).format("MM/YYYY"),
        })),
        "time",
        "desc"
      ),
    [data]
  );

  const isSaleActive = useMemo(() => checkSaleActive(customer), [customer]);

  return (
    <View flex>
      <SectionList
        sections={list}
        refreshControl={
          <RefreshControl
            colors={[Colors.primary900]}
            tintColor={Colors.primary900}
            onRefresh={refetch}
            refreshing={false}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CommentCard comment={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <View paddingH-16 paddingT-16 bg-surface>
            <Text subtitle1 primary900>
              Tháng {title}
            </Text>
          </View>
        )}
      />
      {isSaleActive && (
        <Keyboard.KeyboardTrackingView
          usesBottomTabs
          useSafeArea
          bottomViewColor={Colors.violet80}
        >
          <View
            row
            spread
            centerV
            bg-surface
            paddingH-16
            paddingV-8
            style={gStyles.borderT}
          >
            <Incubator.TextField
              containerStyle={gStyles.flex1}
              placeholder="Nhập bình luận"
              value={message}
              multiline
              onChangeText={setMessage}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || isFetching || !message}
            >
              <SolidUp fill={Colors.stateBlueDefault} />
            </TouchableOpacity>
          </View>
        </Keyboard.KeyboardTrackingView>
      )}
    </View>
  );
};

Comments.propTypes = {
  customer: PropTypes.shape({
    sales: PropTypes.array,
  }),
};

export default Comments;
