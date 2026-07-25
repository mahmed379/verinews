import { useState } from "react";
import { useUsers } from "../../hooks/useAdmin";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";

export function UserTable() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers(page);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data || data.results.length === 0) {
    return (
        <EmptyState
        title="No users found"
        description="There are no registered users to display."
        />
    );
  }

  return (
    <div>
      <table className="w-full solid-card">
        <thead className="border-b border-slate-200 text-left text-sm text-slate-500">
          <tr>
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Joined</th>
          </tr>
        </thead>

        <tbody>
          {data.results.map((user) => (
            <tr
              key={user.id}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="p-3 font-medium text-ink">
                {user.username}
              </td>

              <td className="p-3 text-slate-600">
                {user.email || "—"}
              </td>

              <td className="p-3">
                {user.is_staff ? (
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Staff
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">
                    Member
                  </span>
                )}
              </td>

              <td className="p-3 text-slate-500 text-sm">
                {new Date(user.date_joined).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 mt-4">
        <button
          disabled={!data.previous}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40"
        >
          Previous
        </button>

        <button
          disabled={!data.next}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}