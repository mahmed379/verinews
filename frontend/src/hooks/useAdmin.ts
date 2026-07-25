import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteArticle } from "../api/admin";
import { fetchArticles } from "../api/articles";
import toast from "react-hot-toast";
import { getErrorMessage } from "../api/errors";

export function useUsers(page = 1) {
  return useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => fetchUsers(page),
  });
}

export function useTotalArticleCount() {
  const { data } = useQuery({
    queryKey: ["articles", { sort: "newest" }],
    queryFn: () => fetchArticles({ sort: "newest" }),
  });

  return data?.count ?? 0;
}

export function useTotalUserCount() {
  const { data } = useUsers(1);
  return data?.count ?? 0;
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });

      toast.success("Article deleted.");
    },

    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}