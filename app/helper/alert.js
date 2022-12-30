import { Alert } from "react-native";

export const showDeleteAlert = (title, message, callback) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xoá",
        onPress: callback,
        style: "destructive",
      },
    ],
    { cancelable: true }
  );
};
