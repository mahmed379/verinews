import apiClient from "./client";
import type { Report, ReportStatus } from "../types";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchReports(
  status?: ReportStatus
): Promise<PaginatedResponse<Report>> {
  const response = await apiClient.get<PaginatedResponse<Report>>(
    "/reports/",
    {
      params: status ? { status } : {},
    }
  );

  return response.data;
}


export async function resolveReport(id: number): Promise<Report> {
  const response = await apiClient.post<Report>(
    `/reports/${id}/resolve/`
  );

  return response.data;
}


export async function dismissReport(id: number): Promise<Report> {
  const response = await apiClient.post<Report>(
    `/reports/${id}/dismiss/`
  );

  return response.data;
}