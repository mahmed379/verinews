export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      <h1 className="text-3xl font-bold text-ink mb-8">
        About VeriNews
      </h1>


      <section className="mb-8">
        <h2 className="text-xl font-semibold text-ink mb-2">
          What is VeriNews?
        </h2>

        <p className="text-slate-700">
          VeriNews is a community-driven platform for submitting news articles
          and collaboratively assessing their credibility through ratings,
          comments, and moderated review.
        </p>
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-semibold text-ink mb-2">
          Why VeriNews Exists
        </h2>

        <p className="text-slate-700">
          Misinformation spreads quickly. VeriNews provides readers a
          transparent way to rate credibility, report concerns, and understand
          how article decisions are made.
        </p>
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-semibold text-ink mb-2">
          Core Features
        </h2>

        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Community credibility ratings (1–5 scale)</li>
          <li>Moderator verification workflow</li>
          <li>Transparent article reporting</li>
          <li>Role-based dashboards</li>
          <li>REST API with authentication</li>
        </ul>
      </section>


      <section className="mb-8">
        <h2 className="text-xl font-semibold text-ink mb-2">
          Technology Stack
        </h2>

        <ul className="list-disc list-inside text-slate-700 space-y-1">
          <li>Django 5 + Django REST Framework</li>
          <li>React + TypeScript + Vite</li>
          <li>Tailwind CSS</li>
          <li>TanStack Query</li>
        </ul>
      </section>


      <section className="border-t border-slate-200 pt-8">
        <h2 className="text-xl font-semibold text-ink mb-2">
          Developer
        </h2>

        <p className="text-slate-700">
        VeriNews was designed and developed by{" "}
        <span className="font-medium">Hafiz Muhammad Ahmed</span>,
        focusing on building a transparent community-driven platform for news credibility verification.
        </p>
      </section>


    </div>
  );
}