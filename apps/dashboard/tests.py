from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.accounts.factories import UserFactory
from apps.news.factories import NewsArticleFactory
from apps.reports.factories import ReportFactory

from apps.reports.models import Report

User = get_user_model()


class DashboardTests(TestCase):
    def setUp(self):
        self.user = UserFactory(
            username="dashuser",
            password="testpassword123",
        )

        self.staff = UserFactory(
            username="staffuser",
            password="testpassword123",
            is_staff=True,
        )

        self.article = NewsArticleFactory(
            title="Dashboard Test Article",
            source_url="https://example.com",
            description="Test article",
            submitted_by=self.user,
        )

    def test_anonymous_user_redirected_to_login(self):
        response = self.client.get(reverse("dashboard:dashboard"))
        self.assertEqual(response.status_code, 302)

    def test_regular_user_can_view_dashboard(self):
        self.client.login(
            username="dashuser",
            password="testpassword123",
        )

        response = self.client.get(reverse("dashboard:dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "My Submissions")
        self.assertNotContains(response, "Staff Overview")

    def test_staff_user_sees_staff_overview(self):
        self.client.login(
            username="staffuser",
            password="testpassword123",
        )

        response = self.client.get(reverse("dashboard:dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Staff Overview")

    def test_dashboard_shows_report(self):
        ReportFactory(
            article=self.article,
            reported_by=self.user,
            reason=Report.Reason.SPAM,
        )

        self.client.login(
            username="dashuser",
            password="testpassword123",
        )

        response = self.client.get(reverse("dashboard:dashboard"))

        self.assertContains(response, "Spam")