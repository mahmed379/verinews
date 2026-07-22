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

class CredibilityWorkflowTests(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(
            username="author",
            password="a-strong-test-password-1"
        )

        self.moderator = User.objects.create_user(
            username="mod",
            password="a-strong-test-password-1",
            is_staff=True
        )

        self.article = NewsArticle.objects.create(
            title="Needs Review",
            source_url="https://example.com",
            description="desc",
            submitted_by=self.author,
        )

    def test_non_staff_cannot_review(self):
        self.client.login(
            username="author",
            password="a-strong-test-password-1"
        )

        response = self.client.get(
            reverse("news:article_review", args=[self.article.pk])
        )

        self.assertEqual(response.status_code, 403)

    def test_staff_can_change_status_and_creates_audit_log(self):
        self.client.login(
            username="mod",
            password="a-strong-test-password-1"
        )

        response = self.client.post(
            reverse("news:article_review", args=[self.article.pk]),
            {
                "new_status": NewsArticle.Status.VERIFIED,
                "reason": "Confirmed with sources."
            },
        )

        self.article.refresh_from_db()

        self.assertEqual(
            self.article.status,
            NewsArticle.Status.VERIFIED
        )

        review = self.article.review_history.get()

        self.assertEqual(
            review.previous_status,
            NewsArticle.Status.PENDING
        )

        self.assertEqual(
            review.reviewed_by,
            self.moderator
        )

    def test_cannot_set_same_status(self):
        self.client.login(
            username="mod",
            password="a-strong-test-password-1"
        )

        response = self.client.post(
            reverse("news:article_review", args=[self.article.pk]),
            {
                "new_status": NewsArticle.Status.PENDING,
                "reason": "no change"
            },
        )

        self.assertEqual(
            self.article.review_history.count(),
            0
        )