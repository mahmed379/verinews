import { Link } from "react-router-dom";
import { StatCard } from "../Components/ui/StatCard";
import { usePendingCount } from "../hooks/useModeration";
import { useOpenReportCount } from "../hooks/useReports";


export function ModeratorDashboardPage() {

  const pendingCount = usePendingCount();
  const openReportCount = useOpenReportCount();


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-ink mb-6">
        Moderator Dashboard
      </h1>


      <div className="grid grid-cols-2 gap-4 mb-8">

        <StatCard
          label="Pending Review"
          value={pendingCount}
        />

        <StatCard
          label="Open Reports"
          value={openReportCount}
        />

      </div>


      <div className="flex gap-4">

        <Link
          to="/moderation/queue"
          className="text-primary font-medium hover:underline"
        >
          Go to Moderation Queue →
        </Link>


        <Link
          to="/moderation/reports"
          className="text-primary font-medium hover:underline"
        >
          Go to Report Management →
        </Link>

      </div>

    </div>
  );
}