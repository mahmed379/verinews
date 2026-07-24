from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from rest_framework.test import APIClient
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token

from apps.accounts.factories import (
    UserFactory,
    SuperUserFactory,
)
from apps.news.factories import NewsArticleFactory

from apps.reports.models import Report


User = get_user_model()


class APITestSetup(TestCase):

    def setUp(self):
        self.user = UserFactory(
            username="apiuser",
            password="test-password-123"
        )

        self.client = APIClient()

        self.client.force_authenticate(
            user=self.user
        )


class ArticleAPITests(APITestSetup):

    def test_create_article(self):
        response = self.client.post(
            "/api/articles/",
            {
                "title": "API Test Article",
                "description": "Created through API",
                "category": "technology",
                "source_url": "https://example.com"
            }
        )

        print(response.data)
        self.assertEqual(response.status_code, 201)


class CommentAPITests(APITestSetup):

    def test_create_comment(self):
        article = NewsArticleFactory(
            title="Test Article",
            description="Test",
            category="technology",
            submitted_by=self.user
        )

        response = self.client.post(
            "/api/comments/",
            {
                "article": article.id,
                "body": "Great article"
            }
        )

        print(response.data)
        self.assertEqual(response.status_code, 201)


class ReportAPITests(APITestSetup):

    def test_create_report(self):
        article = NewsArticleFactory(
            title="Test Article",
            description="Test",
            category="technology",
            submitted_by=self.user
        )

        response = self.client.post(
            "/api/reports/",
            {
                "article": article.id,
                "reason": "misleading"
            }
        )

        print(response.data)
        self.assertEqual(response.status_code, 201)

class ArticlePermissionTests(TestCase):

    def setUp(self):
        self.user = UserFactory(
            username="normaluser",
            password="password123"
        )

        self.admin = UserFactory(
            username="admin",
            password="password123",
            is_staff=True,
            is_superuser=True,
        )

        self.article = NewsArticleFactory(
            title="Delete Test",
            description="Testing permissions",
            category="technology",
            submitted_by=self.user
        )


    def test_anonymous_cannot_create_article(self):
        client = APIClient()

        response = client.post(
            "/api/articles/",
            {
                "title": "Anonymous Article",
                "description": "Should fail",
                "category": "technology",
                "source_url": "https://example.com"
            }
        )

        self.assertEqual(response.status_code, 403)


    def test_normal_user_cannot_delete_article(self):
        client = APIClient()

        client.force_authenticate(
            user=self.user
        )

        response = client.delete(
            f"/api/articles/{self.article.id}/"
        )

        self.assertEqual(response.status_code, 403)


    def test_superuser_can_delete_article(self):
        client = APIClient()

        client.force_authenticate(
            user=self.admin
        )

        response = client.delete(
            f"/api/articles/{self.article.id}/"
        )

        self.assertEqual(response.status_code, 204)

class ErrorResponseShapeTests(APITestCase):

    def setUp(self):
        self.user = UserFactory(
            username="erruser",
            password="password123"
        )

        self.token = Token.objects.create(
            user=self.user
        )


    def test_schema_endpoint_is_publicly_accessible(self):
        response = self.client.get(
            "/api/schema/"
        )

        self.assertEqual(
            response.status_code,
            200
        )


    def test_unauthenticated_error_has_consistent_shape(self):
        response = self.client.post(
            "/api/articles/",
            {
                "title": "Test Article"
            }
        )

        self.assertTrue(
            response.data["error"]
        )

        self.assertIn(
            "detail",
            response.data
        )


    def test_validation_error_includes_fields_key(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Token {self.token.key}"
        )

        response = self.client.post(
            "/api/articles/",
            {}
        )

        self.assertTrue(
            response.data["error"]
        )

        self.assertIn(
            "fields",
            response.data
        )

        self.assertIn(
            "title",
            response.data["fields"]
        )