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
      "Automated credibility signals — source reputation and writing-pattern analysis — support every submission.",
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