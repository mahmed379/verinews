import { ArticleManagementTable } from "../Components/admin/ArticleManagementTable";

export function AdminArticlesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">
        Manage Articles
      </h1>

      <ArticleManagementTable />
    </div>
  );
}