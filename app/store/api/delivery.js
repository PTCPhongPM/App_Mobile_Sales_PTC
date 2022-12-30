import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Delivery", "Approval"],
});

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getDeliverySchedules: builder.query({
      query: (params) => ({
        url: "delivery/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Delivery", id })),
              { type: "Delivery", id: "List" },
            ]
          : [{ type: "Delivery", id: "List" }],
    }),
    getDeliverySchedule: builder.query({
      query: (params) => ({
        url: "delivery",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "Delivery", id }],
    }),
    createDeliverySchedule: builder.mutation({
      query: (data) => ({
        url: "delivery",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Delivery", id: "List" }],
    }),
    updateDeliverySchedule: builder.mutation({
      query: (data) => ({
        url: "delivery",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Delivery", id }],
    }),
    send2Approver: builder.mutation({
      query: (data) => ({
        url: "delivery/apply",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Delivery", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    completeDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/complete",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Delivery", id }],
    }),
    incompleteDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/incomplete",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Delivery", id }],
    }),
    deleteDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [{ type: "Delivery", id: "List" }],
    }),
    addFiles: builder.mutation({
      query: (data) => ({
        url: "delivery/file",
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Delivery", id }],
    }),

    // for director
    getDeliveryListPending: builder.query({
      query: () => ({
        url: "delivery/list/pending",
        method: "GET",
      }),
      providesTags: (result) => {
        if (result) {
          return [...result.map(({ id }) => ({ type: "Delivery", id }))];
        }
      },
    }),
    approveDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/approve",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Delivery", id },
        { type: "Delivery", id: "MarkedDate" },
        { type: "Approval", id: "Stats" },
      ],
    }),
    rejectDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/reject",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Delivery", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    unConfirmDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/unconfirm",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Delivery", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    confirmDelivery: builder.mutation({
      query: (data) => ({
        url: "delivery/confirm",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Delivery", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    getDeliveryMarkedDate: builder.query({
      query: (params) => ({
        url: "delivery/markedDate",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Delivery", id: "MarkedDate" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useAddFilesMutation,
  useCompleteDeliveryMutation,
  useCreateDeliveryScheduleMutation,
  useGetDeliveryScheduleQuery,
  useGetDeliverySchedulesQuery,
  useIncompleteDeliveryMutation,
  useDeleteDeliveryMutation,
  useUpdateDeliveryScheduleMutation,

  useGetDeliveryListPendingQuery,
  useSend2ApproverMutation,
  useApproveDeliveryMutation,
  useRejectDeliveryMutation,
  useUnConfirmDeliveryMutation,
  useConfirmDeliveryMutation,
  useGetDeliveryMarkedDateQuery,
} = api;
