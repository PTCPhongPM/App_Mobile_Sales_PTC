import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Bank"],
// });

const bankApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllBank: builder.query({
      query: (data) => ({
        url: "/bank/list/all",
        method: "GET",
        data,
      }),
    }),
    // getBank: builder.query({
    //   query: ({ id }) => ({
    //     url: "/bank",
    //     method: "GET",
    //     params: { id },
    //   }),
    // }),
  }),

  overrideExisting: false,
});

export const { useListAllBankQuery } = bankApi;

export default bankApi;
