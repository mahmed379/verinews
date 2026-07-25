import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  fetchArticles,
  fetchArticle,
  submitArticle,
  type ArticleFilters,
  type SubmitArticlePayload,
} from "../api/articles";


export function useArticles(filters: ArticleFilters) {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: () => fetchArticles(filters),
  });
}


export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id!),
    enabled: !!id,
  });
}

export function useSubmitArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SubmitArticlePayload) =>
      submitArticle(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });
    },
  });
}