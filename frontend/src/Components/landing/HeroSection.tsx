import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { GlassCard } from "../ui/GlassCard";

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="relative overflow-hidden py-28">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
      </div>


      <div className="mx-auto max-w-4xl px-4 text-center">


        <GlassCard className="px-8 py-14 sm:px-12">


          <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
            AI-powered News Verification Platform
          </div>


          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">

            News you can{" "}

            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              verify
            </span>

          </h1>


          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">

            VeriNews is a community-driven platform where articles are
            analyzed, reviewed, and moderated to improve trust and transparency
            in online news.

          </p>



          <div className="mt-10 flex flex-wrap justify-center gap-4">


            <Link
              to="/articles"
              className="
              rounded-xl
              bg-primary
              px-7
              py-3
              font-semibold
              text-white
              shadow-lg
              shadow-blue-600/30
              transition
              hover:-translate-y-1
              hover:bg-blue-500
              "
            >
              Browse Articles
            </Link>



            {!user && (

              <Link
                to="/register"
                className="
                rounded-xl
                border
                border-white/20
                bg-white/10
                px-7
                py-3
                font-semibold
                text-white
                backdrop-blur
                transition
                hover:-translate-y-1
                hover:bg-white/20
                "
              >
                Get Started
              </Link>

            )}


          </div>


        </GlassCard>


      </div>

    </section>
  );
}