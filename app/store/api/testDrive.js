import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["TestDrive", "Approval"],
});

const testDriveApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestDriveListAll: builder.query({
      query: (params) => ({
        url: "testdrive/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "TestDrive", id })),
              { type: "TestDrive", id: "List" },
            ]
          : [{ type: "TestDrive", id: "List" }],
    }),
    getTestDriveListPending: builder.query({
      query: () => ({
        url: "testdrive/list/pending",
        method: "GET",
      }),
      providesTags: (result) => {
        if (result) {
          return [...result.map(({ id }) => ({ type: "TestDrive", id }))];
        }
      },
    }),
    getTestDrive: builder.query({
      query: (params) => ({
        url: "testdrive",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    createTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "TestDrive", id: "List" }],
    }),
    updateTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    updateTestDriveFile: builder.mutation({
      query: (data) => ({
        url: "testdrive/file",
        method: "POST",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    deleteTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive",
        method: "DELETE",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    sendTestDriveToApprover: builder.mutation({
      query: (data) => ({
        url: "testdrive/apply",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TestDrive", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    completeTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive/complete",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    incompleteTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive/incomplete",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "TestDrive", id }],
    }),
    getTestDriveListCalendar: builder.query({
      query: (params) => ({
        url: "testdrive/list/calendar",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "TestDrive", id })),
              { type: "TestDrive", id: "List" },
            ]
          : [{ type: "TestDrive", id: "List" }],
    }),
    getTestDriveMarkedDate: builder.query({
      query: (params) => ({
        url: "testdrive/markedDate",
        method: "GET",
        params,
      }),
      providesTags: [{ type: "TestDrive", id: "MarkedDate" }],
    }),

    // for director
    approveTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive/approve",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TestDrive", id },
        { type: "TestDrive", id: "MarkedDate" },
        { type: "Approval", id: "Stats" },
      ],
    }),
    rejectTestDrive: builder.mutation({
      query: (data) => ({
        url: "testdrive/reject",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "TestDrive", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateTestDriveMutation,
  useGetTestDriveQuery,
  useGetTestDriveListAllQuery,
  useGetTestDriveListPendingQuery,

  useGetTestDriveListCalendarQuery,
  useGetTestDriveMarkedDateQuery,
  useDeleteTestDriveMutation,

  useSendTestDriveToApproverMutation,
  useCompleteTestDriveMutation,
  useIncompleteTestDriveMutation,
  useUpdateTestDriveFileMutation,
  useUpdateTestDriveMutation,

  // for director
  useApproveTestDriveMutation,
  useRejectTestDriveMutation,
} = testDriveApi;
