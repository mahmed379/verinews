from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from apps.comments.views import CommentViewSet
from apps.news.views import ArticleViewSet, VoteViewSet
from apps.reports.views import ReportViewSet

router = DefaultRouter()

router.register(
    "articles",
    ArticleViewSet,
    basename="article",
)

router.register(
    "votes",
    VoteViewSet,
    basename="vote",
)

router.register(
    "comments",
    CommentViewSet,
    basename="comment",
)

router.register(
    "reports",
    ReportViewSet,
    basename="report",
)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "auth-token/",
        obtain_auth_token,
        name="api_token_auth",
    ),
]