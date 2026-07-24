import apiClient from "./client";
import type { NewsArticle } from "../types";

export interface ArticleFilters {
  q?: string;
  status?: string;
  category?: string;
  sort?: string;
  page?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchArticles(
  filters: ArticleFilters
): Promise<PaginatedResponse<NewsArticle>> {
  const response = await apiClient.get<PaginatedResponse<NewsArticle>>(
    "/articles/",
    {
      params: filters,
    }
  );

  return response.data;
}

export async function fetchArticle(
  id: string
): Promise<NewsArticle> {
  const response = await apiClient.get<NewsArticle>(
    `/articles/${id}/`
  );

  return response.data;
}