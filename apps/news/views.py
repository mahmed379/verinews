from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView

from .forms import NewsSubmissionForm
from .models import NewsArticle


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