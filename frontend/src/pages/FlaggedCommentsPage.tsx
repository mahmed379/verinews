import { FlaggedCommentsTable } from "../Components/moderation/FlaggedCommentsTable";

export function FlaggedCommentsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Moderator Panel
        </p>

        <h1 className="text-4xl font-bold text-white">
          Flagged Comments
        </h1>

        <p className="mt-2 text-slate-400">
          Review comments automatically flagged by the AI moderation assistant.
        </p>
      </div>

      <FlaggedCommentsTable />
    </div>
  );
}