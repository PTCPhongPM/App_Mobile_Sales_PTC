import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["TestProduct"],
// });

const testProductApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestProductListAll: builder.query({
      query: (params) => ({
        url: "testproduct/list/all",
        method: "GET",
        params,
      }),
      // providesTags: (result) =>
      //   result
      //     ? [
      //         ...result.map(({ id }) => ({ type: "TestProduct", id })),
      //         { type: "TestProduct", id: "List" },
      //       ]
      //     : [{ type: "TestProduct", id: "List" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetTestProductListAllQuery } = testProductApi;
