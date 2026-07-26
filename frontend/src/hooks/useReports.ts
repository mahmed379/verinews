import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  fetchReports,
  resolveReport,
  dismissReport,
  createReport,
} from "../api/reports";

import {
  fetchFlaggedComments,
  deleteCommentAsStaff,
} from "../api/moderation";

import type { ReportStatus } from "../types";

import { getErrorMessage } from "../api/errors";


export function useReports(status?: ReportStatus) {
  return useQuery({
    queryKey: ["reports", { status }],
    queryFn: () => fetchReports(status),
  });
}


export function useOpenReportCount() {
  const { data } = useReports("open");

  return data?.count ?? 0;
}


function useReportMutation(
  action: (id: number) => Promise<unknown>,
  successMessage: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: action,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(successMessage);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}


export function useResolveReport() {
  return useReportMutation(
    resolveReport,
    "Report resolved."
  );
}


export function useDismissReport() {
  return useReportMutation(
    dismissReport,
    "Report dismissed."
  );
}
export function useFlaggedComments() {
  return useQuery({
    queryKey: ["comments", { flagged: true }],
    queryFn: fetchFlaggedComments,
  });
}


export function useDeleteCommentAsStaff() {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentAsStaff,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });

      toast.success("Comment removed.");
    },

    onError: (err) => {
      toast.error(getErrorMessage(err));
    },
  });
}


export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      article,
      reason,
      details,
    }: {
      article: number;
      reason: string;
      details: string;
    }) =>
      createReport(
        article,
        reason,
        details
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reports"],
      });

      toast.success(
        "Report submitted successfully."
      );
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}