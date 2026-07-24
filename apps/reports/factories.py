import factory

from apps.accounts.factories import UserFactory
from apps.news.factories import NewsArticleFactory
from .models import Report


class ReportFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Report

    article = factory.SubFactory(
        NewsArticleFactory
    )

    reported_by = factory.SubFactory(
        UserFactory
    )

    reason = Report.Reason.SPAM

    details = "Factory generated report."