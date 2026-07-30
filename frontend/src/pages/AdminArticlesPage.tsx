import { ArticleManagementTable } from "../Components/admin/ArticleManagementTable";

export function AdminArticlesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Administration
        </p>

        <h1 className="text-4xl font-bold text-white">
          Manage Articles
        </h1>

        <p className="mt-2 text-slate-400">
          Review and manage all submitted articles.
        </p>
      </div>

      <ArticleManagementTable />

    </div>
  );
}