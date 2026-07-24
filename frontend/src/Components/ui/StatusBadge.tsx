import type { ArticleStatus } from "../../types";

const STATUS_STYLES: Record<ArticleStatus, string> = {
  pending: "bg-warning/10 text-warning border-warning/30",
  verified: "bg-secondary/10 text-secondary border-secondary/30",
  disputed: "bg-warning/10 text-warning border-warning/30",
  false: "bg-danger/10 text-danger border-danger/30",
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
      className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}