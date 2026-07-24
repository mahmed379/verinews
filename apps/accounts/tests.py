from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from apps.accounts.factories import UserFactory

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
        self.user = UserFactory(
            username="testuser",
            email="test@example.com",
            password="test-password-123",
        )

    def test_login_success(self):
        response = self.client.post(reverse("accounts:login"), {
            "username": "testuser",
            "password": "test-password-123",
        })

        self.assertRedirects(response, reverse("home"))
        self.assertTrue(response.wsgi_request.user.is_authenticated)


class LogoutTests(TestCase):
    def setUp(self):
        self.user = UserFactory(
            username="testuser",
            password="test-password-123",
        )

    def test_logout_success(self):
        self.client.login(
            username="testuser",
            password="test-password-123",
        )

        response = self.client.get(reverse("accounts:logout"))

        self.assertRedirects(response, reverse("home"))
        self.assertFalse(response.wsgi_request.user.is_authenticated)

class RegistrationTests(TestCase):

    def test_register_invalid_data_shows_form_again(self):
        response = self.client.post(
            reverse("accounts:register"),
            {
                "username": "",
                "email": "wrong-email",
                "password1": "123",
                "password2": "456",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(User.objects.count(), 0)
        self.assertContains(response, "form")


class LoginTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            password="test-password-123"
        )

    def test_login_with_wrong_password_fails(self):
        response = self.client.post(
            reverse("accounts:login"),
            {
                "username": "testuser",
                "password": "wrong-password",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.wsgi_request.user.is_authenticated)
def test_register_get_shows_form(self):
    response = self.client.get(
        reverse("accounts:register")
    )

    self.assertEqual(response.status_code, 200)
    self.assertContains(response, "Register")


def test_invalid_register_does_not_create_user(self):
    response = self.client.post(
        reverse("accounts:register"),
        {
            "username": "",
            "email": "wrong",
            "password1": "123",
            "password2": "456",
        },
    )

    self.assertEqual(response.status_code, 200)
    self.assertEqual(User.objects.count(), 0)

def test_account_dashboard_redirects(self):
    user = User.objects.create_user(
        username="dash",
        password="password123"
    )

    self.client.login(
        username="dash",
        password="password123"
    )

    response = self.client.get(
        reverse("accounts:dashboard")
    )

    self.assertRedirects(
        response,
        reverse("dashboard:dashboard")
    )

def test_user_can_register(self):
    response = self.client.post(
        reverse("accounts:register"),
        {
            "username": "newuser",
            "password1": "StrongPassword123!",
            "password2": "StrongPassword123!",
        }
    )

    self.assertEqual(response.status_code, 302)

    self.assertTrue(
        User.objects.filter(username="newuser").exists()
    )