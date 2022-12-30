import ptcApi from "./index.js";

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopSeller: builder.query({
      query: (params) => ({
        url: "summary/sale/top",
        method: "GET",
        params,
      }),
    }),
    getMyRank: builder.query({
      query: (params) => ({
        url: "summary/sale/rank",
        method: "GET",
        params,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetMyRankQuery, useGetTopSellerQuery } = api;
