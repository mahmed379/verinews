from django.urls import path

from . import views

app_name = "reports"

urlpatterns = [
    path(
        "article/<int:article_pk>/report/",
        views.report_article,
        name="report_article",
    ),
]