# VeriNews

> **Community-driven platform for transparent news credibility assessment with explainable AI-assisted moderation.**

VeriNews is a full-stack, community-driven news credibility platform. Users submit news articles, the community rates their credibility, and a moderation pipeline — backed by explainable, rule-based AI signals — helps staff review flagged content, spam, and reports before it reaches the public feed.

Built as a portfolio project with a Django REST Framework backend and a React + TypeScript frontend, VeriNews demonstrates a complete production workflow: authentication, role-based access control, an automated moderation pipeline, an audit trail, and a deployed, CI-tested full-stack application.

## Table of Contents

- [Why I Built VeriNews](#why-i-built-verinews)
- [Security](#security)
- [Testing](#testing)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [AI Features](#ai-features)
- [Screenshots](#screenshots)
- [API](#api)
- [Installation](#installation)
- [Docker](#docker)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Developer](#developer)
- [License](#license)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Why I Built VeriNews

VeriNews was created as a full-stack portfolio project to explore how community participation, moderator oversight, and explainable AI-assisted analysis can improve transparency in news credibility assessment. The project showcases modern software engineering practices including REST APIs, authentication, role-based access control, responsive UI design, automated moderation, and production-ready deployment.

---

## Security

- Token Authentication
- Password Reset via secure, time-limited tokens
- Role-Based Access Control
- CSRF Protection
- Rate Limiting (per-endpoint throttles for register, login, password reset, and reporting)
- Production Security Headers (HSTS, SSL redirect, secure cookies, `X-Frame-Options: DENY`)

> **Not implemented:** post-registration email verification. This was originally scaffolded, then deliberately removed — the register endpoint activates accounts immediately and sends no verification email. See [Known Limitations & Future Improvements](#known-limitations--future-improvements) if you're considering adding it back.

---

## Testing

Backend:

```bash
python manage.py test
```

Frontend:

```bash
npm run build
```

`npm run build` runs a full TypeScript typecheck (`tsc -b`) before bundling — a type error fails the build rather than shipping broken code. Lint separately with:

```bash
npm run lint
```

There is currently no frontend test suite (no Vitest/Jest/RTL) — see [Known Limitations & Future Improvements](#known-limitations--future-improvements).

---

## Features

**Authentication & Accounts**
- Registration (creates the account only — does **not** log the user in or issue a token; `POST /api/auth/register/` returns `{ message, user }`, no token. Log in afterward as a separate step.)
- Token-based login / logout
- Password reset and password reset confirmation
- Role-based access: regular users, moderators (staff), and admins (superusers), enforced on both the backend (DRF permissions) and frontend (protected routes)

**News & Community Credibility**
- News article submission
- Community credibility voting
- Moderator review workflow with a full status-change history (`CredibilityReview`)
- Search, category/status filtering, and sorting on the article list (both the Django views and the REST API)
- Comments on articles (add, edit, delete)
- Article reporting (false information, spam, harassment, copyright, other)

**AI-Assisted Moderation**
- Automated credibility analysis, triggered on article submission
- Automated article summarization, triggered on article submission
- Automated comment spam detection, triggered on comment creation
- Automated report-suspicion detection, triggered on report creation
- All AI results are explainable — every score ships with the specific factors/reasons behind it, surfaced directly in the UI as "Automated Credibility Signals"

**Moderator & Admin Tools**
- Moderator dashboard, moderation queue, flagged-comments queue, and report management screens
- Immutable moderator audit log (who did what, to what, and when) — read-only even in Django admin
- Admin dashboard with user management and article management
- Personal dashboard with stats for regular users

**Platform**
- REST API covering authentication, articles, votes, comments, reports, and dashboard stats
- Interactive API documentation (Swagger UI and ReDoc) via drf-spectacular
- Per-endpoint rate limiting (registration, login, password reset, and reporting all have distinct throttle rates)
- Health-check endpoint (`/healthz/`) for uptime monitoring

---

## Technology Stack

**Backend**
- Python
- Django 5
- Django REST Framework
- Token Authentication (`rest_framework.authtoken`)
- drf-spectacular (OpenAPI schema, Swagger UI, ReDoc)
- django-cors-headers
- django-anymail (Resend backend) — transactional email in production, sent over HTTPS rather than SMTP, since Render's free-tier web services block outbound SMTP ports (25/465/587)
- PostgreSQL (production) / SQLite (development)
- WhiteNoise (static file serving)
- Gunicorn (production WSGI server)

**Frontend**
- React 19
- TypeScript
- Vite 8
- Tailwind CSS
- TanStack Query
- React Router
- Axios
- react-hot-toast

> `react-hook-form` and `zod` are listed as dependencies but not currently wired into any form — existing forms (login, register, etc.) use plain `useState` with manual validation. Treat them as available-but-unused rather than active stack until a form is actually migrated to use them.

**Development & Deployment**
- Docker & Docker Compose (local development, with a Postgres service)
- GitHub Actions (CI — runs the Django test suite on every push/PR to `main`)
- Render — backend web service, managed PostgreSQL, and frontend static site

---

## Project Architecture

The backend is organized as a set of focused Django apps under `apps/`, each owning one part of the domain:

| App | Responsibility |
|---|---|
| `accounts` | Custom user model, registration, login/logout, password reset |
| `news` | Article submission, credibility review workflow, community voting |
| `comments` | Comments on articles |
| `reports` | User-submitted reports against articles |
| `dashboard` | Personal and moderator-facing stats |
| `api` | Central REST API router — wires the ViewSets/APIViews from the apps above into one versionable API surface |
| `ai` | Heuristic credibility analysis, summarization, and spam/suspicion moderation — triggered automatically via Django signals on article/comment/report creation |
| `moderation_audit` | Append-only audit log of moderator actions, using a generic foreign key so it can point at any moderated object |

Settings are split by environment (`config/settings/base.py`, `dev.py`, `prod.py`) rather than toggled with flags, so which file you run decides the environment — not a setting you might forget to flip.

The frontend (`frontend/`) is a separate Vite-built single-page app that talks to the Django backend exclusively through the REST API, with role-gated routing (`RequireAuth`) for user, moderator (`staffOnly`), and admin (`superuserOnly`) areas.

**Note on the register/login split:** registration and login are deliberately separate flows on both sides. `POST /api/auth/register/` only creates the account and returns `{ message, user }` — no token. The frontend's `register()` (in `AuthContext`) reflects that: it doesn't touch `localStorage` or fetch the current user. Only `login()` stores the auth token, via `/api/auth/login/` (or `/api/auth-token/`), which does return one.

---

## AI Features

VeriNews's AI features are **heuristic, rule-based analyzers — not trained machine learning models, and no external AI API is used.** This is a deliberate, honest design choice: with no labeled training dataset, a fixed set of explicit, inspectable rules is more trustworthy than pretending otherwise. Every score is returned with the exact reasoning behind it, and the UI calls this "Automated Credibility Signals," not an "AI verdict."

- **Credibility scoring** — evaluates source reputation (a curated list of established outlets, plus institutional TLDs like `.gov`/`.edu`), writing pattern (sensational-phrase detection, punctuation/caps abuse), content length, and source attribution (quoted, named sourcing), producing a 0–100 score and a low/medium/high risk label.
- **Article summarization** — an extractive summarizer that surfaces key points and claims from a submitted article.
- **Comment moderation** — flags likely spam using link density, short link-only comments, repeated-character patterns, and spam-keyword matching, with diminishing returns so a couple of weak signals don't overstate confidence.
- **Report-suspicion detection** — flags likely bad-faith reports, weighted primarily by a reporter's history of *dismissed* (moderator-rejected) reports rather than raw report volume, so active, accurate reporters aren't penalized the same as spammers.

All four run automatically via Django signals when the relevant object (article, comment, or report) is created — no manual trigger needed.

---

## Screenshots

> Placeholders — add screenshots here before publishing.

**Landing Page**

**Dashboard**

**Article Details**

**Moderator Dashboard**

**Admin Panel**

**Reports**

**Comments**

**Password Reset**

---

## API

VeriNews exposes a REST API (mounted at `/api/`) covering:

- **Authentication**: register, login (token issue), logout, password reset, password reset confirmation, current-user profile (`/api/users/me/`)
- **Articles**: full CRUD via a `ModelViewSet`, plus community voting
- **Comments**: full CRUD via a `ModelViewSet`
- **Reports**: submission and management via a `ModelViewSet`
- **Dashboard**: stats endpoint
- **Users**: read-only user listing (superuser only — role changes are managed through Django admin, not the API)

Authentication uses DRF's `TokenAuthentication` — clients send `Authorization: Token <key>` after obtaining a token from `/api/auth-token/` or `/api/auth/login/`. Registering an account (`/api/auth/register/`) does **not** return a token; log in afterward to obtain one.

Interactive documentation is available via **drf-spectacular**:
- Swagger UI at `/api/docs/`
- ReDoc at `/api/redoc/`
- Raw OpenAPI schema at `/api/schema/`

---

## Installation

### Prerequisites
- Python 3.12+
- Node.js `^20.19.0` or `>=22.12.0` (required by Vite 8 — Node 18 will not build the frontend)
- PostgreSQL (optional for local dev — SQLite is used by default)

### Backend

```bash
git clone <repo-url>
cd verinews

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements/dev.txt
```

### Environment variables

Create a `.env` file in the project root. `.env.example` is the general reference, though its email section still documents the original Gmail SMTP setup rather than the current Resend-based flow — for local development you can safely ignore email entirely and rely on the console backend default. `.env.docker.example` is the reference used for Docker Compose specifically. In development, sensible defaults apply automatically if you skip `.env` altogether (console email backend, SQLite) — real values are only needed to test actual email delivery or connect to Postgres locally.

Key variables:

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Django's cryptographic signing key |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated allowed hostnames (production) |
| `DATABASE_URL` | PostgreSQL connection string (production) |
| `FRONTEND_URL` | Deployed frontend origin — used for CORS and to build the password-reset link (production) |
| `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` | SMTP settings, read only in **development** (`config/settings/dev.py`), for local testing of real email delivery. Production ignores `EMAIL_BACKEND` entirely and always uses the Resend backend below. |
| `RESEND_API_KEY` | Required in production — password-reset emails are sent via Resend's HTTPS API (`django-anymail`), since Render's free tier blocks outbound SMTP ports |
| `DEFAULT_FROM_EMAIL` | "From" address on outgoing email — in production, must be on a domain verified in Resend |

The frontend has its own, separate env file — see [Frontend](#frontend) below.

### Database

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Run the backend

```bash
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env` (see `frontend/.env.example`):

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Run the frontend

```bash
npm run dev
```

---

## Docker

A `Dockerfile` and `docker-compose.yml` are provided for a containerized local environment with a real PostgreSQL service (rather than SQLite):

```bash
docker compose up --build
```

This starts:
- `db` — a PostgreSQL 16 container with a health check
- `web` — the Django app, built from the project `Dockerfile`, running migrations automatically and serving on `http://localhost:8000`

---

## Deployment

Both the backend and frontend are deployed on **Render**.

**Backend → Render Web Service**
- Deployed using `render.yaml` (Render Blueprint), with a linked Render PostgreSQL instance
- Build command: `./build.sh` (installs `requirements/prod.txt`, runs `collectstatic`, runs `migrate`)
- Start command: `gunicorn config.wsgi:application`
- Static files served via WhiteNoise (`CompressedManifestStaticFilesStorage`)
- Health check: `/healthz/`
- Email sent via Resend over HTTPS rather than raw SMTP — Render's free web services block outbound SMTP ports (25/465/587), so a plain `django.core.mail.backends.smtp.EmailBackend` setup does not work there
- Required environment variables: `DJANGO_SETTINGS_MODULE=config.settings.prod`, `DJANGO_SECRET_KEY` (auto-generated by Render), `DATABASE_URL` (auto-wired from the Render Postgres instance), `DJANGO_ALLOWED_HOSTS`, `FRONTEND_URL`, `RESEND_API_KEY`, `DEFAULT_FROM_EMAIL`

**Frontend → Render Static Site**
- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Required environment variable: `VITE_API_URL` — pointed at the deployed backend's `/api/` URL. Vite bakes this into the build at build time, so it must be set before the build runs, not read at runtime — changing it requires a fresh build, not just a restart
- **SPA routing**: configure a Rewrite rule under the static site's **Redirects/Rewrites** tab in the Render Dashboard — Source `/*`, Destination `/index.html`, Action **Rewrite**. Without this, refreshing (or a mobile browser reloading a backgrounded tab) on a client-side route like `/articles/12` hits Render's server directly and 404s, since there's no rewrite telling it to fall back to `index.html` and let React Router handle it.

---

## Project Structure

```
verinews/
├── apps/
│   ├── accounts/          # Custom user model, auth, password reset
│   ├── ai/                # Heuristic credibility/summarization/moderation analyzers
│   ├── api/                # Central REST API router
│   ├── comments/          # Article comments
│   ├── dashboard/         # Personal & moderator stats
│   ├── moderation_audit/  # Immutable moderator action log
│   ├── news/               # Articles, credibility reviews, voting
│   └── reports/            # Article reports
├── config/
│   ├── settings/
│   │   ├── base.py         # Shared settings
│   │   ├── dev.py          # Development overrides (SQLite, console/SMTP email)
│   │   └── prod.py         # Production overrides (Postgres, Resend email, security headers)
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── frontend/
│   ├── src/
│   │   ├── Components/     # UI components (auth, articles, moderation, admin, ai, ...)
│   │   ├── pages/           # Route-level pages
│   │   ├── routes/          # AppRoutes + role-based route guards
│   │   ├── api/              # Axios API client + per-domain request functions
│   │   ├── hooks/            # TanStack Query hooks
│   │   ├── context/          # Auth context
│   │   ├── constants/        # Shared constants (auth token key, event names)
│   │   └── types/            # Shared TypeScript types, matching backend serializer shapes
│   └── vite.config.ts
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── templates/               # Server-rendered templates (home page)
├── Dockerfile
├── docker-compose.yml
├── render.yaml
├── build.sh
└── manage.py
```

---

## Known Limitations & Future Improvements

**Known gaps in the current codebase:**
- `react-hook-form` and `zod` are installed but not wired into any form — either migrate the existing manual-`useState` forms to use them, or remove the unused dependencies
- No frontend automated test suite (Vitest/React Testing Library) — backend has full Django test coverage, frontend currently relies on `tsc` + manual QA

**Planned/considered features:**
- Post-registration email verification, done properly this time (an inactive-until-verified state, a verification email, and a confirmation endpoint) — deliberately not present today; see the [Security](#security) note above
- JWT authentication (as an alternative/complement to token auth)
- Real ML-based credibility scoring, trained on a labeled dataset, alongside the existing heuristic layer
- Real-time notifications for moderators (e.g., WebSocket-based)
- Social login (Google/GitHub)
- Richer user profiles
- Image uploads for article submissions
- Search relevance ranking (current search is exact substring matching on title/description)
- Analytics dashboard with historical trends, not just point-in-time stats

---

## Developer

VeriNews was designed and developed by **Hafiz Muhammad Ahmed** as a full-stack portfolio project demonstrating modern web development practices including Django, React, REST APIs, AI-assisted moderation, authentication, and responsive UI design.

---

## License

This project is licensed under the MIT License. See the [`LICENSE`](./LICENSE) file for details.

---

## Contributing

This is primarily a personal portfolio project, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes with clear messages
4. Open a pull request describing what changed and why

---

## Acknowledgements

- [Django](https://www.djangoproject.com/) and [Django REST Framework](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/) for OpenAPI documentation
- [Resend](https://resend.com/) and [django-anymail](https://anymail.dev/) for transactional email
- [React](https://react.dev/), [Vite](https://vitejs.dev/), and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query)
- [React Router](https://reactrouter.com/)
- [WhiteNoise](https://whitenoise.readthedocs.io/) for static file serving in production