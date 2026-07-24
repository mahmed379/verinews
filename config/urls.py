"""
Root URL configuration for VeriNews.

This file only WIRES things together — it should stay short. As we add
apps (accounts, news, ...), each app gets its own urls.py, and we
include() it here with a path prefix. Keeping routing logic inside
each app (instead of one giant file) is what makes apps "reusable":
the news app doesn't need to know it's mounted at /news/, and could be
mounted anywhere.
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.http import HttpResponse

urlpatterns = [
    path("admin/", admin.site.urls),

    # Homepage
    path("", TemplateView.as_view(template_name="home.html"), name="home"),

    # Accounts
    path("", include("apps.accounts.urls")),

    # News
    path("news/", include("apps.news.urls")),

    # Comments
    path("comments/", include("apps.comments.urls")),
    # reports
    path("reports/", include("apps.reports.urls")),
    #dashboard
    path("dashboard/", include("apps.dashboard.urls")),

    #api
    path("api/", include("apps.api.urls")),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),

    path("api/docs/",SpectacularSwaggerView.as_view(url_name="schema"),name="swagger-ui",),

    path("api/redoc/",SpectacularRedocView.as_view(url_name="schema"),name="redoc",),

    path("healthz/", lambda request: HttpResponse("ok"), name="health_check"),
]