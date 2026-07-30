import type { ArticleStatus } from "../../types";

const STATUS_STYLES: Record<ArticleStatus, string> = {
  pending:
    "bg-amber-500/15 text-amber-300 border-amber-400/30",

  verified:
    "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",

  disputed:
    "bg-orange-500/15 text-orange-300 border-orange-400/30",

  false:
    "bg-red-500/15 text-red-300 border-red-400/30",
};

const STATUS_LABELS: Record<ArticleStatus, string> = {
  pending: "Pending Review",
  verified: "Verified",
  disputed: "Disputed",
  false: "Marked False",
};

interface StatusBadgeProps {
  status: ArticleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1.5
        text-sm
        font-semibold
        rounded-full
        border
        backdrop-blur-sm
        shadow-sm
        ${STATUS_STYLES[status]}
      `}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}