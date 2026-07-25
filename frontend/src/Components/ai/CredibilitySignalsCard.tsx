import { GlassCard } from "../ui/GlassCard";
import type { AIAnalysis } from "../../types";

const RISK_STYLES: Record<AIAnalysis["risk_level"], string> = {
  low: "text-secondary",
  medium: "text-warning",
  high: "text-danger",
};

const IMPACT_ICON: Record<string, string> = {
  positive: "▲",
  negative: "▼",
  neutral: "•",
};

export function CredibilitySignalsCard({
  analysis,
}: {
  analysis: AIAnalysis | null;
}) {

  if (!analysis) {
    return (
      <GlassCard>
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
    <GlassCard>

      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-ink">
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


      <p className="text-xs text-slate-500 mt-1 mb-3">
        Rule-based signals to support review — not a verdict. See factors below.
      </p>


      <ul className="space-y-1.5">

        {analysis.factors.map((factor, i) => (

          <li key={i} className="text-sm flex gap-2">

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


            <span className="text-slate-700">
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

          <h3 className="text-sm font-medium text-ink mb-1">
            Suggested verification steps
          </h3>


          <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">

            {analysis.suggested_steps.map((step, i) => (
              <li key={i}>
                {step}
              </li>
            ))}

          </ul>

        </div>

      )}

    </GlassCard>
  );
}