import apiClient from "./client";
import type { Vote } from "../types";

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