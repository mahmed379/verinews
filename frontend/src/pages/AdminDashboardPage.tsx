import { Link } from "react-router-dom";
import { StatCard } from "../Components/ui/StatCard";
import {
  useTotalArticleCount,
  useTotalUserCount,
} from "../hooks/useAdmin";

export function AdminDashboardPage() {
  const totalUsers = useTotalUserCount();
  const totalArticles = useTotalArticleCount();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Administration
        </p>

        <h1 className="text-4xl font-bold text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Monitor platform statistics and manage users and articles.
        </p>
      </div>

      <div className="mb-10 grid gap-6 md:grid-cols-2">
        <StatCard
          label="Registered Users"
          value={totalUsers}
        />

        <StatCard
          label="Total Articles"
          value={totalArticles}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin/users"
          className="
          inline-flex
          items-center
          rounded-xl
          border
          border-blue-400/20
          bg-blue-500/10
          px-5
          py-3
          font-medium
          text-blue-300
          transition-all
          duration-200
          hover:bg-blue-500/20
          hover:text-white
          "
        >
          Manage Users →
        </Link>

        <Link
          to="/admin/articles"
          className="
          inline-flex
          items-center
          rounded-xl
          border
          border-blue-400/20
          bg-blue-500/10
          px-5
          py-3
          font-medium
          text-blue-300
          transition-all
          duration-200
          hover:bg-blue-500/20
          hover:text-white
          "
        >
          Manage Articles →
        </Link>
      </div>
    </div>
  );
}