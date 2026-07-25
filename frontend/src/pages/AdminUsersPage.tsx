import { UserTable } from "../Components/admin/UserTable";

export function AdminUsersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">
        User Management
      </h1>

      <UserTable />
    </div>
  );
}