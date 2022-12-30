import React, { memo, useCallback, useRef, useState } from "react";

import {
  Assets,
  Avatar,
  Carousel,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import Markdown from "react-native-easy-markdown";

import { ImageBackground, StyleSheet } from "react-native";

import dayjs from "dayjs";

import gStyles from "../../configs/gStyles";

import { ArrowBack, ChevronRight } from "../../configs/assets";
import { useGetNotificationGloryQuery } from "../../store/api/notification";
import { colors, typography } from "../../configs/themes";

const styles = StyleSheet.create({
  avatar: {
    borderColor: colors.primary800,
    borderWidth: 3,
  },
});

const markdownStyles = {
  block: {
    marginBottom: 0,
    marginTop: 2,
    textAlign: "center",
  },
  text: typography.body2,
  strong: {
    ...typography.subtitle2,
    color: colors.primary900,
  },
};

const DashboardGlorySection = () => {
  const { data = [] } = useGetNotificationGloryQuery();

  const [currentPage, setCurrentPage] = useState(0);

  const ref = useRef();

  const goToNextPage = useCallback(() => ref.current.goToNextPage(), []);

  const renderControl = useCallback(() => {
    if (data.length <= 1) return null;

    return (
      <View abs row height={"100%"} width={"100%"}>
        <TouchableOpacity
          activeOpacity={0.1}
          link
          padding-16
          flex
          onPress={() => ref.current.goToPage(currentPage - 1, true)}
        >
          <View flex centerV>
            <ArrowBack fill={Colors.primary900} width={24} height={24} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity flex link padding-16 onPress={goToNextPage}>
          <View flex centerV right>
            <ChevronRight fill={Colors.primary900} width={24} height={24} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [currentPage, data.length, goToNextPage]);

  const renderItem = useCallback(
    (item) => (
      <ImageBackground
        key={item.id}
        source={Assets.images.background.glory}
        resizeMode="stretch"
      >
        <View flex center paddingV-16>
          <Avatar
            source={{ uri: item.file?.url }}
            size={80}
            imageStyle={styles.avatar}
            resizeMode="cover"
          />
          <Text textBlackMedium marginT-16>
            {dayjs(item.createdAt).format("DD/MM/YYYY - hh:mm")}
          </Text>

          <Markdown markdownStyles={markdownStyles}>{item.content}</Markdown>
        </View>
      </ImageBackground>
    ),
    []
  );

  return (
    <View centerV style={[gStyles.borderV, gStyles.shadow]}>
      <Carousel
        scrollEnabled={data.length === 1}
        ref={ref}
        autoplay
        loop
        pagingEnabled
        onChangePage={setCurrentPage}
      >
        {data.map(renderItem)}
      </Carousel>
      {renderControl()}
    </View>
  );
};

export default memo(DashboardGlorySection);
