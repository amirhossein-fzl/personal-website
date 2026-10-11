export const useApi = createUseFetch({
  baseURL: useRuntimeConfig().public.apiBaseUrl,
});
