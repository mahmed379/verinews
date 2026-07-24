import factory

from apps.accounts.factories import UserFactory
from .models import (
    NewsArticle,
    Vote,
    CredibilityReview,
)


class NewsArticleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = NewsArticle

    title = factory.Sequence(
        lambda n: f"Test Article {n}"
    )

    source_url = factory.Sequence(
        lambda n: f"https://example.com/article-{n}"
    )

    description = factory.Sequence(
        lambda n: f"Test article description {n}."
    )

    category = NewsArticle.Category.OTHER

    status = NewsArticle.Status.PENDING

    submitted_by = factory.SubFactory(UserFactory)


class VoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Vote

    article = factory.SubFactory(
        NewsArticleFactory
    )

    user = factory.SubFactory(
        UserFactory
    )

    rating = 3


class CredibilityReviewFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = CredibilityReview

    article = factory.SubFactory(
        NewsArticleFactory
    )

    reviewed_by = factory.SubFactory(
        UserFactory
    )

    previous_status = NewsArticle.Status.PENDING

    new_status = NewsArticle.Status.VERIFIED

    reason = "Confirmed through factory."