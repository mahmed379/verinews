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
    <GlassCard
      className="
        p-6
        text-center
        transition-all
        duration-200
        hover:-translate-y-1
      "
    >
      <div className="text-4xl font-bold text-white">
        {value}
      </div>

      <div className="mt-2 text-sm font-medium text-slate-300">
        {label}
      </div>
    </GlassCard>
  );
}