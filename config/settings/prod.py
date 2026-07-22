"""
Production settings.

Everything here is driven by environment variables, because production
config should never be hardcoded into source control. We'll walk
through actually deploying with these in the Deployment milestone —
for now, this file just establishes the pattern.
"""

import os

from .base import *  # noqa: F401,F403

DEBUG = False

# No fallback here on purpose: if DJANGO_SECRET_KEY isn't set in the
# production environment, we WANT the app to crash on startup rather
# than silently run with the insecure dev key from base.py.
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]

# Comma-separated list in the environment, e.g. "verinews.com,www.verinews.com"
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(",")

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}

# --- Production hardening (Django's built-in security middleware reads these) ---
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
X_FRAME_OPTIONS = "DENY"
