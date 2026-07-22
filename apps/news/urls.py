from django.urls import path

from . import views

app_name = "news"

urlpatterns = [
    path("", views.ArticleListView.as_view(), name="article_list"),
    path("submit/", views.ArticleCreateView.as_view(), name="article_submit"),
    path("<int:pk>/", views.ArticleDetailView.as_view(), name="article_detail"),
]
