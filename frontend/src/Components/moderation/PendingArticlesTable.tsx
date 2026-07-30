import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePendingArticles } from "../../hooks/useModeration";
import { ArticleReviewForm } from "./ArticleReviewForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";
import { GlassCard } from "../ui/GlassCard";

export function PendingArticlesTable() {

  const {
    data,
    isLoading,
  } = usePendingArticles();

  const [reviewingId, setReviewingId] =
    useState<number | null>(null);


  if (isLoading) {
    return <LoadingSpinner />;
  }


  if (!data || data.results.length === 0) {
    return (
        <EmptyState
            title="Nothing pending review."
            description="There are no articles waiting for moderation."
        />
    );
  }


  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">

          <thead className="border-b border-white/10 bg-white/5 text-left text-sm uppercase tracking-wide text-slate-300">
            <tr>
              <th className="px-5 py-4">
                Title
              </th>

              <th className="px-5 py-4">
                Category
              </th>

              <th className="px-5 py-4">
                Status
              </th>

              <th className="px-5 py-4">
                Submitted by
              </th>

              <th className="px-5 py-4"></th>
            </tr>
          </thead>

      <tbody>
        {data.results.map((article) => (  
          <React.Fragment key={article.id}>
            <tr
              className="border-b border-white/10 transition-colors hover:bg-white/5 last:border-0"
            >

              <td className="px-5 py-4">

                <Link
                  to={`/articles/${article.id}`}
                  className="font-semibold text-blue-300 transition hover:text-white"
                >
                  {article.title}
                </Link>

              </td>


              <td className="px-5 py-4 text-slate-200">
                {article.category}
              </td>

              <td className="px-5 py-4 text-slate-200 capitalize">
                {article.status}
              </td>

              <td className="px-5 py-4 text-slate-200">
                {article.submitted_by}
              </td>


              <td className="px-5 py-4 text-right">

                <button
                  onClick={() =>
                    setReviewingId(
                      reviewingId === article.id
                        ? null
                        : article.id
                    )
                  }
                  className="
                  rounded-xl
                  border
                  border-blue-400/20
                  bg-blue-500/10
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-blue-300
                  transition-all
                  duration-200
                  hover:bg-blue-500/20
                  "
                >
                  {
                    reviewingId === article.id
                      ? "Cancel"
                      : "Review"
                  }
                </button>

              </td>

            </tr>


            {reviewingId === article.id && (

              <tr key={`${article.id}-review`}>

                <td
                  colSpan={5}
                  className="
                    bg-slate-900/30
                    p-6
                  "
                >

                  <ArticleReviewForm
                    article={article}
                    onDone={() =>
                      setReviewingId(null)
                    }
                  />

                </td>

              </tr>

            )}

          </React.Fragment>
        ))}

      </tbody>

    </table>
    </div>
    </GlassCard>
  );
}