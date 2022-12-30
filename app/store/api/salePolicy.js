import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["SalePolicy"],
// });

const salePolicyApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalePolicyListAll: builder.query({
      query: (params) => ({
        url: "salepolicy/list/all",
        method: "GET",
        params,
      }),
      // providesTags: (result) =>
      //   result
      //     ? [
      //         ...result.map(({ id }) => ({ type: "SalePolicy", id })),
      //         { type: "SalePolicy", id: "List" },
      //       ]
      //     : [{ type: "SalePolicy", id: "List" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetSalePolicyListAllQuery } = salePolicyApi;
