import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Task", "Stats"],
});

const taskApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (params) => ({
        url: "task/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task", id })),
              { type: "Task", id: "List" },
            ]
          : [{ type: "Task", id: "List" }],
    }),
    getTask: builder.query({
      query: (params) => ({
        url: "task",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: "/task",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Task", id: "List" },
        { type: "Stats", id: "Current" },
      ],
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: "/task",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "MarkedDate" },
      ],
    }),
    deleteTask: builder.mutation({
      query: (data) => ({
        url: "/task",
        method: "DELETE",
        data,
      }),
      invalidatesTags: [{ type: "Task", id: "List" }],
    }),
    getMarkedDate: builder.query({
      query: (params) => ({
        url: "/task/markedDate",
        method: "Get",
        params,
      }),
      providesTags: [
        { type: "Task", id: "MarkedDate" },
        { type: "Task", id: "List" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateTaskMutation,
  useGetTaskQuery,
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,

  useGetMarkedDateQuery,
} = taskApi;
