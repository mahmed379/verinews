from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

from apps.news.models import CredibilityReview, NewsArticle
from apps.reports.models import Report


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user

        # Personal data

        submissions = user.submitted_articles.order_by("-created_at")

        context["submissions"] = submissions
        context["submission_counts"] = {
            "pending": submissions.filter(
                status=NewsArticle.Status.PENDING
            ).count(),

            "verified": submissions.filter(
                status=NewsArticle.Status.VERIFIED
            ).count(),

            "disputed": submissions.filter(
                status=NewsArticle.Status.DISPUTED
            ).count(),

            "false": submissions.filter(
                status=NewsArticle.Status.FALSE
            ).count(),
        }

        votes = user.votes_cast.select_related(
            "article"
        ).order_by("-updated_at")

        context["votes"] = votes[:10]
        context["vote_count"] = votes.count()

        comments = user.comments.select_related("article").order_by("-created_at")

        context["comments"] = comments[:10]

        reports = user.reports_filed.select_related(
            "article"
        ).order_by("-created_at")

        context["reports"] = reports[:10]
        context["report_count"] = reports.count()


        # Staff data

        if user.is_staff:

            context["pending_review_count"] = NewsArticle.objects.filter(
                status=NewsArticle.Status.PENDING
            ).count()

            context["open_report_count"] = Report.objects.filter(
                status=Report.Status.OPEN
            ).count()

            context["total_articles"] = NewsArticle.objects.count()

            context["total_users"] = user.__class__.objects.count()

            context["recent_reviews"] = CredibilityReview.objects.select_related(
                "article",
                "reviewed_by"
            ).order_by("-created_at")[:10]

        return context