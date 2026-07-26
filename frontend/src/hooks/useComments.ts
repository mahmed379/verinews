import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../api/comments";
import { getErrorMessage } from "../api/errors";

export function useComments(articleId: number) {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getComments(articleId),
  });
}

export function useCreateComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) =>
      createComment(articleId, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", articleId],
      });

      toast.success("Comment added.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: string;
    }) => updateComment(id, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", articleId],
      });

      toast.success("Comment updated.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDeleteComment(articleId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      deleteComment(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", articleId],
      });

      toast.success("Comment deleted.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}