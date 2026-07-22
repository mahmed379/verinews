from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import render, redirect, get_object_or_404

from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required

from django.views.generic import ListView, DetailView, CreateView

from django.db.models import Avg, Count

from .forms import NewsSubmissionForm, StatusChangeForm, VoteForm
from .models import NewsArticle, CredibilityReview, Vote

class ArticleListView(ListView):
    model = NewsArticle
    template_name = "news/article_list.html"
    context_object_name = "articles"
    paginate_by = 10


class ArticleDetailView(DetailView):
    model = NewsArticle
    template_name = "news/article_detail.html"
    context_object_name = "article"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        score = self.object.votes.aggregate(
            average=Avg("rating"),
            count=Count("id")
        )

        average_rating = score["average"]

        context["average_rating"] = average_rating
        context["vote_count"] = score["count"]

        context["average_rating_percent"] = (
            round((average_rating / 5) * 100)
            if average_rating is not None
            else None
        )

        if self.request.user.is_authenticated:
            existing_vote = Vote.objects.filter(
                article=self.object,
                user=self.request.user
            ).first()

            context["vote_form"] = VoteForm(
                instance=existing_vote
            )

        return context


class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = NewsArticle
    form_class = NewsSubmissionForm
    template_name = "news/article_form.html"
    login_url = "login"

    def form_valid(self, form):
        form.instance.submitted_by = self.request.user
        return super().form_valid(form)
class StaffRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff


class ModerationQueueView(LoginRequiredMixin, StaffRequiredMixin, ListView):
    model = NewsArticle
    template_name = "news/moderation_queue.html"
    context_object_name = "articles"

    def get_queryset(self):
        return NewsArticle.objects.filter(
            status=NewsArticle.Status.PENDING
        )


def review_article(request, pk):
    article = get_object_or_404(NewsArticle, pk=pk)

    if not request.user.is_authenticated or not request.user.is_staff:
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied

    if request.method == "POST":
        form = StatusChangeForm(
            request.POST,
            current_status=article.status
        )

        if form.is_valid():
            new_status = form.cleaned_data["new_status"]
            reason = form.cleaned_data["reason"]

            CredibilityReview.objects.create(
                article=article,
                reviewed_by=request.user,
                previous_status=article.status,
                new_status=new_status,
                reason=reason,
            )

            article.status = new_status
            article.save()

            return redirect(article.get_absolute_url())

    else:
        form = StatusChangeForm(
            current_status=article.status
        )

    return render(
        request,
        "news/status_change_form.html",
        {
            "form": form,
            "article": article,
        }
    )

class StaffRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff


class ModerationQueueView(LoginRequiredMixin, StaffRequiredMixin, ListView):
    model = NewsArticle
    template_name = "news/moderation_queue.html"
    context_object_name = "articles"

    def get_queryset(self):
        return NewsArticle.objects.filter(
            status=NewsArticle.Status.PENDING
        )


def review_article(request, pk):
    article = get_object_or_404(NewsArticle, pk=pk)

    if not request.user.is_authenticated or not request.user.is_staff:
        from django.core.exceptions import PermissionDenied
        raise PermissionDenied

    if request.method == "POST":
        form = StatusChangeForm(
            request.POST,
            current_status=article.status
        )

        if form.is_valid():
            new_status = form.cleaned_data["new_status"]
            reason = form.cleaned_data["reason"]

            CredibilityReview.objects.create(
                article=article,
                reviewed_by=request.user,
                previous_status=article.status,
                new_status=new_status,
                reason=reason,
            )

            article.status = new_status
            article.save()

            return redirect(article.get_absolute_url())

    else:
        form = StatusChangeForm(
            current_status=article.status
        )

    return render(
        request,
        "news/status_change_form.html",
        {
            "form": form,
            "article": article,
        }
    )

@login_required
def cast_vote(request, pk):
    article = get_object_or_404(NewsArticle, pk=pk)

    if request.method == "POST":
        form = VoteForm(request.POST)
        if form.is_valid():
            Vote.objects.update_or_create(
                article=article,
                user=request.user,
                defaults={
                    "rating": form.cleaned_data["rating"]
                },
            )

    return redirect(article.get_absolute_url())