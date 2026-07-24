import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchReports,
  resolveReport,
  dismissReport,
} from "../api/reports";
import type { ReportStatus } from "../types";
import toast from "react-hot-toast";
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