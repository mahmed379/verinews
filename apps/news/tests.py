from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from apps.accounts.factories import StaffUserFactory, UserFactory
from apps.news.factories import NewsArticleFactory

from .models import NewsArticle

class NewsArticleTests(TestCase):
    def setUp(self):
        self.user = UserFactory(
            username="reporter",
            password="a-strong-test-password-1",
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
        NewsArticleFactory(
            title="Visible Article",
            source_url="https://example.com",
            description="desc",
            submitted_by=self.user,
        )
        

        response = self.client.get(reverse("news:article_list"))

        self.assertContains(response, "Visible Article")

class CredibilityWorkflowTests(TestCase):
    def setUp(self):
        self.author = UserFactory(
        username="author",
        password="a-strong-test-password-1",
    )

        self.moderator = StaffUserFactory(
            username="mod",
            password="a-strong-test-password-1",
        )

        self.article = NewsArticleFactory(
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

class SearchAndFilterTests(TestCase):
    def setUp(self):
        self.submitter = UserFactory(
            username="filteruser",
            password="a-strong-test-password-1",
        )

        self.article_a = NewsArticleFactory(
            title="Climate summit concludes",
            source_url="https://example.com/a",
            description="Leaders agreed on new targets.",
            submitted_by=self.submitter,
            category=NewsArticle.Category.POLITICS,
            status=NewsArticle.Status.VERIFIED,
        )

        self.article_b = NewsArticleFactory(
            title="New smartphone released",
            source_url="https://example.com/b",
            description="Tech company unveils new device.",
            submitted_by=self.submitter,
            category=NewsArticle.Category.TECHNOLOGY,
            status=NewsArticle.Status.PENDING,
        )

    def test_keyword_search_matches_title(self):
        response = self.client.get(
            reverse("news:article_list"),
            {"q": "climate"},
        )

        self.assertContains(response, "Climate summit concludes")
        self.assertNotContains(response, "New smartphone released")

    def test_keyword_search_matches_description(self):
        response = self.client.get(
            reverse("news:article_list"),
            {"q": "device"},
        )

        self.assertContains(response, "New smartphone released")

    def test_status_filter(self):
        response = self.client.get(
            reverse("news:article_list"),
            {"status": "verified"},
        )

        self.assertContains(response, "Climate summit concludes")
        self.assertNotContains(response, "New smartphone released")

    def test_category_filter(self):
        response = self.client.get(
            reverse("news:article_list"),
            {"category": "technology"},
        )

        self.assertContains(response, "New smartphone released")
        self.assertNotContains(response, "Climate summit concludes")

    def test_invalid_status_is_ignored_not_erroring(self):
        response = self.client.get(
            reverse("news:article_list"),
            {"status": "not_a_real_status"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Climate summit concludes")
        self.assertContains(response, "New smartphone released")

    def test_combined_filters(self):
        response = self.client.get(
            reverse("news:article_list"),
            {
                "q": "new",
                "category": "technology",
            },
        )

        self.assertContains(response, "New smartphone released")
        self.assertNotContains(response, "Climate summit concludes")


class ModerationQueueViewTests(TestCase):
    def test_non_staff_cannot_view_queue(self):
        user = UserFactory()
        self.client.force_login(user)

        response = self.client.get(
            reverse("news:moderation_queue")
        )

        self.assertEqual(response.status_code, 403)

    def test_queue_excludes_non_pending_articles(self):
        staff = StaffUserFactory()

        pending = NewsArticleFactory(
            status=NewsArticle.Status.PENDING
        )

        NewsArticleFactory(
            status=NewsArticle.Status.VERIFIED
        )

        self.client.force_login(staff)

        response = self.client.get(
            reverse("news:moderation_queue")
        )

        self.assertIn(
            pending,
            response.context["articles"],
        )

        self.assertEqual(
            len(response.context["articles"]),
            1,
        )