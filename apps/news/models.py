from django.conf import settings
from django.db import models
from django.urls import reverse


class NewsArticle(models.Model):
    class Category(models.TextChoices):
        POLITICS = "politics", "Politics"
        TECHNOLOGY = "technology", "Technology"
        HEALTH = "health", "Health"
        BUSINESS = "business", "Business"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending Review"
        VERIFIED = "verified", "Verified"
        DISPUTED = "disputed", "Disputed"
        FALSE = "false", "Marked False"

    title = models.CharField(max_length=255)

    source_url = models.URLField(
        help_text="Link to the original news source."
    )

    description = models.TextField(
        help_text="Summary or full text of the news item."
    )

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.OTHER,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    submitted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_articles",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("news:article_detail", kwargs={"pk": self.pk})