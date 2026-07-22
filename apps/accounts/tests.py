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
        # After registration the client should be authenticated:
        self.assertTrue(response.wsgi_request.user.is_authenticated)