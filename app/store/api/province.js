import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Province"],
// });

const provinceApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: (params) => ({
        url: "/province/list",
        method: "GET",
        params,
      }),
      // providesTags: [{ type: "Province", id: "List" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetProvincesQuery } = provinceApi;
