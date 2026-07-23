from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404, redirect, render

from apps.news.models import NewsArticle

from .forms import ReportForm
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from .models import Report
from .serializers import ReportSerializer

from drf_spectacular.utils import (
    OpenApiExample,
    extend_schema,
    extend_schema_view,
)

@login_required
def report_article(request, article_pk):
    article = get_object_or_404(NewsArticle, pk=article_pk)

    if request.method == "POST":
        form = ReportForm(request.POST)

        if form.is_valid():
            report = form.save(commit=False)
            report.article = article
            report.reported_by = request.user

            try:
                with transaction.atomic():
                    report.save()

            except IntegrityError:
                messages.warning(
                    request,
                    "You already have an open report on this article. "
        "            A moderator will review it.",
                )

            else:
                messages.success(
                    request,
                    "Thanks — this article has been reported for review."
                )

            return redirect(article.get_absolute_url())

    else:
        form = ReportForm()

    return render(
        request,
        "reports/report_form.html",
        {
            "form": form,
            "article": article,
        },
    )

@extend_schema_view(
    list=extend_schema(
        description="List reports submitted by the authenticated user."
    ),
    retrieve=extend_schema(
        description="Retrieve a single report."
    ),
    create=extend_schema(
        description="Report a news article with a reason.",
        examples=[
            OpenApiExample(
                "Report example",
                value={
                    "article": 1,
                    "reason": "misleading"
                },
                request_only=True,
            )
        ],
    ),
    update=extend_schema(
        description="Update a report."
    ),
    partial_update=extend_schema(
        description="Partially update a report."
    ),
    destroy=extend_schema(
        description="Delete a report."
    ),
)

class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Report.objects.filter(
            reported_by=self.request.user
        )

    def perform_create(self, serializer):
        try:
            serializer.save(
                reported_by=self.request.user
            )

        except IntegrityError:
            raise ValidationError(
                "You already have an open report on this article."
            )