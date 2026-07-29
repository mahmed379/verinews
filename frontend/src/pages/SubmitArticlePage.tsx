import { ArticleSubmitForm } from "../Components/articles/ArticleSubmitForm";

export function SubmitArticlePage() {
  return (
    <div className="min-h-screen px-4 py-10">

      <div className="max-w-2xl mx-auto">

        <div className="glass-card p-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Submit a News Item
          </h1>

          <p className="text-slate-300 mb-8">
            Share a news article with the community. Our moderation and AI
            analysis system will review credibility signals.
          </p>

          <ArticleSubmitForm />

        </div>

      </div>

    </div>
  );
}