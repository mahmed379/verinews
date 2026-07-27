import apiClient from "./client";
import type { Vote } from "../types";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function castVote(
  articleId: number,
  rating: 1 | 2 | 3 | 4 | 5
): Promise<Vote> {
  const response = await apiClient.post<Vote>("/votes/", {
    article: articleId,
    rating,
  });

  return response.data;
}

export async function fetchMyVoteForArticle(
  articleId: number
): Promise<Vote | null> {
  const response = await apiClient.get<PaginatedResponse<Vote>>(
    "/votes/",
    {
      params: {
        article: articleId,
      },
    }
  );

  return response.data.results[0] ?? null;
}