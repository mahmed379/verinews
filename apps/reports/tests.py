from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.news.models import NewsArticle

from .models import Report


User = get_user_model()


class ReportTests(TestCase):

    def setUp(self):
        self.reporter = User.objects.create_user(
            username="reporter",
            password="a-strong-test-password-1"
        )

        submitter = User.objects.create_user(
            username="submitter",
            password="a-strong-test-password-1"
        )

        self.article = NewsArticle.objects.create(
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