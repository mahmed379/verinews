import { PendingArticlesTable } from "../Components/moderation/PendingArticlesTable";


export function ModerationQueuePage() {

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-ink mb-6">
        Moderation Queue
      </h1>


      <PendingArticlesTable />

    </div>
  );
}