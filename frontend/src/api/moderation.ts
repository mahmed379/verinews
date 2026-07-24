import apiClient from "./client";
import type { NewsArticle, ArticleStatus } from "../types";

export interface ReviewPayload {
  new_status: ArticleStatus;
  reason: string;
}

export async function reviewArticle(
  id: number,
  payload: ReviewPayload
): Promise<NewsArticle> {
  const response = await apiClient.post<NewsArticle>(
    `/articles/${id}/review/`,
    payload
  );

  return response.data;
}