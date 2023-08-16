import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Account"],
});

const accountApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getAccount: builder.query({
      query: () => ({
        url: "/account/me",
        method: "GET",
      }),
      providesTags: [{ type: "Account" }],
    }),
    getApprover: builder.query({
      query: () => ({
        url: "/account/list/approver",
        method: "GET",
      }),
    }),
    getManagerAccounts: builder.query({
      query: () => ({
        url: "/account/list/managerAccounts",
        //url: "/account/list/supporter",
        method: "GET",
      }),
    }),
    getSupporter: builder.query({
      query: () => ({
        url: "/account/list/managerAccounts",
        method: "GET",
      }),
    }),
    updateAccount: builder.mutation({
      query: (data) => ({
        url: "/account/me",
        method: "PUT",
        data,
      }),
      invalidatesTags: [{ type: "Account" }],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: "/account/me/password",
        method: "PUT",
        data,
      }),
      invalidatesTags: [{ type: "Account" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAccountQuery,
  useGetApproverQuery,
  useGetSupporterQuery,
  useGetManagerAccountsQuery,
  useUpdateAccountMutation,
  useUpdatePasswordMutation,
} = accountApi;
