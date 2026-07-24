import { GlassCard } from "./GlassCard";

interface StatCardProps {
  label: string;
  value: number | string;
}

export function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <GlassCard className="text-center">
      <div className="text-3xl font-bold text-primary">
        {value}
      </div>

      <div className="text-sm text-slate-600 mt-1">
        {label}
      </div>
    </GlassCard>
  );
}