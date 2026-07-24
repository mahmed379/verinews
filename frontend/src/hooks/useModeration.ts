import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchArticles } from "../api/articles";
import { reviewArticle, type ReviewPayload } from "../api/moderation";
import toast from "react-hot-toast";
import { getErrorMessage } from "../api/errors";

export function usePendingArticles() {
  return useQuery({
    queryKey: ["articles", { status: "pending", sort: "oldest" }],
    queryFn: () =>
      fetchArticles({
        status: "pending",
        sort: "oldest",
      }),
  });
}


export function usePendingCount() {
  const { data } = usePendingArticles();

  return data?.count ?? 0;
}


export function useReviewArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewPayload;
    }) => reviewArticle(Number(id), payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["articles"],
      });

      queryClient.invalidateQueries({
        queryKey: ["article"],
      });

      toast.success("Article status updated.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}