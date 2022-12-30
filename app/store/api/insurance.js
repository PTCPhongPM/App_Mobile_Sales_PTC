import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Insurance"],
});

const insuranceApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    // getInsuranceList: builder.query({
    //   query: (params) => {
    //     return {
    //       url: "insurance/list",
    //       method: "GET",
    //       params,
    //     };
    //   },
    //   providesTags: ({ entries: result }) =>
    //     result
    //       ? [
    //           ...result.map(({ id }) => ({ type: "Insurance", id })),
    //           "Insurance",
    //         ]
    //       : ["Insurance"],
    // }),
    getInsurance: builder.query({
      query: (params) => ({
        url: "insurance",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "Insurance", id }],
    }),
    createInsurance: builder.mutation({
      query: (data) => ({
        url: "/insurance",
        method: "POST",
        data,
      }),
      // invalidatesTags: [{ type: "Insurance", id: "List" }],
    }),
    updateInsurance: builder.mutation({
      query: (data) => ({
        url: "/insurance",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Insurance", id }],
    }),
    deleteInsurance: builder.mutation({
      query: (data) => ({
        url: "/insurance",
        method: "DELETE",
        data,
      }),
      // invalidatesTags: [{ type: "Insurance", id: "List" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  // useGetInsuranceListQuery,
  useCreateInsuranceMutation,
  useDeleteInsuranceMutation,
  useGetInsuranceQuery,
  useUpdateInsuranceMutation,
} = insuranceApi;
