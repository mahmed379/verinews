import { ArticleSubmitForm } from "../Components/articles/ArticleSubmitForm";


export function SubmitArticlePage() {

  return (
    <div className="max-w-xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-bold mb-6">
        Submit a News Item
      </h1>

      <ArticleSubmitForm />

    </div>
  );
}