import apiClient from "./client";
import type { Comment, NewsArticle, ArticleStatus } from "../types";


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


export async function fetchFlaggedComments(): Promise<
  PaginatedResponse<Comment>
> {
  const response = await apiClient.get<
    PaginatedResponse<Comment>
  >("/comments/", {
    params: {
      flagged: true,
    },
  });

  return response.data;
}


export async function deleteCommentAsStaff(
  id: number
): Promise<void> {

  await apiClient.delete(
    `/comments/${id}/`
  );
}
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}