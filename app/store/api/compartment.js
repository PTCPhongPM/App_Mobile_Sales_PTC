import ptcApi from "./index.js";

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompartments: builder.query({
      query: (params) => ({
        url: "/compartment/list/all",
        method: "GET",
        params,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useGetCompartmentsQuery } = api;
