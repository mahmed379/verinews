import { PendingArticlesTable } from "../Components/moderation/PendingArticlesTable";


export function ModerationQueuePage() {

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          Moderator Panel
        </p>

        <h1 className="text-4xl font-bold text-white">
          Moderation Queue
        </h1>

        <p className="mt-2 text-slate-400">
          Review newly submitted articles and decide whether to verify or dispute them.
        </p>
      </div>


      <PendingArticlesTable />

    </div>
  );
}