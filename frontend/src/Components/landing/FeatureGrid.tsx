const FEATURES = [
  {
    title: "Community Ratings",
    description:
      "Every article carries a live, transparent 1–5 credibility score from real readers.",
    icon: "⭐",
  },
  {
    title: "Moderator Verification",
    description:
      "Moderators review flagged and pending articles, with every decision tracked.",
    icon: "🛡️",
  },
  {
    title: "Transparent Reporting",
    description:
      "Users can report suspicious articles and follow moderation outcomes.",
    icon: "🚩",
  },
  {
    title: "AI Verification",
    description:
      "Automated credibility signals — source reputation and writing-pattern analysis — support every submission.",
    icon: "🤖",
  },
];


export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">


      <div className="mb-12 text-center">

        <h2 className="text-3xl font-bold text-white">
          How VeriNews Works
        </h2>

        <p className="mt-3 text-slate-400">
          Combining community intelligence with AI-powered credibility checks.
        </p>

      </div>



      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


        {FEATURES.map((feature) => (

          <div
            key={feature.title}
            className="
            glass-card
            p-6
            transition
            duration-300
            hover:-translate-y-2
            hover:border-blue-400/40
            hover:bg-white/10
            "
          >


            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-2xl">

              {feature.icon}

            </div>



            <h3 className="text-lg font-semibold text-white">
              {feature.title}
            </h3>



            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {feature.description}
            </p>


          </div>

        ))}


      </div>


    </section>
  );
}