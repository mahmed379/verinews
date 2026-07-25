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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard
          label="Registered Users"
          value={totalUsers}
        />

        <StatCard
          label="Total Articles"
          value={totalArticles}
        />
      </div>

      <div className="flex gap-4">
        <Link
          to="/admin/users"
          className="text-primary font-medium hover:underline"
        >
          Manage Users →
        </Link>

        <Link
          to="/admin/articles"
          className="text-primary font-medium hover:underline"
        >
          Manage Articles →
        </Link>
      </div>
    </div>
  );
}