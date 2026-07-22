from django.conf import settings
from django.db import models

from apps.news.models import NewsArticle
from django.urls import reverse

class Comment(models.Model):
    article = models.ForeignKey(
        NewsArticle,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    body = models.TextField(max_length=2000)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author} - {self.body[:40]}"

    def get_absolute_url(self):
        return reverse(
            "news:article_detail",
            kwargs={"pk": self.article_id}
        )