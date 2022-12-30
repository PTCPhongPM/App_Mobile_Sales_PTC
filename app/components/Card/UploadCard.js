import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { SolidCancel, Upload } from "../../configs/assets";
import { colors } from "../../configs/themes";

const styles = StyleSheet.create({
  borderTransparent: {
    borderColor: colors.transparent,
  },
  button: {
    position: "absolute",
    right: -20,
    top: -12,
  },
  container: {
    borderColor: colors.primary900,
    borderRadius: 2,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 100,
    width: 150,
  },
});
const UploadCard = ({ onPress, data, onDelete, viewOnly }) => {
  const imageUrl = data?.uri || data?.url;

  return (
    <View paddingT-8>
      <View
        row
        center
        br10
        style={[styles.container, !!imageUrl && styles.borderTransparent]}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            width="100%"
            height="100%"
            resizeMode="contain"
          />
        ) : (
          <TouchableOpacity onPress={onPress}>
            <View row padding-6>
              <Upload fill={colors.primary900} width={20} height={20} />
              <Text body2 primary900>
                Tải ảnh lên
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {!!imageUrl && !viewOnly && (
        <TouchableOpacity padding-8 style={styles.button} onPress={onDelete}>
          <SolidCancel fill={colors.textBlackHigh} />
        </TouchableOpacity>
      )}
    </View>
  );
};

UploadCard.defaultProps = {
  onDelete: () => {},
  onPress: () => {},
};

UploadCard.propTypes = {
  data: PropTypes.shape({
    uri: PropTypes.string,
    url: PropTypes.string,
  }),
  onDelete: PropTypes.func,
  onPress: PropTypes.func,
  viewOnly: PropTypes.bool,
};

export default UploadCard;
