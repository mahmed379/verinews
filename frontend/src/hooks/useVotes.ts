import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { castVote } from "../api/votes";
import { getErrorMessage } from "../api/errors";

export function useCastVote(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating: 1 | 2 | 3 | 4 | 5) =>
      castVote(articleId, rating),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["article", String(articleId)],
      });

      toast.success("Rating submitted.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}