from django.db import models

from apps.news.models import NewsArticle


class AIAnalysis(models.Model):
    class RiskLevel(models.TextChoices):
        LOW = "low", "Low Risk"
        MEDIUM = "medium", "Medium Risk"
        HIGH = "high", "High Risk"

    article = models.OneToOneField(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="ai_analysis",
    )

    score = models.PositiveSmallIntegerField()

    risk_level = models.CharField(
        max_length=10,
        choices=RiskLevel.choices,
    )

    factors = models.JSONField(default=list)

    suggested_steps = models.JSONField(default=list)

    analyzer_version = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"AI analysis for {self.article} — "
            f"{self.score}/100 ({self.risk_level})"
        )


class ArticleSummary(models.Model):
    article = models.OneToOneField(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="ai_summary",
    )

    summary = models.TextField()

    key_points = models.JSONField(default=list)

    claims = models.JSONField(default=list)

    summarizer_version = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary for {self.article}"

class CommentModerationFlag(models.Model):
    comment = models.OneToOneField(
        "comments.Comment",
        on_delete=models.CASCADE,
        related_name="moderation_flag",
    )

    is_flagged = models.BooleanField()

    score = models.PositiveSmallIntegerField()

    reasons = models.JSONField(default=list)

    flagger_version = models.CharField(
        max_length=50
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return (
            f"Moderation flag for comment "
            f"#{self.comment_id} ({self.score})"
        )



class ReportModerationFlag(models.Model):
    report = models.OneToOneField(
        "reports.Report",
        on_delete=models.CASCADE,
        related_name="moderation_flag",
    )

    is_flagged = models.BooleanField()

    score = models.PositiveSmallIntegerField()

    reasons = models.JSONField(default=list)

    flagger_version = models.CharField(
        max_length=50
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )


    def __str__(self):
        return (
            f"Moderation flag for report "
            f"#{self.report_id} ({self.score})"
        )