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