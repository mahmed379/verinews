import { ReportsTable } from "../Components/moderation/ReportsTable";

export function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ink">
        My Dashboard
      </h1>

      <p className="mt-2 text-slate-600">
        Track the reports you have submitted.
      </p>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-ink">
          My Reports
        </h2>

        <ReportsTable showActions={false} />
      </div>
    </div>
  );
}