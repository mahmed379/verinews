import { useArticles } from "../../hooks/useArticles";
import { ArticleCard } from "../../Components/articles/ArticleCard";


export function FeaturedArticles() {

  const {
    data,
    isLoading,
    isError,
  } = useArticles({
    sort: "top_rated",
    page: 1,
  });


  const featuredArticles = data?.results.slice(0, 3) ?? [];


  return (
    <section className="mx-auto max-w-6xl px-4 py-12">


      <div className="mb-12 text-center">

        <h2 className="text-3xl font-bold text-white">
          Top Rated Articles
        </h2>

        <p className="mt-3 text-slate-400">
          Discover news that the VeriNews community trusts.
        </p>

      </div>



      {isLoading && (

        <div className="
        glass-card
        p-6
        text-center
        text-slate-300
        ">
        Loading featured articles...
        </div>

      )}



      {isError && (

        <div className="
        glass-card
        p-6
        text-center
        text-slate-300
        ">
        Failed to load feature article.
        </div>

      )}



      {!isLoading && featuredArticles.length === 0 && (

        <div className="
          rounded-2xl
          border
          border-white/10
          bg-white/5
          p-8
          text-center
          backdrop-blur-xl
        ">

          <p className="text-slate-300">
            No rated articles yet — be the first to submit one.
          </p>

        </div>

      )}




      <div className="
      grid
      gap-6
      md:grid-cols-2
      lg:grid-cols-3
      ">


        {featuredArticles.map((article) => (

          <ArticleCard
            key={article.id}
            article={article}
          />

        ))}


      </div>


    </section>
  );
}