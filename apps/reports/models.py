from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.news.models import NewsArticle


class Report(models.Model):
    class Reason(models.TextChoices):
        SPAM = "spam", "Spam"
        MISLEADING = "misleading", "Misleading"
        DUPLICATE = "duplicate", "Duplicate"
        OFFENSIVE = "offensive", "Offensive"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        RESOLVED = "resolved", "Resolved"
        DISMISSED = "dismissed", "Dismissed"

    article = models.ForeignKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="reports",
    )

    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reports_filed",
    )

    reason = models.CharField(
        max_length=20,
        choices=Reason.choices,
    )

    details = models.TextField(
        blank=True,
        help_text="Optional: any extra context for the moderators.",
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["article", "reported_by"],
                condition=Q(status="open"),
                name="one_open_report_per_user_per_article",
            )
        ]

    def __str__(self):
        return f"{self.get_reason_display()} report on {self.article} by {self.reported_by}"