import { Link } from "react-router-dom";
import { useState } from "react";
import {
  useReports,
  useResolveReport,
  useDismissReport,
} from "../../hooks/useReports";
import type { ReportStatus } from "../../types";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";


const STATUS_FILTERS: {
  value: ReportStatus | "";
  label: string;
}[] = [
  {
    value: "open",
    label: "Open",
  },
  {
    value: "resolved",
    label: "Resolved",
  },
  {
    value: "dismissed",
    label: "Dismissed",
  },
  {
    value: "",
    label: "All",
  },
];


export function ReportsTable() {

  const [statusFilter, setStatusFilter] =
    useState<ReportStatus | "">("open");


  const {
    data,
    isLoading,
  } = useReports(
    statusFilter || undefined
  );


  const resolveMutation =
    useResolveReport();

  const dismissMutation =
    useDismissReport();


  return (
    <div>

      <div className="flex gap-2 mb-4">

        {STATUS_FILTERS.map((filter) => (

          <button
            key={filter.value}
            onClick={() =>
              setStatusFilter(filter.value)
            }
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
              statusFilter === filter.value
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {filter.label}
          </button>

        ))}

      </div>


      {isLoading && <LoadingSpinner />}


      {!isLoading &&
        (!data ||
          data.results.length === 0) && (

          <EmptyState
            title="No reports found."
            description="No reports match this filter."
          />

        )}



      {data &&
        data.results.length > 0 && (

        <table className="w-full solid-card">

          <thead className="border-b border-slate-200 text-left text-sm text-slate-500">

            <tr>
              <th className="p-3">
                Article
              </th>

              <th className="p-3">
                Reason
              </th>

              <th className="p-3">
                Reported By
              </th>

              <th className="p-3">
                Status
              </th>

              <th className="p-3"></th>

            </tr>

          </thead>


          <tbody>

            {data.results.map((report) => (

              <tr
                key={report.id}
                className="border-b border-slate-100 last:border-0"
              >

                <td className="p-3">

                  <Link
                    to={`/articles/${report.article}`}
                    className="text-primary hover:underline"
                  >
                    Article #{report.article}
                  </Link>

                </td>


                <td className="p-3 text-slate-600 capitalize">
                  {report.reason}
                </td>


                <td className="p-3 text-slate-600">
                  {report.reported_by}
                </td>


                <td className="p-3 text-slate-600 capitalize">
                  {report.status}
                </td>


                <td className="p-3 text-right space-x-2">

                  {report.status === "open" && (

                    <>
                      <button
                        onClick={() =>
                          resolveMutation.mutate(
                            report.id
                          )
                        }
                        disabled={
                          resolveMutation.isPending
                        }
                        className="text-sm font-medium text-secondary hover:underline"
                      >
                        Resolve
                      </button>


                      <button
                        onClick={() =>
                          dismissMutation.mutate(
                            report.id
                          )
                        }
                        disabled={
                          dismissMutation.isPending
                        }
                        className="text-sm font-medium text-slate-500 hover:underline"
                      >
                        Dismiss
                      </button>
                    </>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}