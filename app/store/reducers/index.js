import { combineReducers } from "redux";

import ptcApi from "../api/index";

import account from "../slices/account";
import contract from "../slices/contract";
import customer from "../slices/customer";
import dashboard from "../slices/dashboard";
import delivery from "../slices/delivery";
import file from "../slices/file";
import settings from "../slices/settings";
import testDrive from "../slices/testDrive";

// Redux: Root Reducer,
const rootReducer = combineReducers({
  [ptcApi.reducerPath]: ptcApi.reducer,
  account,
  contract,
  customer,
  dashboard,
  delivery,
  file,
  settings,
  testDrive,
});

export default rootReducer;
