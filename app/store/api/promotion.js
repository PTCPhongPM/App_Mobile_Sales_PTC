import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Promotion"],
// });

const promotionApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllPromotions: builder.query({
      query: () => ({
        url: "/promotion/list/all",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useListAllPromotionsQuery } = promotionApi;

export default promotionApi;
