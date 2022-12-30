import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Allocation"],
// });

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllocationProducts: builder.query({
      query: (params) => ({
        url: "allocation/list/all",
        method: "GET",
        params,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetAllocationProductsQuery } = api;
