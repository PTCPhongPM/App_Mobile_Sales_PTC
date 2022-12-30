import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
  persistReducer,
  persistStore,
} from "redux-persist";
import { configureStore, isRejectedWithValue } from "@reduxjs/toolkit";

import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ptcApi from "./api";
import rootReducer from "./reducers/index";

const migrations = {
  1: (state) => {
    return { account: state.account };
  },
  2: (state) => {
    return { account: state.account };
  },
  3: (state) => {
    return { account: state.account };
  },
  4: (state) => {
    return { account: state.account };
  },
  5: (state) => {
    return { account: state.account };
  },
  6: (state) => {
    return { account: state.account };
  },
};

// Middleware: Redux Persist Config
const persistConfig = {
  key: "root",
  version: 6,
  storage: AsyncStorage,
  // blacklist: [],
  whitelist: [
    "account",
    "contract",
    "customer",
    "dashboard",
    "delivery",
    "testDrive",
  ],
  migrate: createMigrate(migrations, { debug: false }),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let isApiStateReset = false;
let alertShown = false;
export const errorMiddleware = () => (next) => (action) => {
  if (action.type === "ptcApi/resetApiState") {
    isApiStateReset = true;
  }

  if (action.meta?.arg.endpointName === "login") {
    isApiStateReset = false;
  }

  if (isRejectedWithValue(action) && !isApiStateReset) {
    if (!alertShown) {
      Alert.alert("Có lỗi xảy ra", action.payload.msg, [
        {
          text: "OK",
          style: "destructive",
          onPress: () => {
            alertShown = false;
          },
        },
      ]);
      alertShown = true;
    }
  }

  return next(action);
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([errorMiddleware, ptcApi.middleware]),
});

const persistor = persistStore(store);

export { store, persistor };
