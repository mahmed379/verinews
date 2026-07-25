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
    <section className="max-w-3xl mx-auto px-4 py-16">

      <h2 className="text-2xl font-bold text-ink text-center mb-8">
        Top Rated Articles
      </h2>


      {isLoading && (
        <p className="text-slate-500 text-center">
          Loading featured articles...
        </p>
      )}


      {isError && (
        <p className="text-danger text-center">
          Failed to load featured articles.
        </p>
      )}


      {!isLoading && featuredArticles.length === 0 && (
        <p className="text-slate-500 text-center">
          No rated articles yet — be the first to submit one.
        </p>
      )}


      <div className="space-y-4">

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