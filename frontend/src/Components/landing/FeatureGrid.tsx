const FEATURES = [
  {
    title: "Community Ratings",
    description:
      "Every article carries a live, transparent 1–5 credibility score from real readers.",
  },
  {
    title: "Moderator Verification",
    description:
      "Moderators review flagged and pending articles, with every decision tracked.",
  },
  {
    title: "Transparent Reporting",
    description:
      "Users can report suspicious articles and follow moderation outcomes.",
  },
  {
    title: "AI Verification",
    description:
      "AI-assisted credibility signals and source analysis to support human review.",
    comingSoon: true,
  },
];


export function FeatureGrid() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16">

      <h2 className="text-2xl font-bold text-ink text-center mb-10">
        How VeriNews Works
      </h2>


      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {FEATURES.map((feature) => (

          <div
            key={feature.title}
            className="solid-card p-5"
          >

            <div className="flex items-center justify-between mb-2">

              <h3 className="font-semibold text-ink">
                {feature.title}
              </h3>


              {feature.comingSoon && (
                <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                  Coming Soon
                </span>
              )}

            </div>


            <p className="text-sm text-slate-600">
              {feature.description}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}