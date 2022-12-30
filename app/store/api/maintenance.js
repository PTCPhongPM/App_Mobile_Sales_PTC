import ptcApi from "./index.js";

// ptcApi.enhanceEndpoints({
//   addTagTypes: ["Maintenance"],
// });

const maintenanceApi = ptcApi.injectEndpoints({
  endpoints: (builder) => ({
    listAllMaintenances: builder.query({
      query: () => ({
        url: "/maintenance/list/all",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useListAllMaintenancesQuery } = maintenanceApi;

export default maintenanceApi;
