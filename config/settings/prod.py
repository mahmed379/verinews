"""
Production settings — configured for deployment on Render,
with managed PostgreSQL.
"""

import os
from urllib.parse import urlparse

from .base import *  # noqa: F401,F403


DEBUG = False

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]


# Render hostname + optional custom domains
ALLOWED_HOSTS = [
    h for h in [
        os.environ.get("RENDER_EXTERNAL_HOSTNAME"),
        *os.environ.get("DJANGO_ALLOWED_HOSTS", "").split(","),
    ]
    if h
]


# Render provides one DATABASE_URL string.
db_url = urlparse(os.environ["DATABASE_URL"])

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": db_url.path.lstrip("/"),
        "USER": db_url.username,
        "PASSWORD": db_url.password,
        "HOST": db_url.hostname,
        "PORT": db_url.port or "5432",
    }
}


# WhiteNoise static files
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}


# HTTPS / proxy configuration for Render
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

X_FRAME_OPTIONS = "DENY"


# Allow POST requests from deployed domain
CSRF_TRUSTED_ORIGINS = [
    f"https://{h}" for h in ALLOWED_HOSTS
]