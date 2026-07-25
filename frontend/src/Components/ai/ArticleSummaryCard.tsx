import type { ArticleSummary } from "../../types";

interface ArticleSummaryCardProps {
  summary: ArticleSummary | null;
}

export function ArticleSummaryCard({
  summary,
}: ArticleSummaryCardProps) {
  if (!summary) {
    return null;
  }

  return (
    <div className="solid-card p-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-ink">
          Summary
        </h2>

        <span className="text-xs text-slate-400">
          {summary.summarizer_version}
        </span>
      </div>

      <p className="text-slate-700">
        {summary.summary}
      </p>

      {summary.key_points.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-ink mb-1">
            Key Points
          </h3>

          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {summary.key_points.map((point, index) => (
              <li key={index}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.claims.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <h3 className="text-sm font-medium text-ink mb-1">
            Specific Claims to Verify
          </h3>

          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            {summary.claims.map((claim, index) => (
              <li key={index}>
                {claim}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}