import { Link } from "react-router-dom";
import type { NewsArticle } from "../../types";
import { StatusBadge } from "../ui/StatusBadge";

interface ArticleCardProps {
  article: NewsArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="solid-card p-5 mb-4">
      <div className="flex justify-between items-start gap-3">
        <h3 className="text-lg font-semibold text-ink">
          <Link
            to={`/articles/${article.id}`}
            className="hover:text-primary"
          >
            {article.title}
          </Link>
        </h3>

        <StatusBadge status={article.status} />
      </div>

      <p className="text-sm text-slate-500 mt-1">
        {article.category} · submitted by {article.submitted_by}
      </p>

      <p className="text-slate-700 mt-2 line-clamp-3">
        {article.description}
      </p>

      {article.vote_count > 0 && (
        <span className="inline-block mt-2 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
          {article.average_rating?.toFixed(1)}/5 (
          {article.vote_count} vote
          {article.vote_count !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}