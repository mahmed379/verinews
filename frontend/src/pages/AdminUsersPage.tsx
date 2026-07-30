import { UserTable } from "../Components/admin/UserTable";

export function AdminUsersPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Administration
        </p>

        <h1 className="text-4xl font-bold text-white">
          User Management
        </h1>

        <p className="mt-2 text-slate-400">
          Manage registered users and their platform access.
        </p>
      </div>

      <UserTable />

    </div>
  );
}