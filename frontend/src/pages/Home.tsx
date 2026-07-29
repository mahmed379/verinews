import { useSearchParams, Link } from "react-router-dom";

import { useArticles } from "../hooks/useArticles";
import { ArticleCard } from "../Components/articles/ArticleCard";
import { ArticleFilterBar } from "../Components/articles/ArticleFilters";
import useAuth from "../hooks/useAuth";


export default function Home() {

  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();


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

    <div className="max-w-7xl mx-auto px-4 py-8">


      <div
        className="
          flex
          flex-col
          gap-4
          mb-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <h1 className="text-3xl font-bold tracking-tight text-white">
          Latest Submissions
        </h1>


        {user && (
          <Link
            to="/articles/submit"
            className="
            glass-button px-5 py-2.5 text-sm font-semibold text-white
            "
          >
            Submit News
          </Link>
        )}

      </div>



      <ArticleFilterBar />



      {isLoading && (
        <div className="
          glass-card
          p-6
          text-center
          text-slate-300
        ">
          Loading articles...
        </div>
      )}



      {isError && (
        <div className="
          glass-card
          p-6
          text-center
          text-slate-300
        ">
          Failed to load articles.
        </div>
      )}



      {data?.results.length === 0 && (
        <div className="
          glass-card
          p-6
          text-center
          text-slate-300
        ">
          No article match your filters.
        </div>
      )}



      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {data?.results.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}

      </div>





      {data && (data.next || data.previous) && (

        <div className="
          flex
          justify-center
          gap-3
          mt-8
        ">


          <button
            disabled={!data.previous}
            onClick={() =>
              goToPage(filters.page - 1)
            }
            className="
            px-3 py-1.5
            rounded-xl
            border
            border-white/20
            bg-white/5
            text-white
            backdrop-blur-xl
            disabled:opacity-40
            hover:bg-white/10
            "
          >
            Previous
          </button>



          <button
            disabled={!data.next}
            onClick={() =>
              goToPage(filters.page + 1)
            }
            className="
            px-3 py-1.5
            rounded-xl
            border
            border-white/20
            bg-white/5
            text-white
            backdrop-blur-xl
            disabled:opacity-40
            hover:bg-white/10
            "
          >
            Next
          </button>


        </div>

      )}


    </div>

  );
}