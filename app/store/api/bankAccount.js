import ptcApi from "./index.js";

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankAccountListAll: builder.query({
      query: (data) => ({
        url: "/bankaccount/list/all",
        method: "GET",
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetBankAccountListAllQuery } = api;

export default api;
