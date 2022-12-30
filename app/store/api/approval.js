import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Approval"],
});

const taskApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getApprovalStats: builder.query({
      query: () => ({
        url: "approval/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Approval", id: "Stats" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetApprovalStatsQuery } = taskApi;
