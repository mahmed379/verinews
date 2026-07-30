import { ReportsTable } from "../Components/moderation/ReportsTable";


export function ReportManagementPage() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Moderator Panel
        </p>

        <h1 className="text-4xl font-bold text-white">
          Report Management
        </h1>

        <p className="mt-2 text-slate-400">
          Review and manage reported articles from the community.
        </p>
      </div>


      <ReportsTable />

    </div>
  );
}