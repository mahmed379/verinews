import { useSearchParams } from "react-router-dom";

import { useArticles } from "../hooks/useArticles";
import { ArticleCard } from "../Components/articles/ArticleCard";
import { ArticleFilterBar } from "../Components/articles/ArticleFilters";


export default function Home() {

  const [searchParams, setSearchParams] = useSearchParams();


  const filters = {
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    sort: searchParams.get("sort") ?? "newest",
    page: Number(searchParams.get("page") ?? "1"),
  };


  const {
    data,
    isLoading,
    isError,
  } = useArticles(filters);



  function goToPage(page: number) {

    setSearchParams((prev) => {

      const next = new URLSearchParams(prev);

      next.set(
        "page",
        String(page)
      );

      return next;

    });

  }



  return (

    <div className="max-w-3xl mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold text-ink mb-6">
        Latest Submissions
      </h1>


      <ArticleFilterBar />



      {isLoading && (
        <p className="text-slate-500">
          Loading articles...
        </p>
      )}



      {isError && (
        <p className="text-danger">
          Failed to load articles.
        </p>
      )}



      {data?.results.length === 0 && (
        <p className="text-slate-500">
          No articles match your filters.
        </p>
      )}



      {data?.results.map((article) => (

        <ArticleCard
          key={article.id}
          article={article}
        />

      ))}




      {data && (data.next || data.previous) && (

        <div className="flex gap-2 mt-4">


          <button
            disabled={!data.previous}
            onClick={() =>
              goToPage(filters.page - 1)
            }
            className="px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40"
          >
            Previous
          </button>



          <button
            disabled={!data.next}
            onClick={() =>
              goToPage(filters.page + 1)
            }
            className="px-3 py-1.5 border border-slate-300 rounded-lg disabled:opacity-40"
          >
            Next
          </button>


        </div>

      )}

    </div>

  );
}