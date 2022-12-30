import PropTypes from "prop-types";
import React, { useCallback } from "react";

import { FlatList } from "react-native";

import DocumentItem from "../../components/DocumentItem";
import Headline from "../../components/Header/Headline";

const DeliveryScheduleGallery = ({ route }) => {
  const files = route.params.files;

  const renderItem = useCallback(
    ({ item }) => <DocumentItem file={item.file} />,
    []
  );

  return (
    <FlatList
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      data={files}
      renderItem={renderItem}
      ListHeaderComponent={() => (
        <Headline marginT-0 label="Hình ảnh giao xe" />
      )}
    />
  );
};

DeliveryScheduleGallery.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      files: PropTypes.array,
    }),
  }),
};

export default DeliveryScheduleGallery;
