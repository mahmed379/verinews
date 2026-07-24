import factory

from apps.accounts.factories import UserFactory
from apps.news.factories import NewsArticleFactory
from .models import Comment


class CommentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Comment

    article = factory.SubFactory(
        NewsArticleFactory
    )

    author = factory.SubFactory(
        UserFactory
    )

    body = factory.Sequence(
        lambda n: f"Test comment {n}"
    )