from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import UpdateView, DeleteView

from apps.news.models import NewsArticle

from apps.moderation_audit.services import log_action
from apps.moderation_audit.models import ActionType

from .forms import CommentForm
from .models import Comment
from rest_framework import permissions, viewsets

from apps.api.permissions import IsOwnerOrStaffOrReadOnly

from .serializers import CommentSerializer
from drf_spectacular.utils import (
    OpenApiExample,
    extend_schema,
    extend_schema_view,
)

@login_required
def add_comment(request, article_pk):
    article = get_object_or_404(NewsArticle, pk=article_pk)

    if request.method == "POST":
        form = CommentForm(request.POST)

        if form.is_valid():
            comment = form.save(commit=False)
            comment.article = article
            comment.author = request.user
            comment.save()

    return redirect(article.get_absolute_url())


class CommentUpdateView(LoginRequiredMixin, UpdateView):
    model = Comment
    form_class = CommentForm
    template_name = "comments/comment_form.html"

    def get_queryset(self):
        return Comment.objects.filter(
            author=self.request.user
        )


class CommentDeleteView(LoginRequiredMixin, DeleteView):
    model = Comment
    template_name = "comments/comment_confirm_delete.html"

    def get_queryset(self):
        return Comment.objects.filter(
            author=self.request.user
        )

    def get_success_url(self):
        return self.object.article.get_absolute_url()

@extend_schema_view(
    list=extend_schema(
        description="List comments for news articles."
    ),
    create=extend_schema(
        description="Create a comment on an article.",
        examples=[
            OpenApiExample(
                "Comment example",
                value={
                    "article": 1,
                    "body": "This article provides useful information."
                },
                request_only=True,
            )
        ],
    ),
)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    permission_classes = [
    permissions.IsAuthenticatedOrReadOnly,
    IsOwnerOrStaffOrReadOnly,
]
    def get_queryset(self):
        queryset = Comment.objects.select_related(
            "article",
            "author",
            "moderation_flag",
        )

        # My comments filter
        if (
            self.request.query_params.get("mine") == "true"
            and self.request.user.is_authenticated
        ):
            queryset = queryset.filter(
                author=self.request.user
            )

        article_id = self.request.query_params.get("article")

        if article_id is not None and article_id.isdigit():
            queryset = queryset.filter(article_id=article_id)

        flagged_param = self.request.query_params.get("flagged")

        if flagged_param == "true":
            if (
                self.request.user.is_authenticated
                and self.request.user.is_staff
            ):
                queryset = queryset.filter(
                    moderation_flag__is_flagged=True
                )

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_destroy(self, instance):
        log_action(
            moderator=self.request.user,
            action=ActionType.DELETE,
            target=instance,
            reason="Comment deleted by moderator",
        )

        instance.delete()