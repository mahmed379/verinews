import { useQuery } from "@tanstack/react-query";

import {
  fetchArticles,
  fetchArticle,
  type ArticleFilters,
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