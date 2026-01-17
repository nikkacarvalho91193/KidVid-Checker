import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type SearchRequest, type AnalyzeRequest } from "@shared/routes";
import { z } from "zod";

// Helper to validate and fetch
async function fetchWithValidation<T>(
  url: string,
  schema: z.ZodType<T>,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  const data = await res.json();
  return schema.parse(data);
}

// === SEARCH ===
export function useSearchVideos() {
  return useMutation({
    mutationFn: async (request: SearchRequest) => {
      const validated = api.youtube.search.input.parse(request);
      return fetchWithValidation(
        api.youtube.search.path,
        api.youtube.search.responses[200],
        {
          method: api.youtube.search.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validated),
        }
      );
    },
  });
}

// === ANALYZE ===
export function useAnalyzeVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: AnalyzeRequest) => {
      const validated = api.youtube.analyze.input.parse(request);
      return fetchWithValidation(
        api.youtube.analyze.path,
        api.youtube.analyze.responses[200],
        {
          method: api.youtube.analyze.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validated),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.history.list.path] });
    },
  });
}

// === HISTORY ===
export function useHistory() {
  return useQuery({
    queryKey: [api.history.list.path],
    queryFn: () =>
      fetchWithValidation(api.history.list.path, api.history.list.responses[200]),
  });
}

export function useHistoryItem(id: number) {
  return useQuery({
    queryKey: [api.history.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.history.get.path, { id });
      return fetchWithValidation(url, api.history.get.responses[200]);
    },
  });
}
