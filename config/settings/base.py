"""
Base settings for VeriNews.

Every setting that is the SAME in development and production lives here.
dev.py and prod.py both start with `from .base import *` and then
override or add only what differs (database, DEBUG, allowed hosts...).

Why do it this way?
--------------------
If we kept one settings.py and toggled DEBUG by hand before deploying,
it's easy to forget and accidentally ship DEBUG=True to production
(a serious security hole — it leaks source code and settings in error
pages). Splitting settings by environment means the *file you choose
to run* decides the environment, not a value you might forget to flip.
"""

import os
import sys
from pathlib import Path

# BASE_DIR points at the project root (the folder containing manage.py).
# We use it to build every other path (templates, static files, the
# SQLite database) so the project works no matter where it's checked out.
# .parent three times because this file is config/settings/base.py:
#   base.py -> settings/ -> config/ -> project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Our own apps live in apps/, e.g. apps/accounts, apps/news.
# Adding this folder to sys.path lets us write INSTALLED_APPS entries
# and imports as "accounts", "news" instead of "apps.accounts",
# "apps.news" — shorter, and matches Django's own tutorials/docs.
sys.path.insert(0, str(BASE_DIR / "apps"))

# SECURITY WARNING: keep this secret in production!
# We read it from an environment variable with a fallback so the
# project runs out-of-the-box in development. In prod.py we will make
# the environment variable REQUIRED (no fallback) — see that file.
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-only-key-change-me",
)

# ALLOWED_HOSTS is deliberately left empty here — dev.py and prod.py
# each set an appropriate value, because "which hosts may serve this
# site" is inherently an environment-specific decision.
ALLOWED_HOSTS = []

# --- Application definition -------------------------------------------------

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    # We'll add "rest_framework" here in the REST API milestone.
]

LOCAL_APPS = [
    # Our own apps go here as we build them, e.g. "accounts", "news".
      "apps.accounts",
      "apps.news",
      "apps.comments",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # We keep one project-wide templates/ folder (for base.html,
        # navbar, etc.) IN ADDITION to each app's own templates/<app>/
        # folder (which Django finds automatically via APP_DIRS=True).
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --- Password validation -----------------------------------------------------
# These run whenever a user sets/changes a password (including in our
# future registration form). Built into Django — no extra packages needed.
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --- Internationalization -----------------------------------------------------
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# --- Static & media files -----------------------------------------------------
STATIC_URL = "static/"
# Extra folders (besides each app's static/) that Django should look in
# during development. In production, `collectstatic` gathers everything
# from here + all apps into STATIC_ROOT.
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "accounts.User"
