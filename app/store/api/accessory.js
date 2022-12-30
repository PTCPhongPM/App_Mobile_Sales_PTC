import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Accessory"],
// });

const accessoryApi = ptcApi.injectEndpoints({
  endpoints(builder) {
    return {
      listAllBrandAccessories: builder.query({
        query: () => ({
          url: "/accessory/brand/list/all",
          method: "GET",
        }),
      }),
      listAllBranchAccessories: builder.query({
        query: () => ({
          url: "/accessory/branch/list/all",
          method: "GET",
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
