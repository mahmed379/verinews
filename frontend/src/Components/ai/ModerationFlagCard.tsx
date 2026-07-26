import type { ModerationFlag } from "../../types";

interface ModerationFlagCardProps {
  flag: ModerationFlag | null;
}

export function ModerationFlagCard({
  flag,
}: ModerationFlagCardProps) {
  if (!flag?.is_flagged) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
      <h3 className="text-lg font-semibold text-yellow-800">
        ⚠ AI Moderation Warning
      </h3>

      <p className="mt-2 text-sm text-yellow-700">
        Confidence Score: {flag.score}
      </p>

      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-yellow-700">
        {flag.reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-yellow-600">
        AI Version: {flag.flagger_version}
      </p>
    </div>
  );
}