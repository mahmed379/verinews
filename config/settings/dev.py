"""
Development settings.

Run with: DJANGO_SETTINGS_MODULE=config.settings.dev (this is already
set as the default in manage.py, so normally you don't type this).
"""

from .base import *  # noqa: F401,F403  (star import is the standard Django pattern here)

DEBUG = True

# In development we trust localhost only. No need for real domains yet.
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# SQLite: a single file on disk, zero setup. Perfect for development
# and for running the test suite quickly. We will swap this for
# PostgreSQL in prod.py without touching a single model — that's the
# point of Django's database abstraction.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# Django's default password hasher (PBKDF2) is secure but intentionally
# slow, which makes test suites sluggish. This is fine for a small
# project; we leave it as-is so dev behaves like prod. (If VeriNews's
# test suite grows large later, a faster hasher can be added here.)

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
