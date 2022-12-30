import React, { memo } from "react";
import PropTypes from "prop-types";
import {
  Colors,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { Close } from "../configs/assets";

const DocumentItem = ({ file, onDelete, ...props }) => (
  <View row centerV paddingV-12 paddingH-16 bg-surface {...props}>
    <Image source={{ uri: file?.uri || file?.url }} width={70} height={70} />
    <View paddingH-16 flex>
      <Text body1 numberOfLines={1}>
        {file.fileName || file.name}
      </Text>
      {(file.fileSize || file.size) && (
        <Text caption1 textBlackMedium marginT-4>
          {file.fileSize || file.size} B
        </Text>
      )}
    </View>
    {onDelete && (
      <TouchableOpacity onPress={onDelete} padding-4 paddingR-0>
        <Close fill={Colors.textBlackMedium} />
      </TouchableOpacity>
    )}
  </View>
);

DocumentItem.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    name: PropTypes.string,
    size: PropTypes.number,
    uri: PropTypes.string,
    url: PropTypes.string,
  }),
  onDelete: PropTypes.func,
};

export default memo(DocumentItem);
