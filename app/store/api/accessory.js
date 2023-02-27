import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Accessory"],
// });

const accessoryApi = ptcApi.injectEndpoints({
  endpoints(builder) {
    return {
      listAllBrandAccessories: builder.query({
        query: (params) => ({
          url: "/accessory/brand/list/all",
          method: "GET",
          params,
        }),
      }),
      listAllBranchAccessories: builder.query({
        query: (params) => ({
          url: "/accessory/branch/list/all",
          method: "GET",
          params
        }),
      }),
      listAllAccessoryPacks: builder.query({
        query: () => ({
          url: "/accessorypack/list/all",
          method: "GET",
        }),
      }),
    };
  },
  overrideExisting: false,
});

export const {
  useListAllBrandAccessoriesQuery,
  useListAllBranchAccessoriesQuery,
  useListAllAccessoryPacksQuery,
} = accessoryApi;

export default accessoryApi;
