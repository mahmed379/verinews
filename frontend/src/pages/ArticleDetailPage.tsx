import { Link, useParams } from "react-router-dom";

import { useArticle } from "../hooks/useArticles";
import { StatusBadge } from "../Components/ui/StatusBadge";
import { GlassCard } from "../Components/ui/GlassCard";


export default function ArticleDetailPage() {

  const { id } = useParams<{ id: string }>();

  const {
    data: article,
    isLoading,
    isError,
  } = useArticle(id);



  if (isLoading) {
    return (
      <p className="text-slate-500 p-8">
        Loading...
      </p>
    );
  }



  if (isError || !article) {
    return (
      <p className="text-danger p-8">
        Article not found.
      </p>
    );
  }



  return (

    <div className="max-w-2xl mx-auto px-4 py-8">


      <div className="flex justify-between items-start gap-3">

        <h1 className="text-2xl font-bold text-ink">
          {article.title}
        </h1>


        <StatusBadge status={article.status} />

      </div>



      <p className="text-sm text-slate-500 mt-1">

        {article.category} · submitted by{" "}
        {article.submitted_by}

        {" on "}

        {new Date(
          article.created_at
        ).toLocaleDateString()}

      </p>




      <div className="solid-card p-5 mt-4">

        <p className="text-slate-800 whitespace-pre-line">
          {article.description}
        </p>



        <a
          href={article.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-primary font-medium hover:underline"
        >
          View Original Source →
        </a>


      </div>




      <GlassCard className="mt-4">

        <h2 className="font-semibold text-ink mb-1">
          Credibility Score
        </h2>


        {
          article.vote_count > 0 ? (

            <p className="text-2xl font-bold text-secondary">

              {article.average_rating?.toFixed(1)}
              {" / 5 "}


              <span className="text-sm font-normal text-slate-500">

                (
                {
                  Math.round(
                    ((article.average_rating ?? 0) / 5) * 100
                  )
                }%
                )
                {" · "}
                {article.vote_count} votes

              </span>

            </p>

          ) : (

            <p className="text-slate-500">
              No votes yet.
            </p>

          )
        }


      </GlassCard>




      <div className="mt-6">

        <Link
          to="/"
          className="text-primary hover:underline"
        >
          ← Back to feed
        </Link>

      </div>


    </div>

  );
}