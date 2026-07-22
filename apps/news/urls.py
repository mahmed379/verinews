from django.urls import path

from . import views

app_name = "news"

urlpatterns = [
    path("", views.ArticleListView.as_view(), name="article_list"),
    path("submit/", views.ArticleCreateView.as_view(), name="article_submit"),
    path("<int:pk>/", views.ArticleDetailView.as_view(), name="article_detail"),
    path("moderate/", views.ModerationQueueView.as_view(), name="moderation_queue"),
    path("<int:pk>/review/", views.review_article, name="article_review"),
    path("<int:pk>/vote/", views.cast_vote, name="article_vote"),
]
