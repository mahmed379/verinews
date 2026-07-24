from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.accounts.factories import UserFactory
from apps.news.factories import NewsArticleFactory
from apps.comments.factories import CommentFactory

from .models import Comment

User = get_user_model()


class CommentTests(TestCase):

    def setUp(self):
        self.author = UserFactory(
            username="commenter",
            password="testpassword123",
        )

        self.other_user = UserFactory(
            username="other",
            password="testpassword123",
        )

        submitter = UserFactory(
            username="submitter",
            password="testpassword123"
        )

        self.article = NewsArticleFactory(
            title="Test Article",
            source_url="https://example.com",
            description="Testing comments",
            submitted_by=submitter,
        )


    def test_authenticated_user_can_comment(self):
        self.client.login(
            username="commenter",
            password="testpassword123"
        )

        response = self.client.post(
            reverse("comments:add_comment", args=[self.article.pk]),
            {
                "body": "Good article"
            }
        )

        self.assertEqual(response.status_code, 302)

        comment = Comment.objects.first()

        self.assertEqual(comment.author, self.author)
        self.assertEqual(comment.article, self.article)


    def test_author_can_edit_comment(self):
        comment = CommentFactory(
            article=self.article,
            author=self.author,
            body="Old comment"
        )

        self.client.login(
            username="commenter",
            password="testpassword123"
        )

        self.client.post(
            reverse(
                "comments:comment_edit",
                args=[comment.pk]
            ),
            {
                "body": "Updated comment"
            }
        )

        comment.refresh_from_db()

        self.assertEqual(
            comment.body,
            "Updated comment"
        )


    def test_other_user_cannot_edit_comment(self):

        comment = CommentFactory(
            article=self.article,
            author=self.author,
            body="Private comment"
        )

        self.client.login(
            username="other",
            password="testpassword123"
        )

        response = self.client.get(
            reverse(
                "comments:comment_edit",
                args=[comment.pk]
            )
        )

        self.assertEqual(response.status_code, 404)


    def test_author_can_delete_comment(self):

        comment = CommentFactory(
            article=self.article,
            author=self.author,
            body="Delete me"
        )

        self.client.login(
            username="commenter",
            password="testpassword123"
        )

        self.client.post(
            reverse(
                "comments:comment_delete",
                args=[comment.pk]
            )
        )

        self.assertEqual(
            Comment.objects.count(),
            0
        )