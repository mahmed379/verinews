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
              className="border-b border-white/10 last:border-0"
            >
              <td className="p-3 font-medium text-white">
                {user.username}
              </td>

              <td className="p-3 text-slate-300">
                {user.email || "—"}
              </td>

              <td className="p-3">
                {user.is_staff ? (
                <span
                  className="
                    text-xs
                    font-medium
                    rounded-full
                    border
                    border-blue-400/20
                    bg-blue-500/10
                    px-3
                    py-1
                    text-blue-300
                  "
                >
                  Staff
                </span>
                ) : (
                  <span
                    className="
                      text-xs
                      rounded-full
                      border
                      border-white/10
                      bg-white/5
                      px-3
                      py-1
                      text-slate-300
                    "
                  >
                    Member
                  </span>
                )}
              </td>

              <td className="p-3 text-slate-400 text-sm">
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
          className="
          px-4
          py-2
          rounded-xl
          border
          border-white/20
          bg-white/5
          text-slate-300
          transition
          hover:bg-white/10
          disabled:opacity-40
          "
        >
          Previous
        </button>

        <button
          disabled={!data.next}
          onClick={() => setPage((p) => p + 1)}
          className="
          px-4
          py-2
          rounded-xl
          border
          border-white/20
          bg-white/5
          text-slate-300
          transition
          hover:bg-white/10
          disabled:opacity-40
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}