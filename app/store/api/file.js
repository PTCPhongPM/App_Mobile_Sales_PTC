import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["File"],
// });

const fileApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: ({ file, scope }) => {
        // eslint-disable-next-line no-undef
        const formData = new FormData();

        formData.append("scope", scope);
        formData.append("file", {
          uri: file.uri,
          name: file.fileName,
          type: file.type,
        });

        return {
          url: "/file",
          method: "POST",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        };
      },
    }),
    removeFile: builder.mutation({
      query: (data) => ({
        url: "/file",
        method: "DELETE",
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const { useUploadFileMutation, useRemoveFileMutation } = fileApi;
