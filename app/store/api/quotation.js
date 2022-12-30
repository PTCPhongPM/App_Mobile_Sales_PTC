import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Quotation", "Insurance"],
});

const quotationApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuotationListAll: builder.query({
      query: (params) => ({
        url: "quotation/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Quotation", id })),
              { type: "Quotation", id: "List" },
            ]
          : [{ type: "Quotation", id: "List" }],
    }),
    getQuotation: builder.query({
      query: (params) => ({
        url: "quotation",
        method: "GET",
        params,
      }),
      providesTags: (result) => [
        { type: "Quotation", id: result.id },
        ...(result.insurances?.map(({ id }) => ({ type: "Insurance", id })) ||
          []),
      ],
    }),
    createQuotation: builder.mutation({
      query: (data) => ({
        url: "/quotation",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Quotation", id: "List" }],
    }),
    updateQuotation: builder.mutation({
      query: (data) => ({
        url: "/quotation",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Quotation", id }],
    }),
    addInsurance: builder.mutation({
      query: (data) => ({
        url: "/quotation/insurance",
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Quotation", id }],
    }),
    deleteQuotation: builder.mutation({
      query: (data) => ({
        url: "/quotation",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [{ type: "Quotation", id: "List" }],
    }),
    // ===========
    getQuotationTemplates: builder.query({
      query: () => ({
        url: "quotation/template",
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useAddInsuranceMutation,
  useCreateQuotationMutation,
  useDeleteQuotationMutation,
  useGetQuotationListAllQuery,
  useGetQuotationQuery,
  useUpdateQuotationMutation,

  useGetQuotationTemplatesQuery,
} = quotationApi;
