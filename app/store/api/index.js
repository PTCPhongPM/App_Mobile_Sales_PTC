import { createApi } from "@reduxjs/toolkit/dist/query/react";
import axios from "axios";

import apiConfig from "../../configs/api";

const getErrorMsg = (error) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  "Kiểm tra lại kết nối mạng!";

export const apiInst = axios.create({
  baseURL: apiConfig.baseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" },
  withCredentials: true,
});

export const axiosBaseQuery = async (opts) => {
  try {
    // console.log(new Date(), opts);

    const result = await apiInst(opts);

    return { data: result.data };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(err.config.url);
    return {
      error: {
        status: err.response?.status,
        data: err?.response?.data,
        msg: getErrorMsg(err),
      },
    };
  }
};

export const setToken = (token) => {
  if (token) {
    apiInst.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiInst.defaults.headers.common["Authorization"];
  }
};

const ptcApi = createApi({
  reducerPath: "ptcApi",
  baseQuery: axiosBaseQuery,
  refetchOnReconnect: true,
  keepUnusedDataFor: 3,
  tagTypes: [],
  endpoints: () => ({}),
});

export default ptcApi;
