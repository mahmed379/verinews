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
          A community-driven platform for transparent news credibility assessment.
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
          VeriNews is a community-driven news credibility platform that enables users to submit news articles,
          evaluate their credibility through community ratings, participate in discussions, and report potentially
          misleading content. Moderators review submissions to help maintain transparency and reliability.
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
          The rapid spread of misinformation makes it increasingly difficult to distinguish reliable news from
          misleading content. VeriNews promotes transparency by combining community participation, moderator
          oversight, and AI-assisted analysis to support informed decision-making.
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
          <li>⭐ Community credibility ratings (1 – 5 scale)</li>
          <li>🛡️ Moderator review and verification workflow</li>
          <li>🚩 Transparent article reporting system</li>
          <li>🤖 AI-assisted credibility analysis</li>
          <li>👥 Role-based user and moderator dashboards</li>
          <li>🔐 Secure authentication and account management</li>
          <li>📄 RESTful API for developers</li>
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
          <li>Django 5</li>
          <li>Django REST Framework (DRF)</li>
          <li>TypeScript</li>
          <li>Vite</li>
          <li>Tailwind CSS</li>
          <li>TanStack Query</li>
          <li>PostgreSQL</li>
          <li>WhiteNoise</li>
          <li>Gunicorn</li>
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
          <span className="font-medium">Hafiz Muhammad Ahmed</span> as a
          full-stack portfolio project showcasing Django, React, REST APIs,
          AI-assisted moderation, secure authentication, and a transparent,
          community-driven approach to news credibility assessment.
        </p>
      </section>


    </div>
  );
}