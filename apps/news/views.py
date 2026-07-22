from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import get_object_or_404, redirect, render
from django.views.generic import ListView, DetailView, CreateView

from .forms import NewsSubmissionForm, StatusChangeForm
from .models import NewsArticle, CredibilityReview

class ArticleListView(ListView):
    model = NewsArticle
    template_name = "news/article_list.html"
    context_object_name = "articles"
    paginate_by = 10


class ArticleDetailView(DetailView):
    model = NewsArticle
    template_name = "news/article_detail.html"
    context_object_name = "article"


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