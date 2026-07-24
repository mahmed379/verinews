from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.accounts.factories import UserFactory
from apps.news.factories import NewsArticleFactory
from apps.reports.factories import ReportFactory

from django.contrib.admin.sites import AdminSite
from .admin import ReportAdmin

from .models import Report

from unittest.mock import patch

User = get_user_model()


class ReportTests(TestCase):

    def setUp(self):
        self.reporter = UserFactory(
            username="reporter",
            password="a-strong-test-password-1"
        )

        submitter = UserFactory(
            username="submitter",
            password="a-strong-test-password-1"
        )

        self.article = NewsArticleFactory(
            title="Reportable Article",
            source_url="https://example.com",
            description="Example description",
            submitted_by=submitter,
        )


    def test_authenticated_user_can_report(self):
        self.client.login(
            username="reporter",
            password="a-strong-test-password-1"
        )

        self.client.post(
            reverse(
                "reports:report_article",
                args=[self.article.pk]
            ),
            {
                "reason": Report.Reason.SPAM,
                "details": "Looks like spam.",
            },
        )

        report = Report.objects.get()

        self.assertEqual(
            report.reported_by,
            self.reporter
        )

        self.assertEqual(
            report.status,
            Report.Status.OPEN
        )


    def test_cannot_file_second_open_report(self):
        self.client.login(
            username="reporter",
            password="a-strong-test-password-1"
        )

        self.client.post(
            reverse(
                "reports:report_article",
                args=[self.article.pk]
            ),
            {
                "reason": Report.Reason.SPAM,
                "details": "",
            },
        )

        self.client.post(
            reverse(
                "reports:report_article",
                args=[self.article.pk]
            ),
            {
                "reason": Report.Reason.OFFENSIVE,
                "details": "",
            },
        )

        self.assertEqual(
            Report.objects.count(),
            1
        )


    def test_can_report_again_after_resolution(self):
        self.client.login(
            username="reporter",
            password="a-strong-test-password-1"
        )

        self.client.post(
            reverse(
                "reports:report_article",
                args=[self.article.pk]
            ),
            {
                "reason": Report.Reason.SPAM,
                "details": "",
            },
        )

        Report.objects.update(
            status=Report.Status.RESOLVED
        )

        self.client.post(
            reverse(
                "reports:report_article",
                args=[self.article.pk]
            ),
            {
                "reason": Report.Reason.DUPLICATE,
                "details": "",
            },
        )

        self.assertEqual(
            Report.objects.count(),
            2
        )

class ReportAdminActionTests(TestCase):

    def setUp(self):
        self.admin = ReportAdmin(
            model=Report,
            admin_site=AdminSite(),
        )

    @patch.object(ReportAdmin, "message_user")
    def test_mark_resolved_action_updates_status(self, mock_message_user):
        report = ReportFactory(
            status=Report.Status.OPEN,
        )

        queryset = Report.objects.filter(
            pk=report.pk,
        )

        self.admin.mark_resolved(
            request=None,
            queryset=queryset,
        )

        report.refresh_from_db()

        self.assertEqual(
            report.status,
            Report.Status.RESOLVED,
        )

        mock_message_user.assert_called_once()