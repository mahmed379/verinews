from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

from apps.comments.views import CommentViewSet
from apps.news.views import ArticleViewSet, VoteViewSet
from apps.reports.views import ReportViewSet

from apps.dashboard.views import DashboardStatsAPIView

from apps.accounts.views import UserListAPIView

from apps.accounts.views import (
    RegisterAPIView,
    LoginAPIView,
    VerifyEmailAPIView,
    MeAPIView,
    LogoutAPIView,
    PasswordResetAPIView,
    PasswordResetConfirmAPIView,
)

from apps.accounts.views import (
    RegisterAPIView,
    VerifyEmailAPIView,
    MeAPIView,
    LogoutAPIView,
    PasswordResetAPIView,
    PasswordResetConfirmAPIView,
)

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
        "dashboard/stats/",
        DashboardStatsAPIView.as_view(),
        name="dashboard_stats",
    ),

    path(
        "auth-token/",
        obtain_auth_token,
        name="api_token_auth",
    ),

    path(
        "auth/register/",
        RegisterAPIView.as_view(),
        name="api_register",
    ),

    path(
        "auth/login/",
        LoginAPIView.as_view(),
        name="api_login",
    ),

    path(
        "auth/verify-email/<uid>/<token>/",
        VerifyEmailAPIView.as_view(),
        name="api_verify_email",
    ),

    path(
        "auth/logout/",
        LogoutAPIView.as_view(),
        name="api_logout",
    ),

    path(
        "auth/password-reset/",
        PasswordResetAPIView.as_view(),
        name="api_password_reset",
    ),

    path(
        "auth/password-reset-confirm/",
        PasswordResetConfirmAPIView.as_view(),
        name="api_password_reset_confirm",
    ),
    
    path(
        "users/me/",
        MeAPIView.as_view(),
        name="api_me",
    ),

    path("users/", UserListAPIView.as_view(), name="api_user_list"),
  
]