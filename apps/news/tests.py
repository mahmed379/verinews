from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import NewsArticle

User = get_user_model()


class NewsArticleTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="reporter",
            password="a-strong-test-password-1"
        )

    def test_anonymous_user_cannot_submit(self):
        response = self.client.get(reverse("news:article_submit"))
        self.assertEqual(response.status_code, 302)

    def test_logged_in_user_can_submit_article(self):
        self.client.login(
            username="reporter",
            password="a-strong-test-password-1"
        )

        response = self.client.post(
            reverse("news:article_submit"),
            {
                "title": "Test Headline",
                "source_url": "https://example.com/story",
                "description": "A test description.",
                "category": NewsArticle.Category.TECHNOLOGY,
            },
        )

        article = NewsArticle.objects.get()

        self.assertRedirects(response, article.get_absolute_url())
        self.assertEqual(article.submitted_by, self.user)
        self.assertEqual(article.status, NewsArticle.Status.PENDING)

    def test_article_list_shows_submitted_article(self):
        NewsArticle.objects.create(
            title="Visible Article",
            source_url="https://example.com",
            description="desc",
            submitted_by=self.user,
        )

        response = self.client.get(reverse("news:article_list"))

        self.assertContains(response, "Visible Article")