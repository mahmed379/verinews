from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.shortcuts import render, redirect, get_object_or_404

from django.contrib.auth.decorators import login_required

from django.views.generic import ListView, DetailView, CreateView


from .forms import NewsSubmissionForm, StatusChangeForm, VoteForm
from .models import NewsArticle, CredibilityReview, Vote
from django.db import models
from django.db.models import Avg, Count, Q

from drf_spectacular.utils import (
    OpenApiExample,
    extend_schema,
    extend_schema_view,
)

from rest_framework import (
    mixins,
    permissions,
    viewsets,
)
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.api.permissions import IsStaffOrReadOnly, IsSuperUser

from .serializers import (
    NewsArticleSerializer,
    StatusChangeSerializer,
    VoteSerializer,
)


class ArticleListView(ListView):
    model = NewsArticle
    template_name = "news/article_list.html"
    context_object_name = "articles"
    paginate_by = 10

    def get_queryset(self):
        queryset = NewsArticle.objects.annotate(
            average_rating=Avg("votes__rating"),
            vote_count=Count("votes"),
        )

        # Keyword search
        query = self.request.GET.get("q", "").strip()
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            )

        # Status filter
        status = self.request.GET.get("status", "")
        valid_statuses = NewsArticle.Status.values
        if status in valid_statuses:
            queryset = queryset.filter(status=status)

        # Category filter
        category = self.request.GET.get("category", "")
        valid_categories = NewsArticle.Category.values
        if category in valid_categories:
            queryset = queryset.filter(category=category)

       # Sorting
        sort = self.request.GET.get("sort", "newest")

        if sort == "oldest":
            queryset = queryset.order_by("created_at")
        elif sort == "top_rated":
            queryset = queryset.order_by(
                models.F("average_rating").desc(nulls_last=True)
            )
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["current_query"] = self.request.GET.get("q", "")
        context["current_status"] = self.request.GET.get("status", "")
        context["current_category"] = self.request.GET.get("category", "")
        context["current_sort"] = self.request.GET.get("sort", "newest")

        context["status_choices"] = NewsArticle.Status.choices
        context["category_choices"] = NewsArticle.Category.choices

        # Preserve filters when changing pages
        querydict = self.request.GET.copy()
        querydict.pop("page", None)
        context["querystring"] = querydict.urlencode()

        return context

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
    login_url = "accounts:login"

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

@extend_schema_view(
    list=extend_schema(
        description="List all news articles."
    ),
    retrieve=extend_schema(
        description="Retrieve a single news article with credibility information."
    ),
    create=extend_schema(
        description="Submit a new article. Authentication required.",
        examples=[
            OpenApiExample(
                "Article submission example",
                value={
                    "title": "City council approves new park funding",
                    "description": "The council approved funding for new parks.",
                    "category": "politics",
                    "source_url": "https://example.com/news"
                },
                request_only=True,
            )
        ],
    ),
)

class ArticleViewSet(viewsets.ModelViewSet):

    serializer_class = NewsArticleSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        return NewsArticle.objects.annotate(
            average_rating=Avg("votes__rating"),
            vote_count=Count("votes"),
        )

    def perform_create(self, serializer):
        serializer.save(
            submitted_by=self.request.user
        )

    def get_permissions(self):

        if self.action == "destroy":
            return [IsSuperUser()]

        return super().get_permissions()

    @extend_schema(
        description=(
        "Staff-only action. Changes article credibility status "
        "and records the reason in review history."
        ),
        examples=[
            OpenApiExample(
            "Mark article as verified",
                value={
                    "new_status": "verified",
                    "reason": "Confirmed using multiple independent sources."
                 },
             request_only=True,
            )
        ],
    )

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsStaffOrReadOnly]
    )
    def review(self, request, pk=None):

        article = self.get_object()

        serializer = StatusChangeSerializer(
            data=request.data,
            context={
                "current_status": article.status
            }
        )

        serializer.is_valid(
            raise_exception=True
        )

        CredibilityReview.objects.create(
            article=article,
            reviewed_by=request.user,
            previous_status=article.status,
            new_status=serializer.validated_data["new_status"],
            reason=serializer.validated_data["reason"],
        )

        article.status = serializer.validated_data["new_status"]
        article.save()

        return Response(
            NewsArticleSerializer(article).data
        )

@extend_schema_view(
    list=extend_schema(
        description="List credibility votes."
    ),
    create=extend_schema(
        description="Submit or update your credibility rating for an article.",
        examples=[
            OpenApiExample(
                "Vote example",
                value={
                    "article": 1,
                    "rating": 5
                },
                request_only=True,
            )
        ],
    ),
)

class VoteViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
):
    serializer_class = VoteSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return Vote.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):
        Vote.objects.update_or_create(
            article=serializer.validated_data["article"],
            user=self.request.user,
            defaults={
                "rating": serializer.validated_data["rating"]
            },
        )
    