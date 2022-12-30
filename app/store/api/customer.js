import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Customer", "Stats"],
});

const customerApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Customer", id: "List" },
        { type: "Stats", id: "Current" },
      ],
    }),
    getLeads: builder.query({
      query: ({ state, scope }) => ({
        url: "/customer/list/lead",
        method: "GET",
        params: { state, scope },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: "Customer", id: code })),
              { type: "Customer", id: "List" },
            ]
          : [{ type: "Customer", id: "List" }],
    }),
    getCustomer: builder.query({
      query: ({ code }) => ({
        url: "/customer",
        method: "GET",
        params: { code },
      }),
      providesTags: (_, __, { code }) => [{ type: "Customer", id: code }],
    }),
    updateCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { code }) => [{ type: "Customer", id: code }],
    }),
    deleteCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [{ type: "Customer", id: "List" }],
    }),

    getCustomerListFrozen: builder.query({
      query: (params) => ({
        url: "/customer/list/frozen",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: "Customer", id: code })),
              { type: "Customer", id: "List frozen" },
            ]
          : [{ type: "Customer", id: "List frozen" }],
    }),
    getCustomerListLost: builder.query({
      query: (params) => ({
        url: "/customer/list/lost",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: "Customer", id: code })),
              { type: "Customer", id: "List lost" },
            ]
          : [{ type: "Customer", id: "List lost" }],
    }),
    getCustomerListFromCompany: builder.query({
      query: (params) => ({
        url: "/customer/list/fromCompany",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: "Customer", id: code })),
              { type: "Customer", id: "List fromCompany" },
            ]
          : [{ type: "Customer", id: "List fromCompany" }],
    }),
    getCustomerListBought: builder.query({
      query: (params) => ({
        url: "/customer/list/bought",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ code }) => ({ type: "Customer", id: code })),
              { type: "Customer", id: "List bought" },
            ]
          : [{ type: "Customer", id: "List bought" }],
    }),
    receiveCustomer: builder.mutation({
      query: (data) => ({
        url: "/customer/receive",
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { code }) => [
        { type: "Customer", id: code },
        { type: "Customer", id: "List" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateCustomerMutation,
  useGetCustomerQuery,
  useGetLeadsQuery,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,

  useGetCustomerListFrozenQuery,
  useGetCustomerListLostQuery,
  useGetCustomerListFromCompanyQuery,
  useGetCustomerListBoughtQuery,

  useReceiveCustomerMutation,
} = customerApi;
