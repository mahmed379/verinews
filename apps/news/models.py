from django.db import models
from django.conf import settings
from django.urls import reverse
from django.core.validators import MaxValueValidator, MinValueValidator


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
    
class CredibilityReview(models.Model):
    """
    Stores every status change made by a moderator.
    """

    article = models.ForeignKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="review_history",
    )

    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="reviews_made",
    )

    previous_status = models.CharField(
        max_length=20,
        choices=NewsArticle.Status.choices,
    )

    new_status = models.CharField(
        max_length=20,
        choices=NewsArticle.Status.choices,
    )

    reason = models.TextField(
        help_text="Why the status was changed."
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.article.title}: {self.previous_status} -> {self.new_status}"

class Vote(models.Model):
    """
    One credibility rating (1-5) from one user on one article.
    A user can only have one vote per article.
    """

    article = models.ForeignKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="votes",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes_cast",
    )

    rating = models.PositiveSmallIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        help_text="1 = not credible, 5 = highly credible",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["article", "user"],
                name="one_vote_per_user_per_article",
            )
        ]


    def __str__(self):
        return f"{self.user} rated {self.article} = {self.rating}"