import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Auth"],
// });

const authApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data,
      }),
      // invalidatesTags: () => [{ type: "Auth", id: "LOGIN" }],
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refreshToken",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/resetPassword",
        method: "POST",
        data,
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,
} = authApi;
