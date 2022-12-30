import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";

import { FlatList, RefreshControl } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import DocumentItem from "../../../components/DocumentItem";

import Headline from "../../../components/Header/Headline";

import { Empty } from "../../../configs/assets";

import gStyles from "../../../configs/gStyles";

import { useGetContractGalleryQuery } from "../../../store/api/contract";

const ContractGallery = ({ contract, loading, refetch }) => {
  const {
    data = [],
    isFetching,
    refetch: refetchContractGallery,
  } = useGetContractGalleryQuery({
    id: contract.id,
  });

  const isLoading = loading || isFetching;

  const list = useMemo(() => data.map((element) => element.file), [data]);

  const renderItem = useCallback(
    ({ item }) => <DocumentItem file={item} />,
    []
  );

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      data={list}
      refreshControl={
        <RefreshControl
          colors={[Colors.primary900]}
          tintColor={Colors.primary900}
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
            refetchContractGallery();
          }}
        />
      }
      renderItem={renderItem}
      ListHeaderComponent={() => {
        if (!data || !data.length) return null;
        return <Headline label="Hình ảnh giao xe" />;
      }}
      ListEmptyComponent={() => (
        <View
          bg-surface
          center
          paddingV-16
          style={[gStyles.border, gStyles.shadow]}
        >
          <Empty />
          <Text primary900 marginT-8>
            Chưa có hình ảnh giao xe
          </Text>
          <Text textBlackMedium marginT-8>
            Bạn cần phải hoàn thành lịch giao xe!
          </Text>
          <Text textBlackMedium marginT-8>
            Có hình ảnh giao xe mới được coi là hoàn tất
          </Text>
        </View>
      )}
    />
  );
};

ContractGallery.propTypes = {
  contract: PropTypes.shape({
    id: PropTypes.number,
  }),
  loading: PropTypes.bool,
  refetch: PropTypes.func,
};

export default ContractGallery;
