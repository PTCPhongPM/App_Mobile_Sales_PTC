import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Notification"],
});

const notificationApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerNotificationList: builder.query({
      query: () => ({
        url: "/notification/list/all",
        method: "GET",
        params: { category: "customer" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification", id })),
              { type: "Notification", id: "customer" },
            ]
          : [{ type: "Notification", id: "customer" }],
    }),
    getTestDriveNotificationList: builder.query({
      query: () => ({
        url: "/notification/list/all",
        method: "GET",
        params: { category: "testdrive" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification", id })),
              { type: "Notification", id: "testdrive" },
            ]
          : [{ type: "Notification", id: "testdrive" }],
    }),
    getContractNotificationList: builder.query({
      query: () => ({
        url: "/notification/list/all",
        method: "GET",
        params: { category: "contract" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification", id })),
              { type: "Notification", id: "contract" },
            ]
          : [{ type: "Notification", id: "contract" }],
    }),
    getTaskNotificationList: builder.query({
      query: () => ({
        url: "/notification/list/all",
        method: "GET",
        params: { category: "task" },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Notification", id })),
              { type: "Notification", id: "task" },
            ]
          : [{ type: "Notification", id: "task" }],
    }),

    markNotificationAsRead: builder.mutation({
      query: (data) => ({
        url: "/notification/read",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Notification", id },
        { type: "Notification", id: "Stats" },
      ],
    }),
    markNotificationAsUnread: builder.mutation({
      query: (data) => ({
        url: "/notification/unread",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Notification", id },
        { type: "Notification", id: "Stats" },
      ],
    }),
    markNotificationAsReadAll: builder.mutation({
      query: (data) => ({
        url: "/notification/read/all",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { category }) => [
        { type: "Notification", id: category },
        { type: "Notification", id: "Stats" },
      ],
    }),

    deleteNotification: builder.mutation({
      query: (data) => ({
        url: "/notification",
        method: "DELETE",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Notification", id },
        { type: "Notification", id: "Stats" },
      ],
    }),
    deleteNotificationAll: builder.mutation({
      query: (data) => ({
        url: "/notification/all",
        method: "DELETE",
        data,
      }),
      invalidatesTags: (_, __, { category }) => [
        { type: "Notification", id: category },
        { type: "Notification", id: "Stats" },
      ],
    }),

    getNotificationStats: builder.query({
      query: () => ({
        url: "/notification/stats",
        method: "GET",
      }),
      providesTags: [{ type: "Notification", id: "Stats" }],
    }),

    getNotificationGlory: builder.query({
      query: () => ({
        url: "/notification/list/glory",
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetContractNotificationListQuery,
  useGetCustomerNotificationListQuery,
  useGetTaskNotificationListQuery,
  useGetTestDriveNotificationListQuery,

  useMarkNotificationAsReadAllMutation,
  useMarkNotificationAsReadMutation,
  useMarkNotificationAsUnreadMutation,

  useDeleteNotificationAllMutation,
  useDeleteNotificationMutation,

  useGetNotificationStatsQuery,
  useGetNotificationGloryQuery,
} = notificationApi;
