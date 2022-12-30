import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Sentry from "@sentry/react-native";

import { LogBox } from "react-native";

import { persistor, store } from "./app/store";
import RootStack from "./app/navigators/RootStack";
import AppProvider from "./app/providers/AppProvider";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs([
  "ViewPropTypes",
  'RNUILib\'s TabController "selectedIndex"',
  "Non-serializable values were found in the navigation state",
  "Warning: Function components cannot be given refs.",
]);

Sentry.init({
  // dsn: "https://793e79fd36de4eb38d63eb09ea407d1e@o292563.ingest.sentry.io/6552148", // Ansuz
  // eslint-disable-next-line no-undef
  dsn: __DEV__
    ? null
    : "https://ccbae7e93a884770936a2f989bae6e65@o1307614.ingest.sentry.io/6552154", // Phat Tien
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppProvider>
        <RootStack />
      </AppProvider>
    </PersistGate>
  </Provider>
);

export default Sentry.wrap(App);
