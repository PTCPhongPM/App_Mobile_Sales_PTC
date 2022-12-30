import React, { memo, useCallback } from "react";
import PropTypes from "prop-types";

import dayjs from "dayjs";

import Markdown from "react-native-easy-markdown";
import { StyleSheet, Pressable } from "react-native";
import { Avatar, Colors, Image, Text, View } from "react-native-ui-lib";

import { typography } from "../../configs/themes";
import StateIcon from "../State/StateIcon";
import {
  RequestStateIconColors,
  RequestStateIcons,
} from "../../helper/constants";
import { Ballot, Personal } from "../../configs/assets";

const styles = StyleSheet.create({
  avatar: {
    borderColor: Colors.stateBlueDefault,
    borderWidth: 1,
  },
});

const markdownStyles = {
  block: {
    marginBottom: 0,
  },
  text: typography.body2,
  strong: typography.subtitle2,
};

const NotificationCard = ({ notification, onPress }) => {
  const renderImage = useCallback(() => {
    switch (notification.category) {
      case "customer":
        return notification.file ? (
          <Avatar
            source={{ uri: notification.file.url }}
            size={40}
            imageStyle={styles.avatar}
          />
        ) : (
          <Personal width={40} height={40} fill={Colors.textBlackHigh} />
        );
      case "testdrive":
        return (
          <Image
            source={{ uri: notification.file?.url }}
            width={40}
            height={24}
            resizeMode="stretch"
          />
        );
      case "contract":
        return (
          <StateIcon
            icon={RequestStateIcons[notification.data.state]}
            color={RequestStateIconColors[notification.data.state]}
          />
        );
      case "task":
        return <StateIcon icon={Ballot} color="neutral" />;

      default:
        return null;
    }
  }, [notification.category, notification.data.state, notification.file]);

  return (
    <Pressable onPress={onPress}>
      <View
        centerV
        paddingH-16
        paddingV-12
        row
        bg-surface
        bg-stateBlueLight={!notification.isRead}
      >
        {renderImage()}

        <View marginL-12 flex>
          <Markdown markdownStyles={markdownStyles}>
            {notification.content}
          </Markdown>
          <Text caption1 textBlackMedium marginT-2>
            {dayjs(notification.createdAt).format("DD/MM/YYYY - HH:mm")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

NotificationCard.defaultProps = {
  unRead: false,
};

NotificationCard.propTypes = {
  notification: PropTypes.object,
  onPress: PropTypes.func,
  unRead: PropTypes.bool,
};

export default memo(NotificationCard);
