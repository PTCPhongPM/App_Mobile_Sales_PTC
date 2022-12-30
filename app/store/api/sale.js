import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Sale", "Customer", "Task"],
});

const salesApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    createSaleActivity: builder.mutation({
      query: (data) => ({
        url: "/sale/activity",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Sale", id: "Activities" }],
    }),
    getActivities: builder.query({
      query: (params) => ({
        url: "/sale/activity/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Sale",
                id: `Activity-${id}`,
              })),
              { type: "Sale", id: "Activities" },
            ]
          : [{ type: "Sale", id: "Activities" }],
    }),
    getComments: builder.query({
      query: (params) => ({
        url: "sale/comment/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Sale",
                id: `Comment-${id}`,
              })),
              { type: "Sale", id: "Comments" },
            ]
          : [{ type: "Sale", id: "Comments" }],
    }),
    createComment: builder.mutation({
      query: (data) => ({
        url: "/sale/comment",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Sale", id: "Comments" }],
    }),
    setSaleAsFrozen: builder.mutation({
      query: (data) => ({
        url: "/sale/frozen",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { customerCode }) => [
        { type: "Customer", id: customerCode },
      ],
    }),
    setSaleAsLost: builder.mutation({
      query: (data) => ({
        url: "/sale/lost",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { customerCode }) => [
        { type: "Customer", id: customerCode },
      ],
    }),
    // FavoriteProducts
    getFavoriteProducts: builder.query({
      query: (params) => ({
        url: "sale/product/favorite/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Sale",
                id: `FavoriteProduct-${id}`,
              })),
              { type: "Sale", id: "FavoriteProducts" },
            ]
          : [{ type: "Sale", id: "FavoriteProducts" }],
    }),
    getFavoriteProduct: builder.query({
      query: (params) => ({
        url: "sale/product/favorite",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [
        { type: "Sale", id: `FavoriteProduct-${id}` },
      ],
    }),
    createFavoriteProduct: builder.mutation({
      query: (data) => ({
        url: "/sale/product/favorite",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Sale", id: "FavoriteProducts" },
        { type: "Customer", id: "List" },
      ],
    }),
    createFavoriteProductOther: builder.mutation({
      query: (data) => ({
        url: "/sale/product/favorite/other",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Sale", id: "FavoriteProducts" }],
    }),
    updateFavoriteProduct: builder.mutation({
      query: (data) => ({
        url: "/sale/product/favorite",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Sale", id: `FavoriteProduct-${id}` },
        { type: "Customer", id: "List" },
      ],
    }),
    updateFavoriteProductProcess: builder.mutation({
      query: (data) => ({
        url: "/sale/product/process",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Sale", id: `FavoriteProduct-${id}` },
      ],
    }),
    deleteFavoriteProduct: builder.mutation({
      query: (data) => ({
        url: "/sale/product/favorite",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [
        { type: "Sale", id: `FavoriteProducts` },
        { type: "Customer", id: "List" },
      ],
    }),
    getStats: builder.query({
      query: (params) => ({
        url: "sale/stats",
        method: "GET",
        params,
      }),
      providesTags: (result, __, { id }) => [
        { type: "Sale", id },
        { type: "Sale", id: `Activities` },
        { type: "Sale", id: `FavoriteProducts` },
        { type: "Task", id: "List" },
        ...(result?.topModels.map((e) => ({
          type: "Sale",
          id: `FavoriteProduct-${e.id}`,
        })) || []),
        ...(result?.incomingTasks.map(({ id }) => ({ type: "Task", id })) ||
          []),
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  // comment
  useCreateCommentMutation,
  useGetCommentsQuery,
  // sale activity
  useCreateSaleActivityMutation,
  useGetActivitiesQuery,
  useSetSaleAsFrozenMutation,
  useSetSaleAsLostMutation,
  // product
  useCreateFavoriteProductMutation,
  useCreateFavoriteProductOtherMutation,
  useDeleteFavoriteProductMutation,
  useGetFavoriteProductQuery,
  useGetFavoriteProductsQuery,
  useUpdateFavoriteProductMutation,
  useUpdateFavoriteProductProcessMutation,
  // stats
  useGetStatsQuery,
} = salesApi;
