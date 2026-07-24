import axios from "axios";

interface ApiErrorResponse {
  detail?: string;
  fields?: Record<string, string[]>;
}

export function getErrorMessage(
  err: unknown
): string {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    const data = err.response?.data;

    if (data?.fields) {
      const firstField = Object.values(
        data.fields
      )[0];

      return Array.isArray(firstField)
        ? firstField[0]
        : data.detail ?? "Something went wrong.";
    }

    return (
      data?.detail ??
      "Something went wrong."
    );
  }

  return "Something went wrong.";
}