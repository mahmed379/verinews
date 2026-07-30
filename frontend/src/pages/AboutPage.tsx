export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">

      <div className="mb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
          About Platform
        </p>

        <h1 className="text-4xl font-bold text-white">
          About VeriNews
        </h1>

        <p className="mt-3 text-slate-400">
          A community-powered platform for transparent news credibility assessment.
        </p>
      </div>


      <section
        className="
          glass-card
          mb-6
          p-6
        "
      >
        <h2 className="text-xl font-semibold text-white mb-2">
          What is VeriNews?
        </h2>

        <p className="text-slate-300">
          VeriNews is a community-driven platform for submitting news articles
          and collaboratively assessing their credibility through ratings,
          comments, and moderated review.
        </p>
      </section>


      <section
        className="
          glass-card
          mb-6
          p-6
        "
      >
        <h2 className="text-xl font-semibold text-white mb-2">
          Why VeriNews Exists
        </h2>

        <p className="text-slate-300">
          Misinformation spreads quickly. VeriNews provides readers a
          transparent way to rate credibility, report concerns, and understand
          how article decisions are made.
        </p>
      </section>


      <section
        className="
          glass-card
          mb-6
          p-6
        "
        >
        <h2 className="text-xl font-semibold text-white mb-2">
          Core Features
        </h2>

        <ul className="list-disc list-inside text-slate-300 space-y-1">
          <li>Community credibility ratings (1–5 scale)</li>
          <li>Moderator verification workflow</li>
          <li>Transparent article reporting</li>
          <li>Role-based dashboards</li>
          <li>REST API with authentication</li>
        </ul>
      </section>


      <section
        className="
          glass-card
          mb-6
          p-6
        "
        >
        <h2 className="text-xl font-semibold text-white mb-2">
          Technology Stack
        </h2>

        <ul className="list-disc list-inside text-slate-300 space-y-1">
          <li>Django 5 + Django REST Framework</li>
          <li>React + TypeScript + Vite</li>
          <li>Tailwind CSS</li>
          <li>TanStack Query</li>
        </ul>
      </section>


      <section
        className="
          glass-card
          mt-8
          p-6
        "
      >
        <h2 className="text-xl font-semibold text-white mb-2">
          Developer
        </h2>

        <p className="text-slate-300">
        VeriNews was designed and developed by{" "}
        <span className="font-medium">Hafiz Muhammad Ahmed</span>,
        focusing on building a transparent community-driven platform for news credibility verification.
        </p>
      </section>


    </div>
  );
}