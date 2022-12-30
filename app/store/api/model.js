import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Model"],
// });

const modelApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    getModel: builder.query({
      query: ({ id }) => ({
        url: "/model",
        method: "GET",
        params: { id },
      }),
    }),
    getAllModelList: builder.query({
      query: (data) => ({
        url: "/model/list/allWithProduct",
        method: "GET",
        data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetModelQuery, useGetAllModelListQuery } = modelApi;
