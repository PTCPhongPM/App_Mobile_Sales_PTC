import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["District"],
// });

const districtApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getDistricts: builder.query({
      query: (params) => ({
        url: "/district/list",
        method: "GET",
        params,
      }),
      // providesTags: [{ type: "District", id: "List" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDistrictsQuery } = districtApi;
