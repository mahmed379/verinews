import { FlaggedCommentsTable } from "../Components/moderation/FlaggedCommentsTable";

export function FlaggedCommentsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">
        Flagged Comments
      </h1>

      <FlaggedCommentsTable />
    </div>
  );
}