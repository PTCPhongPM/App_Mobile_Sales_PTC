import ptcApi from "./index.js";

ptcApi.enhanceEndpoints({
  addTagTypes: ["Contract", "Approval"],
});

const api = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getContracts: builder.query({
      query: (params) => ({
        url: "contract/list/all",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Contract", id })),
              { type: "Contract", id: "List" },
            ]
          : [{ type: "Contract", id: "List" }],
    }),
    getContractsLead: builder.query({
      query: (params) => ({
        url: "contract/list/lead",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Contract", id })),
              { type: "Contract", id: "List" },
            ]
          : [{ type: "Contract", id: "List" }],
    }),
    getContractListPending: builder.query({
      query: () => ({
        url: "contract/list/pending",
        method: "GET",
      }),
      providesTags: (result) => {
        if (result) {
          return [...result.map(({ id }) => ({ type: "Contract", id }))];
        }
      },
    }),
    getContract: builder.query({
      query: (params) => ({
        url: "contract",
        method: "GET",
        params,
      }),
      providesTags: (_, __, { id }) => [{ type: "Contract", id }],
    }),
    updateContract: builder.mutation({
      query: (data) => ({
        url: "contract",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Contract", id }],
    }),
    sendContractToApprover: builder.mutation({
      query: (data) => ({
        url: "contract/apply",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    duplicateContract: builder.mutation({
      query: (data) => ({
        url: "contract/duplicate",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Contract", id: "List" }],
    }),

    getContractGallery: builder.query({
      query: (params) => ({
        url: "contract/gallery",
        method: "GET",
        params,
      }),
      // providesTags: (_, __, { id }) => [
      //   { type: "Contract", id: `Contract gallery ${id}` },
      // ],
    }),
    cancelContract: builder.mutation({
      query: (data) => ({
        url: "contract/cancel",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),

    // ==
    getContractTemplates: builder.query({
      query: () => ({
        url: "contract/template",
        method: "GET",
      }),
    }),

    // for director
    approveContract: builder.mutation({
      query: (data) => ({
        url: "contract/approve",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    rejectContract: builder.mutation({
      query: (data) => ({
        url: "contract/reject",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    confirmCancelContract: builder.mutation({
      query: (data) => ({
        url: "contract/cancel/confirm",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
    unConfirmCancelContract: builder.mutation({
      query: (data) => ({
        url: "contract/cancel/unconfirm",
        method: "PUT",
        data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "Contract", id },
        { type: "Approval", id: "Stats" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetContractGalleryQuery,
  useGetContractListPendingQuery,
  useGetContractQuery,
  useGetContractsQuery,
  useGetContractsLeadQuery,

  useUpdateContractMutation,

  useDuplicateContractMutation,
  useSendContractToApproverMutation,

  useCancelContractMutation,
  useGetContractTemplatesQuery,

  // for director
  useApproveContractMutation,
  useRejectContractMutation,
  useConfirmCancelContractMutation,
  useUnConfirmCancelContractMutation,
} = api;
