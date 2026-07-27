import { ReportsTable } from "../Components/moderation/ReportsTable";

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { fetchArticles } from "../api/articles";
import { fetchMyComments } from "../api/comments";

import  LoadingSpinner  from "../Components/ui/LoadingSpinner";
import  EmptyState  from "../Components/ui/EmptyState";
import { StatusBadge } from "../Components/ui/StatusBadge";

export function DashboardPage() {
  const{
    data: myArticles,
    isLoading: articlesLoading,
    } = useQuery({
    queryKey: ["articles", { mine: true }],
    queryFn: () =>
      fetchArticles({
        mine: true,
        sort: "newest",
      }),
    });

    const {
    data: myComments,
    isLoading: commentsLoading,
    } = useQuery({
    queryKey: ["comments", { mine: true }],
    queryFn: fetchMyComments,
    });


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ink">
        My Dashboard
      </h1>

      <div className="mt-8 space-y-10">

        <section>
          <h2 className="mb-4 text-xl font-semibold text-ink">
            My Submissions
          </h2>

          {articlesLoading && <LoadingSpinner />}

          {!articlesLoading &&
            myArticles?.results.length === 0 && (
              <EmptyState
                title="No submissions yet"
                description="You haven't submitted any articles yet."
              />
            )}

          {myArticles?.results.map((article) => (
            <div
              key={article.id}
              className="flex items-center justify-between border-b border-slate-200 py-3"
            >
              <Link
                to={`/articles/${article.id}`}
                className="text-primary hover:underline"
              >
                {article.title}
              </Link>

              <StatusBadge status={article.status} />
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-ink">
            My Comments
          </h2>

          {commentsLoading && <LoadingSpinner />}

          {!commentsLoading &&
            myComments?.results.length === 0 && (
              <EmptyState
                title="No comments yet"
                description="You haven't commented yet."
              />
            )}

          {myComments?.results.map((comment) => (
            <div
              key={comment.id}
              className="border-b border-slate-200 py-3"
            >
              <Link
                to={`/articles/${comment.article}`}
                className="text-primary hover:underline text-sm"
              >
                Article #{comment.article}
              </Link>

              <p className="text-sm text-slate-700">
                {comment.body}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-ink">
            My Reports
          </h2>

          <ReportsTable showActions={false} />
        </section>

      </div>
    </div>
  );
}