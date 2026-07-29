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
    <div
      className="
        glass-card
        p-5
      "
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">
          Summary
        </h2>

        <span className="text-xs text-slate-200">
          {summary.summarizer_version}
        </span>
      </div>

      <p className="leading-relaxed text-slate-300">
        {summary.summary}
      </p>

      {summary.key_points.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-sm font-semibold text-white">
            Key Points
          </h3>

          <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
            {summary.key_points.map((point, index) => (
              <li key={index}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {summary.claims.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/10">
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