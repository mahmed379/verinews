import apiClient from "./client";
import type { Comment } from "../types";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function getComments(articleId: number) {
  const response = await apiClient.get("/comments/", {
    params: {
      article: articleId,
    },
  });

  console.log("COMMENTS RESPONSE:", response.data);

  return response.data.results;
}

export async function createComment(
  articleId: number,
  body: string
): Promise<Comment> {
  const response = await apiClient.post<Comment>("/comments/", {
    article: articleId,
    body,
  });

  return response.data;
}

export async function updateComment(
  commentId: number,
  body: string
): Promise<Comment> {
  const response = await apiClient.patch<Comment>(
    `/comments/${commentId}/`,
    { body }
  );

  return response.data;
}

export async function deleteComment(
  commentId: number
): Promise<void> {
  await apiClient.delete(`/comments/${commentId}/`);
}

export async function fetchMyComments(): Promise<PaginatedResponse<Comment>> {
  const response = await apiClient.get<PaginatedResponse<Comment>>(
    "/comments/",
    {
      params: {
        mine: "true",
      },
    }
  );

  return response.data;
}