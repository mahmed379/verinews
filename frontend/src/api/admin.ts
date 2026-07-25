import apiClient from "./client";
import type { User } from "./auth";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchUsers(page = 1): Promise<PaginatedResponse<User>> {
  const response = await apiClient.get<PaginatedResponse<User>>(
    "/users/",
    {
      params: { page },
    }
  );

  return response.data;
}

export async function deleteArticle(id: number): Promise<void> {
  await apiClient.delete(`/articles/${id}/`);
}