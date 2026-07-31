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
# Allow requests from the deployed frontend
frontend_url = os.environ.get("FRONTEND_URL")

if frontend_url:
    CORS_ALLOWED_ORIGINS = [frontend_url]
else:
    CORS_ALLOWED_ORIGINS = []


# Email configuration (SMTP)
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = os.environ.get("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS", "True") == "True"

EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = os.environ.get(
    "DEFAULT_FROM_EMAIL",
    EMAIL_HOST_USER
)