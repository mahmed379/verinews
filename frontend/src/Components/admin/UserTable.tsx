import { useState } from "react";
import { useUsers } from "../../hooks/useAdmin";
import LoadingSpinner from "../ui/LoadingSpinner";
import EmptyState from "../ui/EmptyState";

export function UserTable() {
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");

  const { data, isLoading } = useUsers(page);

  const filteredUsers =
    data?.results.filter(
      (user) =>
        user.username
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          .toLowerCase()
          .includes(search.toLowerCase())
    ) ?? [];

  const totalUsers = data?.results.length ?? 0;
  const staffUsers =
    data?.results.filter((u) => u.is_staff).length ?? 0;
  const memberUsers = totalUsers - staffUsers;

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

      <div className="mb-5 flex gap-6 text-sm">

        <span className="text-slate-300">
          👥 Total:
          <span className="ml-1 font-semibold text-white">
            {totalUsers}
          </span>
        </span>

        <span className="text-slate-300">
          👤 Members:
          <span className="ml-1 font-semibold text-emerald-300">
            {memberUsers}
          </span>
        </span>

        <span className="text-slate-300">
          🛡 Staff:
          <span className="ml-1 font-semibold text-blue-300">
            {staffUsers}
          </span>
        </span>

      </div>
        
      <div className="mb-5 max-w-md">

        <input
          type="text"
          placeholder="Search username or email..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            text-white
            placeholder:text-slate-500
            focus:border-blue-400
            focus:outline-none
          "
        />

      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <table
        className="
          w-full
          min-w-[640px]
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
          {filteredUsers.map((user) => (
            <tr
              key={user.id}
              className="
              border-b
              border-white/10
              last:border-0
              hover:bg-white/5
              transition-colors
              "
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
      </div>

      <div className="mt-5 flex items-center justify-between">

        <p className="text-sm text-slate-400">
          Showing {filteredUsers.length} of {totalUsers} users
        </p>

        <div className="flex gap-2">
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
    </div>
  );
}