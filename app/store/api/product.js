import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Product"],
// });

const productApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductListAll: builder.query({
      query: (params) => ({
        url: "/product/list/all",
        method: "GET",
        params,
      }),
    }),
    getExteriorColors: builder.query({
      query: (params) => ({
        url: "/product/color/exterior",
        method: "GET",
        params,
      }),
    }),
    getInteriorColors: builder.query({
      query: (params) => ({
        url: "/product/color/interior",
        method: "GET",
        params,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetProductListAllQuery,
  useGetExteriorColorsQuery,
  useGetInteriorColorsQuery,
} = productApi;
