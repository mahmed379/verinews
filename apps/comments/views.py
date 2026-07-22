from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect
from django.views.generic import UpdateView, DeleteView

from apps.news.models import NewsArticle

from .forms import CommentForm
from .models import Comment


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