from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, transaction
from django.shortcuts import get_object_or_404, redirect, render

from apps.news.models import NewsArticle

from .forms import ReportForm


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