import { ReportsTable } from "../Components/moderation/ReportsTable";


export function ReportManagementPage() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-ink mb-6">
        Report Management
      </h1>


      <ReportsTable />

    </div>
  );
}