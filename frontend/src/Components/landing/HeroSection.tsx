import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { GlassCard } from "../ui/GlassCard";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="bg-gradient-to-br from-primary/10 via-surface to-secondary/10 px-4 py-20">
      <div className="max-w-3xl mx-auto text-center">

        <GlassCard className="inline-block px-10 py-12">

          <h1 className="text-4xl sm:text-5xl font-bold text-ink">
            News you can{" "}
            <span className="text-secondary">
              verify
            </span>.
          </h1>


          <p className="text-lg text-slate-600 mt-4 max-w-xl mx-auto">
            VeriNews is a community-driven platform where articles are rated,
            reviewed, and moderated for credibility — transparently, by real people.
          </p>


          <div className="flex flex-wrap justify-center gap-4 mt-8">

            <Link
              to="/articles"
              className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary/90"
            >
              Browse Articles
            </Link>


            {!user && (
              <Link
                to="/register"
                className="bg-white border border-slate-300 text-ink font-medium px-6 py-3 rounded-lg hover:border-primary"
              >
                Login / Register
              </Link>
            )}

          </div>

        </GlassCard>

      </div>
    </section>
  );
}