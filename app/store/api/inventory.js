import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Inventory"],
// });

const inventoryApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getModel: builder.query({
      query: (params) => ({
        url: "/inventory/model",
        method: "GET",
        params,
      }),
    }),
    getAll: builder.query({
      query: (params) => ({
        url: "/inventory/list/all",
        method: "GET",
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllQuery, useGetModelQuery } = inventoryApi;
