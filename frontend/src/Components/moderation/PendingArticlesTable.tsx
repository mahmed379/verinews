import { useState } from "react";
import { Link } from "react-router-dom";
import { usePendingArticles } from "../../hooks/useModeration";
import { ArticleReviewForm } from "./ArticleReviewForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";


export function PendingArticlesTable() {

  const {
    data,
    isLoading,
  } = usePendingArticles();

  const [reviewingId, setReviewingId] =
    useState<string | null>(null);


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
    <table className="w-full solid-card">

      <thead className="border-b border-slate-200 text-left text-sm text-slate-500">
        <tr>
          <th className="p-3">
            Title
          </th>

          <th className="p-3">
            Category
          </th>

          <th className="p-3">
            Submitted by
          </th>

          <th className="p-3"></th>
        </tr>
      </thead>


      <tbody>

        {data.results.map((article) => (
          <>
            <tr
              key={article.id}
              className="border-b border-slate-100 last:border-0"
            >

              <td className="p-3">

                <Link
                  to={`/articles/${article.id}`}
                  className="text-primary hover:underline"
                >
                  {article.title}
                </Link>

              </td>


              <td className="p-3 text-slate-600">
                {article.category}
              </td>


              <td className="p-3 text-slate-600">
                {article.submitted_by}
              </td>


              <td className="p-3 text-right">

                <button
                  onClick={() =>
                    setReviewingId(
                      reviewingId === article.id
                        ? null
                        : article.id
                    )
                  }
                  className="text-sm font-medium text-primary hover:underline"
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
                  colSpan={4}
                  className="p-3 bg-slate-50"
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

          </>
        ))}

      </tbody>

    </table>
  );
}