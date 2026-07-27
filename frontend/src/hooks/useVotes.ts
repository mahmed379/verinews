import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  castVote,
  fetchMyVoteForArticle,
} from "../api/votes";

import { getErrorMessage } from "../api/errors";
import useAuth from "./useAuth";


export function useMyVote(articleId: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-vote", articleId],
    queryFn: () => fetchMyVoteForArticle(articleId),
    enabled: !!user,
  });
}


export function useCastVote(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: 1 | 2 | 3 | 4 | 5) =>
      castVote(articleId, rating),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["article", String(articleId)],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-vote", articleId],
      });

      toast.success("Rating submitted.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}