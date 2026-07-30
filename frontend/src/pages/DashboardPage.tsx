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
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          User Panel
        </p>

        <h1 className="text-4xl font-bold text-white">
          My Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          View your submitted articles, comments, and reports.
        </p>
      </div>

      <div className="mt-8 space-y-10">

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">
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

          <div className="space-y-4">
            {myArticles?.results.map((article) => (
              <div
                key={article.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  backdrop-blur-xl
                "
              >
                <Link
                  to={`/articles/${article.id}`}
                  className="
                  font-medium
                  text-blue-300
                  transition
                  hover:text-white
                  hover:underline
                  "
                >
                  {article.title}
                </Link>

                <StatusBadge status={article.status} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">
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
              className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-4
              backdrop-blur-xl
              "
            >
              <Link
                to={`/articles/${comment.article}`}
                className="
                text-sm
                font-medium
                text-blue-300
                transition
                hover:text-white
                hover:underline
                "
              >
                Article #{comment.article}
              </Link>

              <p className="mt-2 text-sm leading-6 text-slate-200">
                {comment.body}
              </p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">
            My Reports
          </h2>

          <ReportsTable showActions={false} />
        </section>

      </div>
    </div>
  );
}