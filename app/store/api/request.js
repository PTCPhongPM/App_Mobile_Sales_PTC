import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: [
    "Request",
    "Approval",
    "RequestBrandAccessory",
    "RequestBranchAccessory",
    "RoutineMaintenance",
    "ExtendedMaintenance",
    "RequestPromotion",
    "RequestBroker",
  ],
});

const requestApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    // request
    getRequestListAll: builder.query({
      query: (params) => ({
        url: "request/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Request", id })),
              { type: "Request", id: "List" },
            ]
          : [{ type: "Request", id: "List" }],
    }),
    getRequest: builder.query({
      query: (params) => ({
        url: "request",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "Request", id }],
    }),
    createRequest: builder.mutation({
      query: (data) => ({
        url: "request",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Request", id: "List" }],
    }),
    updateRequest: builder.mutation({
      query: (data) => ({
        url: "request",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Request", id }],
    }),
    sendRequestToApprover: builder.mutation({
      query: (data) => ({
        url: "request/apply",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Request", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    approveRequest: builder.mutation({
      query: (data) => ({
        url: "request/approve",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Request", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    rejectRequest: builder.mutation({
      query: (data) => ({
        url: "request/reject",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Request", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    deleteRequest: builder.mutation({
      query: (data) => ({
        url: "request",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [{ type: "Request", id: "List" }],
    }),
    duplicateRequest: builder.mutation({
      query: (data) => ({
        url: "request/duplicate",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Request", id: "List" }],
    }),
    getRequestListPending: builder.query({
      query: () => ({
        url: "request/list/pending",
        method: "GET",
      }),
      providesTags: (result) => {
        if (result) {
          return [...result.map(({ id }) => ({ type: "Request", id }))];
        }
      },
    }),
    // accessory branch
    getAccessoryBranch: builder.query({
      query: (params) => ({
        url: "request/accessory/branch",
        method: "GET",
        params,
      }),
      providesTags: ({ id }) => [{ type: "RequestBranchAccessory", id }],
    }),
    createAccessoryBranch: builder.mutation({
      query: (data) => ({
        url: "request/accessory/branch",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updateAccessoryBranch: builder.mutation({
      query: (data) => ({
        url: "request/accessory/branch",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "RequestBranchAccessory", id },
        { type: "Request", id: requestId },
      ],
    }),
    deleteAccessoryBranch: builder.mutation({
      query: (data) => ({
        url: "request/accessory/branch",
        method: "DELETE",
        data,
      }),
    }),
    // accessory brand
    getAccessoryBrand: builder.query({
      query: (params) => ({
        url: "request/accessory/brand",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "RequestBrandAccessory", id }],
    }),
    createAccessoryBrand: builder.mutation({
      query: (data) => ({
        url: "request/accessory/brand",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updateAccessoryBrand: builder.mutation({
      query: (data) => ({
        url: "request/accessory/brand",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "RequestBrandAccessory", id },
        { type: "Request", id: requestId },
      ],
    }),
    deleteAccessoryBrand: builder.mutation({
      query: (data) => ({
        url: "request/accessory/brand",
        method: "DELETE",
        data,
      }),
    }),
    // routine maintenance
    getMaintenanceRoutine: builder.query({
      query: (params) => ({
        url: "request/maintenance/routine",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "RoutineMaintenance", id }],
    }),
    createMaintenanceRoutine: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/routine",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updateMaintenanceRoutine: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/routine",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "RoutineMaintenance", id },
        { type: "Request", id: requestId },
      ],
    }),
    deleteMaintenanceRoutine: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/routine",
        method: "DELETE",
        data,
      }),
    }),
    // extended maintenance
    getMaintenanceExtended: builder.query({
      query: (params) => ({
        url: "request/maintenance/extended",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "ExtendedMaintenance", id }],
    }),
    createMaintenanceExtended: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/extended",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updateMaintenanceExtended: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/extended",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "ExtendedMaintenance", id },
        { type: "Request", id: requestId },
      ],
    }),
    deleteMaintenanceExtended: builder.mutation({
      query: (data) => ({
        url: "request/maintenance/extended",
        method: "DELETE",
        data,
      }),
    }),
    // promotion
    getPromotion: builder.query({
      query: (params) => ({
        url: "request/promotion",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "RequestPromotion", id }],
    }),
    createPromotion: builder.mutation({
      query: (data) => ({
        url: "request/promotion",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updatePromotion: builder.mutation({
      query: (data) => ({
        url: "request/promotion",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "RequestPromotion", id },
        { type: "Request", id: requestId },
      ],
    }),
    deletePromotion: builder.mutation({
      query: (data) => ({
        url: "request/promotion",
        method: "DELETE",
        data,
      }),
    }),
    // broker
    getRequestBroker: builder.query({
      query: (params) => ({
        url: "request/broker",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "RequestBroker", id }],
    }),
    createRequestBroker: builder.mutation({
      query: (data) => ({
        url: "request/broker",
        method: "POST",
        data,
      }),
      invalidatesTags: ({ requestId }) => [{ type: "Request", id: requestId }],
    }),
    updateRequestBroker: builder.mutation({
      query: (data) => ({
        url: "request/broker",
        method: "PUT",
        data,
      }),
      invalidatesTags: ({ id, requestId }) => [
        { type: "RequestBroker", id },
        { type: "Request", id: requestId },
      ],
    }),
    deleteRequestBroker: builder.mutation({
      query: (data) => ({
        url: "request/broker",
        method: "DELETE",
        data,
      }),
    }),
    getRequestTemplates: builder.query({
      query: () => ({
        url: "request/template",
        method: "GET",
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  // request
  useApproveRequestMutation,
  useCreateRequestMutation,
  useDeleteRequestMutation,
  useGetRequestListAllQuery,
  useGetRequestListPendingQuery,
  useGetRequestQuery,
  useRejectRequestMutation,
  useSendRequestToApproverMutation,
  useUpdateRequestMutation,
  useDuplicateRequestMutation,
  // accessory branch
  useGetAccessoryBranchQuery,
  useCreateAccessoryBranchMutation,
  useUpdateAccessoryBranchMutation,
  useDeleteAccessoryBranchMutation,
  // accessory brand
  useGetAccessoryBrandQuery,
  useCreateAccessoryBrandMutation,
  useUpdateAccessoryBrandMutation,
  useDeleteAccessoryBrandMutation,
  // maintenance routine
  useGetMaintenanceRoutineQuery,
  useCreateMaintenanceRoutineMutation,
  useUpdateMaintenanceRoutineMutation,
  useDeleteMaintenanceRoutineMutation,
  // maintenance extended
  useGetMaintenanceExtendedQuery,
  useCreateMaintenanceExtendedMutation,
  useUpdateMaintenanceExtendedMutation,
  useDeleteMaintenanceExtendedMutation,
  // promotion
  useGetPromotionQuery,
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  // broker
  useGetRequestBrokerQuery,
  useCreateRequestBrokerMutation,
  useUpdateRequestBrokerMutation,
  useDeleteRequestBrokerMutation,

  useGetRequestTemplatesQuery,
} = requestApi;

export default requestApi;
