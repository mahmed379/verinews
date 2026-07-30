import { Link } from "react-router-dom";
import type { NewsArticle } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";

interface ArticleCardProps {
  article: NewsArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div
      className="
      rounded-2xl
      border
      border-white/10
      bg-white/5
      h-full
      flex
      flex-col
      p-5
      pb-6
      backdrop-blur-xl
      transition
      duration-300
      hover:-translate-y-1
      hover:bg-white/10
      hover:border-blue-400/30
      "
    >

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <h3 className="text-lg font-semibold leading-snug text-white">

          <Link
            to={`/articles/${article.id}`}
            className="transition hover:text-blue-400"
          >
            {article.title}
          </Link>

        </h3>


        <StatusBadge status={article.status} />

      </div>



      <p className="mt-3 text-xs tracking-wide text-slate-400">
        {article.category} · submitted by {article.submitted_by?.display_name}
      </p>

      <div className="my-3 h-px bg-white/10" />

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300">
        {article.description}
      </p>



      {article.vote_count > 0 && (

        <span
          className="
            mt-4
            inline-flex
            items-center
            rounded-full
            shadow-sm
            border
            border-emerald-400/20
            bg-emerald-400/10
            px-3
            h-8
            text-xs
            font-medium
            text-emerald-200
          "
        >
          {article.average_rating?.toFixed(1)}/5 (
          {article.vote_count} vote
          {article.vote_count !== 1 ? "s" : ""})
        </span>

      )}


    </div>
  );
}