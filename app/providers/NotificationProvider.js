import React, { createContext, useCallback, useContext, useState } from "react";
import PropTypes from "prop-types";

import { Incubator } from "react-native-ui-lib";
import { Alert } from "react-native";
import { DefaultErrorMessage } from "../helper/constants";

const { Toast } = Incubator;

export const NotificationContext = createContext({});

const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState("");
  const [preset, setPreset] = useState();
  const [showToast, setShowToast] = useState(false);

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  const showError = useCallback((msg = DefaultErrorMessage) => {
    Alert.alert("Có lỗi xảy ra", msg, [
      {
        text: "OK",
        style: "destructive",
      },
    ]);
  }, []);

  const showMessage = useCallback(
    (msg, _preset) => {
      if (!showToast) {
        setMessage(msg);
        setPreset(_preset);
        setShowToast(true);
      }
    },
    [showToast]
  );

  const value = {
    showError,
    showMessage,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Toast
        visible={showToast}
        position={"top"}
        message={message}
        preset={preset}
        autoDismiss={3000}
        onDismiss={hideToast}
      />
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node,
};

export const useNotification = () => useContext(NotificationContext);
export default NotificationProvider;
