import { Link } from "react-router-dom";
import { StatCard } from "../Components/ui/StatCard";
import { usePendingCount } from "../hooks/useModeration";
import { useOpenReportCount } from "../hooks/useReports";

export function ModeratorDashboardPage() {

  const pendingCount = usePendingCount();
  const openReportCount = useOpenReportCount();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Moderation Panel
        </p>

        <h1 className="text-4xl font-bold text-white">
          Moderator Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Review articles, manage reports, and handle flagged content.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-4
          mb-8
        "
      >

        <StatCard
          label="Pending Review"
          value={pendingCount}
        />

        <StatCard
          label="Open Reports"
          value={openReportCount}
        />

      </div>

      <div className="flex flex-wrap gap-4">

        <Link
          to="/moderation/queue"
          className="
          inline-flex
          items-center
          rounded-xl
          border
          border-white/20
          bg-white/5
          px-4
          py-2
          text-blue-300
          transition
          hover:bg-white/10
          hover:text-white
          "
        >
          Go to Moderation Queue →
        </Link>

        <Link
          to="/moderation/reports"
          className="
          inline-flex
          items-center
          rounded-xl
          border
          border-white/20
          bg-white/5
          px-4
          py-2
          text-blue-300
          transition
          hover:bg-white/10
          hover:text-white
          "
        >
          Go to Report Management →
        </Link>

        <Link
          to="/moderation/comments"
          className="
          inline-flex
          items-center
          rounded-xl
          border
          border-white/20
          bg-white/5
          px-4
          py-2
          text-blue-300
          transition
          hover:bg-white/10
          hover:text-white
          "
        >
          Flagged Comments →
        </Link>

      </div>

    </div>
  );
}