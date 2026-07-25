import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchArticles } from "../../api/articles";
import { useDeleteArticle } from "../../hooks/useAdmin";
import { StatusBadge } from "../ui/StatusBadge";
import LoadingSpinner from "../ui/LoadingSpinner";

export function ArticleManagementTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", { sort: "newest" }],
    queryFn: () => fetchArticles({ sort: "newest" }),
  });

  const deleteMutation = useDeleteArticle();

  if (isLoading) return <LoadingSpinner />;

  function handleDelete(id: number, title: string) {
    if (window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  }

  return (
    <table className="w-full solid-card">
      <thead className="border-b border-slate-200 text-left text-sm text-slate-500">
        <tr>
          <th className="p-3">Title</th>
          <th className="p-3">Status</th>
          <th className="p-3"></th>
        </tr>
      </thead>

      <tbody>
        {data?.results.map((article) => (
          <tr
            key={article.id}
            className="border-b border-slate-100 last:border-0"
          >
            <td className="p-3">
              <Link
                to={`/articles/${article.id}`}
                className="text-primary hover:underline"
              >
                {article.title}
              </Link>
            </td>

            <td className="p-3">
              <StatusBadge status={article.status} />
            </td>

            <td className="p-3 text-right">
              <button
                onClick={() => handleDelete(article.id, article.title)}
                disabled={deleteMutation.isPending}
                className="text-sm font-medium text-danger hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}