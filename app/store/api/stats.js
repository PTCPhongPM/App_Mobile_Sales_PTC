import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Stats"],
});

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentStats: builder.query({
      query: (params) => ({
        url: "stat/current",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Stats", id: "Current" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetCurrentStatsQuery } = api;
