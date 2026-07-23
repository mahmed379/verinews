from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()


class RegistrationTests(TestCase):
    def test_register_creates_user_and_logs_in(self):
        response = self.client.post(reverse("accounts:register"), {
            "username": "testuser",
            "email": "test@example.com",
            "password1": "a-strong-test-password-1",
            "password2": "a-strong-test-password-1",
        })

        self.assertEqual(User.objects.count(), 1)
        self.assertRedirects(response, reverse("home"))
        self.assertTrue(response.wsgi_request.user.is_authenticated)


class LoginTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="test-password-123"
        )

    def test_login_success(self):
        response = self.client.post(reverse("accounts:login"), {
            "username": "testuser",
            "password": "test-password-123"
        })

        self.assertRedirects(response, reverse("home"))
        self.assertTrue(response.wsgi_request.user.is_authenticated)


class LogoutTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="test-password-123"
        )

    def test_logout_success(self):
        self.client.login(
            username="testuser",
            password="test-password-123"
        )

        response = self.client.get(reverse("accounts:logout"))

        self.assertRedirects(response, reverse("home"))
        self.assertFalse(response.wsgi_request.user.is_authenticated)