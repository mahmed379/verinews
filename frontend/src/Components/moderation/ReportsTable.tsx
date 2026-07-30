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
    value: "",
    label: "All",
  },
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
  
];


interface ReportsTableProps {
  showActions?: boolean;
}

export function ReportsTable({
  showActions = true,
}: ReportsTableProps) {

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
            className={`
              px-4
              py-2
              rounded-xl
              text-sm
              font-medium
              transition
              ${
                statusFilter === filter.value
                  ? "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                  : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
              }
            `}
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

        <table
          className="
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
          "
        >

          <thead className="border-b border-white/10 text-left text-sm text-slate-400">
            <tr>
              <th className="p-3">
                Article
              </th>

              <th className="p-3">
                Reason
              </th>

              {showActions && (
                <th className="p-3">
                  Reported By
                </th>
              )}

              <th className="p-3">
                Status
              </th>

              <th className="p-3">
                Flag
              </th>

              {showActions && (
                <th className="p-3"></th>
              )}
            </tr>
          </thead>


          <tbody>

            {data.results.map((report) => (

              <tr
                key={report.id}
                className="border-b border-white/10 last:border-0"
              >

                <td className="p-3">

                  <Link
                    to={`/articles/${report.article}`}
                    className="
                      font-medium
                      text-blue-300
                      transition
                      hover:text-white
                      hover:underline
                    "
                  >
                    {report.article_title}
                  </Link>

                </td>


                <td className="p-3 text-slate-300 capitalize">
                  {report.reason}
                </td>


                {showActions && (
                  <td className="p-3 text-slate-300">
                    {report.reported_by}
                  </td>
                )}


                <td className="p-3 text-slate-300 capitalize">
                  {report.status}
                </td>

                <td className="p-3">
                  {report.moderation_flag?.is_flagged ? (
                    <div className="space-y-2">
                      <span className="
                        inline-block
                        rounded-full
                        border
                        border-yellow-400/30
                        bg-yellow-500/10
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        text-yellow-300
                      ">
                        ⚠ AI Flagged
                      </span>

                      <ul className="ml-4 list-disc text-xs text-yellow-700">
                        {report.moderation_flag.reasons.map((reason, index) => (
                          <li key={index}>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      —
                    </span>
                  )}
                </td>


                {showActions && (
                  <td className="p-3 text-right space-x-2">

                    {report.status === "open" && (
                      <>
                        <button
                          onClick={() =>
                            resolveMutation.mutate(report.id)
                          }
                          disabled={resolveMutation.isPending}
                          className="
                          rounded-xl
                          border
                          border-emerald-400/20
                          bg-emerald-500/10
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          text-emerald-300
                          hover:bg-emerald-500/20
                          "
                        >
                          Resolve
                        </button>

                        <button
                          onClick={() =>
                            dismissMutation.mutate(report.id)
                          }
                          disabled={dismissMutation.isPending}
                          className="
                          rounded-xl
                          border
                          border-white/10
                          bg-white/5
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          text-slate-300
                          hover:bg-white/10
                          "
                        >
                          Dismiss
                        </button>
                      </>
                    )}

                  </td>
                )}

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}