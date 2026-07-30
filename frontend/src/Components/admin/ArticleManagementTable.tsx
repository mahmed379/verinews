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
    <table
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
      "
    >
      <thead className="border-b border-white/10 text-left text-sm text-slate-400">
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
            className="border-b border-white/10 last:border-0"
          >
            <td className="p-3">
              <Link
                to={`/articles/${article.id}`}
                className="
                  font-medium
                  text-blue-300
                  transition
                  hover:text-white
                  hover:underline
                "
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
                className="
                rounded-xl
                border
                border-red-400/20
                bg-red-500/10
                px-4
                py-2
                text-sm
                font-medium
                text-red-300
                transition
                hover:bg-red-500/20
                disabled:opacity-50
                "
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