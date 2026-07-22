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

urlpatterns = [
    path("admin/", admin.site.urls),

    # Accounts app URLs
    path("", include("apps.accounts.urls")),

    # News app URLs
    path("news/", include("apps.news.urls")),

    # Temporary homepage
    path("", TemplateView.as_view(template_name="home.html"), name="home"),
]