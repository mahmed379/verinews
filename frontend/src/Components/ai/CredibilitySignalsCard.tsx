import { GlassCard } from "../ui/GlassCard";
import type { AIAnalysis } from "../../types";

const RISK_STYLES: Record<AIAnalysis["risk_level"], string> = {
  low: "text-secondary",
  medium: "text-warning",
  high: "text-danger",
};

const IMPACT_ICON: Record<string, string> = {
  positive: "✅",
  negative: "⚠️",
  neutral: "ℹ️",
};
export function CredibilitySignalsCard({
  analysis,
}: {
  analysis: AIAnalysis | null;
}) {

  if (!analysis) {
    return (
      <GlassCard className="p-6">
        <h2 className="font-semibold text-ink mb-1">
          Automated Credibility Signals
        </h2>

        <p className="text-slate-500 text-sm">
          Not yet analyzed.
        </p>
      </GlassCard>
    );
  }


  return (
    <GlassCard className="p-6">

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-white">
          Automated Credibility Signals
        </h2>

        <span className="text-xs text-slate-400">
          {analysis.analyzer_version}
        </span>
      </div>


      <p className={`text-2xl font-bold ${RISK_STYLES[analysis.risk_level]}`}>
        {analysis.score}/100

        <span className="text-sm font-normal ml-2 capitalize">
          {analysis.risk_level} risk
        </span>
      </p>


      <p className="mt-2 mb-4 text-sm text-slate-400">
        Rule-based signals to support review — not a verdict. See factors below.
      </p>


      <ul className="space-y-3">
        {analysis.factors.map((factor, i) => (
          <li
            key={i}
            className="
              flex
              gap-3
              rounded-xl
              border
              border-white/10
              bg-white/5
              p-3
            "
          >
            <span
              className={
                factor.impact === "positive"
                  ? "text-secondary"
                  : factor.impact === "negative"
                  ? "text-danger"
                  : "text-slate-400"
              }
            >
              {IMPACT_ICON[factor.impact]}
            </span>

            <span className="text-slate-200">
              <span className="font-medium">
                {factor.label}:
              </span>{" "}
              {factor.detail}
            </span>
          </li>
        ))}
      </ul>


      {analysis.suggested_steps.length > 0 && (

        <div className="mt-4 pt-3 border-t border-white/40">

          <h3 className="mb-2 text-sm font-semibold text-white">
            Suggested verification steps
          </h3>


          <ul className="mt-3 space-y-2 text-sm text-slate-200">

            {analysis.suggested_steps.map((step, i) => (
              <li
                key={i}
                className="rounded-lg bg-white/5 px-3 py-2"
              >
                {step}
              </li>
            ))}

          </ul>

        </div>

      )}

    </GlassCard>
  );
}